import type { SQLiteDatabase } from 'expo-sqlite';

import { ensurePrebuiltDatabase, openDb } from '../../data/cellstrength_db/ts/initDb';

export type ProgressionResult = {
  movementId: number;
  movementSlug: string;
  movementName: string;
  fromStepId: number;
  fromStepNumber: number;
  fromStepName: string;
  toStepId: number;
  toStepNumber: number;
  toStepName: string;
  reason: string;
};

export const REQUIRED_AUTO_SUCCESS_SESSIONS = 2;

type MovementStepContext = {
  movementId: number;
  movementSlug: string;
  movementName: string;
  currentStepId: number;
  currentStepNumber: number;
  currentStepName: string;
};

let dbPromise: Promise<SQLiteDatabase> | null = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      await ensurePrebuiltDatabase();
      return openDb();
    })();
  }

  return dbPromise;
}

async function getMovementStepContext(db: SQLiteDatabase, slug: string) {
  return db.getFirstAsync<MovementStepContext>(
    `
      SELECT
        m.id AS movementId,
        m.slug AS movementSlug,
        m.name AS movementName,
        COALESCE(current_step.id, first_step.id) AS currentStepId,
        COALESCE(current_step.step_number, first_step.step_number) AS currentStepNumber,
        COALESCE(current_step.name, first_step.name) AS currentStepName
      FROM movement m
      LEFT JOIN user_movement_level uml ON uml.movement_id = m.id
      LEFT JOIN step current_step ON current_step.id = uml.current_step_id
      LEFT JOIN step first_step
        ON first_step.id = (
          SELECT s.id
          FROM step s
          WHERE s.movement_id = m.id
          ORDER BY s.step_number
          LIMIT 1
        )
      WHERE m.slug = ?
      LIMIT 1
    `,
    slug,
  );
}

async function changeMovementStepByOffset(
  db: SQLiteDatabase,
  movementId: number,
  offset: 1 | -1,
  reason: string,
  expectedFromStepId?: number,
): Promise<ProgressionResult | null> {
  const current = await db.getFirstAsync<MovementStepContext>(
    `
      SELECT
        m.id AS movementId,
        m.slug AS movementSlug,
        m.name AS movementName,
        COALESCE(current_step.id, first_step.id) AS currentStepId,
        COALESCE(current_step.step_number, first_step.step_number) AS currentStepNumber,
        COALESCE(current_step.name, first_step.name) AS currentStepName
      FROM movement m
      LEFT JOIN user_movement_level uml ON uml.movement_id = m.id
      LEFT JOIN step current_step ON current_step.id = uml.current_step_id
      LEFT JOIN step first_step
        ON first_step.id = (
          SELECT s.id
          FROM step s
          WHERE s.movement_id = m.id
          ORDER BY s.step_number
          LIMIT 1
        )
      WHERE m.id = ?
      LIMIT 1
    `,
    movementId,
  );

  if (!current) {
    throw new Error(`No se encontro el movimiento ${movementId}`);
  }

  if (expectedFromStepId && current.currentStepId !== expectedFromStepId) {
    return null;
  }

  const target = await db.getFirstAsync<{
    stepId: number;
    stepNumber: number;
    stepName: string;
  }>(
    `
      SELECT
        id AS stepId,
        step_number AS stepNumber,
        name AS stepName
      FROM step
      WHERE movement_id = ?
        AND step_number = ?
      LIMIT 1
    `,
    [movementId, current.currentStepNumber + offset],
  );

  if (!target) {
    return null;
  }

  const now = new Date().toISOString();

  await db.runAsync(
    `
      INSERT INTO user_movement_level (movement_id, current_step_id, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(movement_id)
      DO UPDATE SET
        current_step_id = excluded.current_step_id,
        updated_at = excluded.updated_at
    `,
    [movementId, target.stepId, now],
  );

  await db.runAsync(
    `
      INSERT INTO progression_event (movement_id, from_step_id, to_step_id, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    [movementId, current.currentStepId, target.stepId, reason, now],
  );

  return {
    movementId: current.movementId,
    movementSlug: current.movementSlug,
    movementName: current.movementName,
    fromStepId: current.currentStepId,
    fromStepNumber: current.currentStepNumber,
    fromStepName: current.currentStepName,
    toStepId: target.stepId,
    toStepNumber: target.stepNumber,
    toStepName: target.stepName,
    reason,
  };
}

export async function advanceMovementManually(slug: string) {
  const db = await getDb();
  const context = await getMovementStepContext(db, slug);

  if (!context) {
    throw new Error(`No se encontro el movimiento ${slug}`);
  }

  return changeMovementStepByOffset(db, context.movementId, 1, 'manual_advance');
}

export async function regressMovementManually(slug: string) {
  const db = await getDb();
  const context = await getMovementStepContext(db, slug);

  if (!context) {
    throw new Error(`No se encontro el movimiento ${slug}`);
  }

  return changeMovementStepByOffset(db, context.movementId, -1, 'manual_regress');
}

export async function applyAutomaticProgressionForSession(sessionId: number) {
  const db = await getDb();

  const candidates = await db.getAllAsync<{
    movementId: number;
    movementSlug: string;
    movementName: string;
    stepId: number;
    targetSets: number | null;
    loggedSets: number;
  }>(
    `
      SELECT
        m.id AS movementId,
        m.slug AS movementSlug,
        m.name AS movementName,
        stp.id AS stepId,
        tgt.target_sets AS targetSets,
        COALESCE(COUNT(sl.id), 0) AS loggedSets
      FROM session_exercise se
      INNER JOIN step stp ON stp.id = se.step_id
      INNER JOIN movement m ON m.id = stp.movement_id
      LEFT JOIN step_target tgt ON tgt.id = se.step_target_id
      LEFT JOIN set_log sl ON sl.session_exercise_id = se.id
      WHERE se.session_id = ?
      GROUP BY se.id, m.id, m.slug, m.name, stp.id, tgt.target_sets
      ORDER BY se.position
    `,
    sessionId,
  );

  const results: ProgressionResult[] = [];
  const promotedMovements = new Set<number>();

  await db.execAsync('BEGIN TRANSACTION;');
  try {
    for (const candidate of candidates) {
      if (promotedMovements.has(candidate.movementId)) continue;
      if (!candidate.targetSets || candidate.loggedSets < candidate.targetSets) continue;

      const qualifyingSessions = await db.getFirstAsync<{ completedCount: number }>(
        `
          SELECT COUNT(*) AS completedCount
          FROM (
            SELECT s.id
            FROM session s
            INNER JOIN session_exercise se ON se.session_id = s.id
            LEFT JOIN step_target tgt ON tgt.id = se.step_target_id
            LEFT JOIN set_log sl ON sl.session_exercise_id = se.id
            WHERE s.finished_at IS NOT NULL
              AND se.step_id = ?
              AND COALESCE(s.finished_at, s.started_at) > COALESCE((
                SELECT MAX(pe.created_at)
                FROM progression_event pe
                WHERE pe.movement_id = ?
                  AND pe.reason = 'auto_session_completion'
              ), '')
            GROUP BY s.id, tgt.target_sets
            HAVING COALESCE(COUNT(sl.id), 0) >= COALESCE(tgt.target_sets, 999999)
            ORDER BY s.finished_at DESC, s.id DESC
            LIMIT ?
          ) recent_success
        `,
        [candidate.stepId, candidate.movementId, REQUIRED_AUTO_SUCCESS_SESSIONS],
      );

      if ((qualifyingSessions?.completedCount ?? 0) < REQUIRED_AUTO_SUCCESS_SESSIONS) continue;

      const result = await changeMovementStepByOffset(
        db,
        candidate.movementId,
        1,
        'auto_session_completion',
        candidate.stepId,
      );

      if (result) {
        results.push(result);
        promotedMovements.add(candidate.movementId);
      }
    }

    await db.execAsync('COMMIT;');
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    throw error;
  }

  return results;
}
