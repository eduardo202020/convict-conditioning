import type { SQLiteDatabase } from 'expo-sqlite';

import { ensurePrebuiltDatabase, openDb } from '../../data/cellstrength_db/ts/initDb';
import { REQUIRED_AUTO_SUCCESS_SESSIONS } from './progression';

export type ProgressMovementSummary = {
  movementId: number;
  slug: string;
  name: string;
  currentStepNumber: number;
  currentStepName: string;
  nextTarget: string | null;
  completionRatio: number;
  autoProgressSuccessCount: number;
  autoProgressRequiredCount: number;
};

export type ProgressMovementDetail = {
  movementId: number;
  slug: string;
  name: string;
  currentStepNumber: number;
  currentStepName: string;
  currentStepGoal: string | null;
  nextStepNumber: number | null;
  nextStepName: string | null;
  nextStepGoal: string | null;
  masterStepName: string | null;
  completionRatio: number;
  latestProgressionAt: string | null;
  latestProgressionReason: string | null;
  autoProgressSuccessCount: number;
  autoProgressRequiredCount: number;
};

export type RecentSessionSummary = {
  sessionId: number;
  programName: string;
  startedAt: string;
  finishedAt: string | null;
  totalSets: number;
};

export type RecentMovementSession = {
  sessionId: number;
  startedAt: string;
  stepName: string;
  stepNumber: number;
  totalSets: number;
  totalReps: number | null;
  totalHoldSec: number | null;
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

export async function getProgressSummary(): Promise<ProgressMovementSummary[]> {
  const db = await getDb();

  const rows = await db.getAllAsync<{
    movementId: number;
    slug: string;
    name: string;
    currentStepNumber: number;
    currentStepName: string;
    nextTarget: string | null;
    autoProgressSuccessCount: number;
  }>(
    `
      SELECT
        m.id AS movementId,
        m.slug AS slug,
        m.name AS name,
        COALESCE(current_step.step_number, first_step.step_number) AS currentStepNumber,
        COALESCE(current_step.name, first_step.name) AS currentStepName,
        next_target.raw_target AS nextTarget,
        COALESCE(success_window.completedCount, 0) AS autoProgressSuccessCount
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
      LEFT JOIN step next_step
        ON next_step.movement_id = m.id
       AND next_step.step_number = COALESCE(current_step.step_number, first_step.step_number) + 1
      LEFT JOIN step_target next_target
        ON next_target.step_id = next_step.id
       AND next_target.scheme_id = 1
      LEFT JOIN (
        SELECT
          current_state.movementId AS movementId,
          COUNT(*) AS completedCount
        FROM (
          SELECT
            m.id AS movementId,
            COALESCE(current_step.id, first_step.id) AS currentStepId,
            COALESCE((
              SELECT MAX(pe.created_at)
              FROM progression_event pe
              WHERE pe.movement_id = m.id
            ), '') AS lastProgressionAt
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
        ) current_state
        INNER JOIN (
          SELECT
            s.id AS sessionId,
            stp.movement_id AS movementId,
            se.step_id AS stepId,
            COALESCE(s.finished_at, s.started_at) AS closedAt,
            COALESCE(COUNT(sl.id), 0) AS loggedSets,
            tgt.target_sets AS targetSets
          FROM session s
          INNER JOIN session_exercise se ON se.session_id = s.id
          INNER JOIN step stp ON stp.id = se.step_id
          LEFT JOIN step_target tgt ON tgt.id = se.step_target_id
          LEFT JOIN set_log sl ON sl.session_exercise_id = se.id
          WHERE s.finished_at IS NOT NULL
          GROUP BY s.id, stp.movement_id, se.step_id, COALESCE(s.finished_at, s.started_at), tgt.target_sets
        ) session_success
          ON session_success.movementId = current_state.movementId
         AND session_success.stepId = current_state.currentStepId
         AND session_success.closedAt > current_state.lastProgressionAt
         AND session_success.loggedSets >= COALESCE(session_success.targetSets, 999999)
        GROUP BY current_state.movementId
      ) success_window
        ON success_window.movementId = m.id
      ORDER BY m.id
    `,
  );

  return rows.map((row) => ({
    movementId: row.movementId,
    slug: row.slug,
    name: row.name,
    currentStepNumber: row.currentStepNumber,
    currentStepName: row.currentStepName,
    nextTarget: row.nextTarget,
    completionRatio: row.currentStepNumber / 10,
    autoProgressSuccessCount: row.autoProgressSuccessCount,
    autoProgressRequiredCount: REQUIRED_AUTO_SUCCESS_SESSIONS,
  }));
}

export async function getMovementProgressDetail(slug: string): Promise<ProgressMovementDetail | null> {
  const db = await getDb();

  const detail = await db.getFirstAsync<{
    movementId: number;
    slug: string;
    name: string;
    currentStepNumber: number;
    currentStepName: string;
    currentStepGoal: string | null;
    nextStepNumber: number | null;
    nextStepName: string | null;
    nextStepGoal: string | null;
    masterStepName: string | null;
    latestProgressionAt: string | null;
    latestProgressionReason: string | null;
    autoProgressSuccessCount: number;
  }>(
    `
      SELECT
        m.id AS movementId,
        m.slug AS slug,
        m.name AS name,
        COALESCE(current_step.step_number, first_step.step_number) AS currentStepNumber,
        COALESCE(current_step.name, first_step.name) AS currentStepName,
        current_target.raw_target AS currentStepGoal,
        next_step.step_number AS nextStepNumber,
        next_step.name AS nextStepName,
        next_target.raw_target AS nextStepGoal,
        master_step.name AS masterStepName
        ,
        latest_event.created_at AS latestProgressionAt,
        latest_event.reason AS latestProgressionReason,
        COALESCE(success_window.completedCount, 0) AS autoProgressSuccessCount
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
      LEFT JOIN step_target current_target
        ON current_target.step_id = COALESCE(current_step.id, first_step.id)
       AND current_target.scheme_id = 1
      LEFT JOIN step next_step
        ON next_step.movement_id = m.id
       AND next_step.step_number = COALESCE(current_step.step_number, first_step.step_number) + 1
      LEFT JOIN step_target next_target
        ON next_target.step_id = next_step.id
       AND next_target.scheme_id = 1
      LEFT JOIN step master_step
        ON master_step.movement_id = m.id
       AND master_step.is_master_step = 1
      LEFT JOIN progression_event latest_event
        ON latest_event.id = (
          SELECT pe.id
          FROM progression_event pe
          WHERE pe.movement_id = m.id
          ORDER BY pe.created_at DESC, pe.id DESC
          LIMIT 1
        )
      LEFT JOIN (
        SELECT
          current_state.movementId AS movementId,
          COUNT(*) AS completedCount
        FROM (
          SELECT
            m.id AS movementId,
            COALESCE(current_step.id, first_step.id) AS currentStepId,
            COALESCE((
              SELECT MAX(pe.created_at)
              FROM progression_event pe
              WHERE pe.movement_id = m.id
            ), '') AS lastProgressionAt
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
        ) current_state
        INNER JOIN (
          SELECT
            s.id AS sessionId,
            stp.movement_id AS movementId,
            se.step_id AS stepId,
            COALESCE(s.finished_at, s.started_at) AS closedAt,
            COALESCE(COUNT(sl.id), 0) AS loggedSets,
            tgt.target_sets AS targetSets
          FROM session s
          INNER JOIN session_exercise se ON se.session_id = s.id
          INNER JOIN step stp ON stp.id = se.step_id
          LEFT JOIN step_target tgt ON tgt.id = se.step_target_id
          LEFT JOIN set_log sl ON sl.session_exercise_id = se.id
          WHERE s.finished_at IS NOT NULL
          GROUP BY s.id, stp.movement_id, se.step_id, COALESCE(s.finished_at, s.started_at), tgt.target_sets
        ) session_success
          ON session_success.movementId = current_state.movementId
         AND session_success.stepId = current_state.currentStepId
         AND session_success.closedAt > current_state.lastProgressionAt
         AND session_success.loggedSets >= COALESCE(session_success.targetSets, 999999)
        GROUP BY current_state.movementId
      ) success_window
        ON success_window.movementId = m.id
      WHERE m.slug = ?
      LIMIT 1
    `,
    slug,
  );

  if (!detail) return null;

  return {
    movementId: detail.movementId,
    slug: detail.slug,
    name: detail.name,
    currentStepNumber: detail.currentStepNumber,
    currentStepName: detail.currentStepName,
    currentStepGoal: detail.currentStepGoal,
    nextStepNumber: detail.nextStepNumber,
    nextStepName: detail.nextStepName,
    nextStepGoal: detail.nextStepGoal,
    masterStepName: detail.masterStepName,
    completionRatio: detail.currentStepNumber / 10,
    latestProgressionAt: detail.latestProgressionAt,
    latestProgressionReason: detail.latestProgressionReason,
    autoProgressSuccessCount: detail.autoProgressSuccessCount,
    autoProgressRequiredCount: REQUIRED_AUTO_SUCCESS_SESSIONS,
  };
}

export async function getRecentSessions(limit = 5): Promise<RecentSessionSummary[]> {
  const db = await getDb();

  return db.getAllAsync<RecentSessionSummary>(
    `
      SELECT
        s.id AS sessionId,
        p.name AS programName,
        s.started_at AS startedAt,
        s.finished_at AS finishedAt,
        COALESCE(COUNT(sl.id), 0) AS totalSets
      FROM session s
      LEFT JOIN program p ON p.id = s.program_id
      LEFT JOIN session_exercise se ON se.session_id = s.id
      LEFT JOIN set_log sl ON sl.session_exercise_id = se.id
      GROUP BY s.id, p.name, s.started_at, s.finished_at
      ORDER BY s.started_at DESC
      LIMIT ?
    `,
    limit,
  );
}

export async function getRecentMovementSessions(
  slug: string,
  limit = 4,
): Promise<RecentMovementSession[]> {
  const db = await getDb();

  return db.getAllAsync<RecentMovementSession>(
    `
      SELECT
        s.id AS sessionId,
        s.started_at AS startedAt,
        stp.name AS stepName,
        stp.step_number AS stepNumber,
        COALESCE(COUNT(sl.id), 0) AS totalSets,
        SUM(sl.reps) AS totalReps,
        SUM(sl.hold_sec) AS totalHoldSec
      FROM session s
      INNER JOIN session_exercise se ON se.session_id = s.id
      INNER JOIN step stp ON stp.id = se.step_id
      INNER JOIN movement m ON m.id = stp.movement_id
      LEFT JOIN set_log sl ON sl.session_exercise_id = se.id
      WHERE m.slug = ?
      GROUP BY s.id, s.started_at, stp.name, stp.step_number
      ORDER BY s.started_at DESC
      LIMIT ?
    `,
    [slug, limit],
  );
}
