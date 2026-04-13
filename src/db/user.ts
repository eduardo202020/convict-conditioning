import type { SQLiteDatabase } from 'expo-sqlite';

import { ensurePrebuiltDatabase, openDb } from '../../data/cellstrength_db/ts/initDb';

export type SelectableProgram = {
  code: string;
  name: string;
  description: string | null;
  daysPerWeek: number;
  isActive: boolean;
};

export type MovementLevel = {
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

export async function getPrograms(): Promise<SelectableProgram[]> {
  const db = await getDb();

  return db.getAllAsync<SelectableProgram>(
    `
      SELECT
        code,
        name,
        description,
        days_per_week AS daysPerWeek,
        is_active AS isActive
      FROM program
      ORDER BY id
    `,
  );
}

export async function getActiveProgramCode(): Promise<string | null> {
  const db = await getDb();
  const program = await db.getFirstAsync<{ code: string }>(
    `
      SELECT code
      FROM program
      WHERE is_active = 1
      ORDER BY id
      LIMIT 1
    `,
  );

  return program?.code ?? null;
}

export async function setActiveProgram(programCode: string): Promise<void> {
  const db = await getDb();
  await db.execAsync('UPDATE program SET is_active = 0;');
  await db.runAsync('UPDATE program SET is_active = 1 WHERE code = ?;', programCode);
}

export async function getMovementLevels(): Promise<MovementLevel[]> {
  const db = await getDb();

  return db.getAllAsync<MovementLevel>(
    `
      SELECT
        m.id AS movementId,
        m.slug AS movementSlug,
        m.name AS movementName,
        COALESCE(uml.current_step_id, first_step.id) AS currentStepId,
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
      ORDER BY m.id
    `,
  );
}

export async function setMovementLevel(movementId: number, stepNumber: number): Promise<void> {
  const db = await getDb();
  const step = await db.getFirstAsync<{ id: number }>(
    `
      SELECT id
      FROM step
      WHERE movement_id = ? AND step_number = ?
      LIMIT 1
    `,
    [movementId, stepNumber],
  );

  if (!step) {
    throw new Error(`No se encontro el paso ${stepNumber} para el movimiento ${movementId}`);
  }

  await db.runAsync(
    `
      INSERT INTO user_movement_level (movement_id, current_step_id, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(movement_id)
      DO UPDATE SET
        current_step_id = excluded.current_step_id,
        updated_at = excluded.updated_at
    `,
    [movementId, step.id, new Date().toISOString()],
  );
}

export async function saveInitialSetup(programCode: string, levels: Array<{ movementId: number; stepNumber: number }>) {
  const db = await getDb();

  await db.execAsync('BEGIN TRANSACTION;');
  try {
    await db.execAsync('UPDATE program SET is_active = 0;');
    await db.runAsync('UPDATE program SET is_active = 1 WHERE code = ?;', programCode);

    for (const level of levels) {
      const step = await db.getFirstAsync<{ id: number }>(
        `
          SELECT id
          FROM step
          WHERE movement_id = ? AND step_number = ?
          LIMIT 1
        `,
        [level.movementId, level.stepNumber],
      );

      if (!step) continue;

      await db.runAsync(
        `
          INSERT INTO user_movement_level (movement_id, current_step_id, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(movement_id)
          DO UPDATE SET
            current_step_id = excluded.current_step_id,
            updated_at = excluded.updated_at
        `,
        [level.movementId, step.id, new Date().toISOString()],
      );
    }

    await db.execAsync('COMMIT;');
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    throw error;
  }
}
