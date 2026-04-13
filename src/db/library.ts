import type { SQLiteDatabase } from 'expo-sqlite';

import { ensurePrebuiltDatabase, openDb } from '../../data/cellstrength_db/ts/initDb';

export type LibraryMovement = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  stepCount: number;
};

export type LibraryStep = {
  id: number;
  stepNumber: number;
  name: string;
  goal: string | null;
  isMasterStep: boolean;
};

export type StepTarget = {
  schemeCode: string;
  schemeName: string;
  rawTarget: string | null;
};

export type StepMedia = {
  id: number;
  kind: string;
  uri: string;
  credit: string | null;
  sortOrder: number;
};

export type StepDetail = {
  id: number;
  movementSlug: string;
  movementName: string;
  stepNumber: number;
  name: string;
  goal: string | null;
  techniqueNotes: string | null;
  isMasterStep: boolean;
  targets: StepTarget[];
  media: StepMedia[];
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

export async function getLibraryMovements(): Promise<LibraryMovement[]> {
  const db = await getDb();

  return db.getAllAsync<LibraryMovement>(
    `
      SELECT
        m.id,
        m.slug,
        m.name,
        m.description,
        COUNT(s.id) AS stepCount
      FROM movement m
      LEFT JOIN step s ON s.movement_id = m.id
      GROUP BY m.id, m.slug, m.name, m.description
      ORDER BY m.id
    `,
  );
}

export async function getMovementSteps(movementSlug: string): Promise<LibraryStep[]> {
  const db = await getDb();

  return db.getAllAsync<LibraryStep>(
    `
      SELECT
        s.id,
        s.step_number AS stepNumber,
        s.name,
        s.goal,
        s.is_master_step AS isMasterStep
      FROM step s
      INNER JOIN movement m ON m.id = s.movement_id
      WHERE m.slug = ?
      ORDER BY s.step_number
    `,
    movementSlug,
  );
}

export async function getStepDetail(movementSlug: string, stepNumber?: number): Promise<StepDetail | null> {
  const db = await getDb();

  const step = await db.getFirstAsync<{
    id: number;
    movementSlug: string;
    movementName: string;
    stepNumber: number;
    name: string;
    goal: string | null;
    techniqueNotes: string | null;
    isMasterStep: number;
  }>(
    `
      SELECT
        s.id,
        m.slug AS movementSlug,
        m.name AS movementName,
        s.step_number AS stepNumber,
        s.name,
        s.goal,
        s.technique_notes AS techniqueNotes,
        s.is_master_step AS isMasterStep
      FROM step s
      INNER JOIN movement m ON m.id = s.movement_id
      WHERE m.slug = ?
        AND s.step_number = COALESCE(?, 1)
      LIMIT 1
    `,
    [movementSlug, stepNumber ?? null],
  );

  if (!step) return null;

  const targets = await db.getAllAsync<StepTarget>(
    `
      SELECT
        sc.code AS schemeCode,
        sc.name AS schemeName,
        st.raw_target AS rawTarget
      FROM step_target st
      INNER JOIN scheme sc ON sc.id = st.scheme_id
      WHERE st.step_id = ?
      ORDER BY sc.id
    `,
    step.id,
  );

  const media = await db.getAllAsync<StepMedia>(
    `
      SELECT
        id,
        kind,
        uri,
        credit,
        sort_order AS sortOrder
      FROM step_media
      WHERE step_id = ?
      ORDER BY sort_order, id
    `,
    step.id,
  );

  return {
    id: step.id,
    movementSlug: step.movementSlug,
    movementName: step.movementName,
    stepNumber: step.stepNumber,
    name: step.name,
    goal: step.goal,
    techniqueNotes: step.techniqueNotes,
    isMasterStep: Boolean(step.isMasterStep),
    targets,
    media,
  };
}
