import type { SQLiteDatabase } from 'expo-sqlite';

import { ensurePrebuiltDatabase, openDb } from '../../data/cellstrength_db/ts/initDb';
import { applyAutomaticProgressionForSession, type ProgressionResult } from './progression';
import { getActiveProgramCode } from './user';

export type SessionExerciseState = {
  sessionExerciseId: number;
  position: number;
  movementName: string;
  stepName: string;
  stepNumber: number | null;
  targetRaw: string | null;
  targetSets: number | null;
  targetReps: number | null;
  targetRepsMin: number | null;
  targetRepsMax: number | null;
  targetHoldSec: number | null;
  restSec: number | null;
  loggedSets: number;
};

export type ActiveSessionState = {
  sessionId: number;
  programName: string;
  startedAt: string;
  exercises: SessionExerciseState[];
};

export type SessionSummary = {
  sessionId: number;
  programName: string;
  startedAt: string;
  finishedAt: string | null;
  totalSets: number;
  totalExercises: number;
  completedExercises: number;
  autoProgressions?: ProgressionResult[];
};

const DEFAULT_PROGRAM_CODE = 'veterano';

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

function getTodayProgramDayIndex(daysPerWeek: number) {
  const day = new Date().getDay();

  if (daysPerWeek === 6) {
    return day === 0 ? null : day;
  }

  if (daysPerWeek === 3) {
    if (day === 1) return 1;
    if (day === 3) return 2;
    if (day === 5) return 3;
    return null;
  }

  if (daysPerWeek === 2) {
    if (day === 1) return 1;
    if (day === 5) return 2;
    return null;
  }

  if (day === 0) return null;

  return Math.min(day, daysPerWeek);
}

async function getTodaySessionContext() {
  const db = await getDb();
  const activeCode = (await getActiveProgramCode()) ?? DEFAULT_PROGRAM_CODE;

  const program = await db.getFirstAsync<{
    programId: number;
    programName: string;
    schemeId: number;
    daysPerWeek: number;
  }>(
    `
      SELECT
        id AS programId,
        name AS programName,
        scheme_id AS schemeId,
        days_per_week AS daysPerWeek
      FROM program
      WHERE code = ?
      LIMIT 1
    `,
    activeCode,
  );

  if (!program) {
    throw new Error(`No se encontro el programa activo ${activeCode}`);
  }

  const dayIndex = getTodayProgramDayIndex(program.daysPerWeek);

  if (!dayIndex) {
    return {
      ...program,
      dayIndex: null,
      programDayId: null,
    };
  }

  const day = await db.getFirstAsync<{ programDayId: number }>(
    `
      SELECT id AS programDayId
      FROM program_day
      WHERE program_id = ? AND day_index = ?
      LIMIT 1
    `,
    [program.programId, dayIndex],
  );

  return {
    ...program,
    dayIndex,
    programDayId: day?.programDayId ?? null,
  };
}

async function createSessionForToday() {
  const db = await getDb();
  const context = await getTodaySessionContext();

  if (!context.programDayId || !context.dayIndex) {
    throw new Error('Hoy no hay un bloque de programa para registrar.');
  }

  const now = new Date().toISOString();
  const created = await db.runAsync(
    `
      INSERT INTO session (program_id, program_day_id, started_at)
      VALUES (?, ?, ?)
    `,
    [context.programId, context.programDayId, now],
  );

  const sessionId = created.lastInsertRowId;

  const blueprint = await db.getAllAsync<{
    stepId: number | null;
    stepTargetId: number | null;
    position: number;
  }>(
    `
      SELECT
        COALESCE(
          de.step_id,
          uml.current_step_id,
          first_step.id
        ) AS stepId,
        st.id AS stepTargetId,
        de.position AS position
      FROM day_exercise de
      LEFT JOIN user_movement_level uml ON uml.movement_id = de.movement_id
      LEFT JOIN step first_step
        ON first_step.id = (
          SELECT s.id
          FROM step s
          WHERE s.movement_id = de.movement_id
          ORDER BY s.step_number
          LIMIT 1
        )
      LEFT JOIN step_target st
        ON st.step_id = COALESCE(de.step_id, uml.current_step_id, first_step.id)
       AND st.scheme_id = ?
      WHERE de.program_day_id = ?
        AND COALESCE(de.step_id, uml.current_step_id, first_step.id) IS NOT NULL
      ORDER BY de.position
    `,
    [context.schemeId, context.programDayId],
  );

  for (const row of blueprint) {
    await db.runAsync(
      `
        INSERT INTO session_exercise (session_id, step_id, step_target_id, position)
        VALUES (?, ?, ?, ?)
      `,
      [sessionId, row.stepId, row.stepTargetId, row.position],
    );
  }

  return sessionId;
}

export async function getOrCreateActiveSession(): Promise<ActiveSessionState | null> {
  const db = await getDb();
  const context = await getTodaySessionContext();

  if (!context.programDayId || !context.dayIndex) {
    return null;
  }

  const activeSession = await db.getFirstAsync<{ sessionId: number }>(
    `
      SELECT id AS sessionId
      FROM session
      WHERE program_day_id = ?
        AND finished_at IS NULL
      ORDER BY id DESC
      LIMIT 1
    `,
    context.programDayId,
  );

  const sessionId = activeSession?.sessionId ?? (await createSessionForToday());
  return getActiveSessionState(sessionId);
}

export async function getActiveSessionState(sessionId: number): Promise<ActiveSessionState> {
  const db = await getDb();

  const header = await db.getFirstAsync<{
    sessionId: number;
    programName: string;
    startedAt: string;
  }>(
    `
      SELECT
        s.id AS sessionId,
        p.name AS programName,
        s.started_at AS startedAt
      FROM session s
      LEFT JOIN program p ON p.id = s.program_id
      WHERE s.id = ?
      LIMIT 1
    `,
    sessionId,
  );

  if (!header) {
    throw new Error(`No se encontro la sesion ${sessionId}`);
  }

  const exercises = await db.getAllAsync<SessionExerciseState>(
    `
      SELECT
        se.id AS sessionExerciseId,
        se.position AS position,
        m.name AS movementName,
        stp.name AS stepName,
        stp.step_number AS stepNumber,
        tgt.raw_target AS targetRaw,
        tgt.target_sets AS targetSets,
        tgt.target_reps AS targetReps,
        tgt.target_reps_min AS targetRepsMin,
        tgt.target_reps_max AS targetRepsMax,
        tgt.target_hold_sec AS targetHoldSec,
        tgt.rest_sec AS restSec,
        COALESCE((
          SELECT COUNT(*)
          FROM set_log sl
          WHERE sl.session_exercise_id = se.id
        ), 0) AS loggedSets
      FROM session_exercise se
      INNER JOIN step stp ON stp.id = se.step_id
      INNER JOIN movement m ON m.id = stp.movement_id
      LEFT JOIN step_target tgt ON tgt.id = se.step_target_id
      WHERE se.session_id = ?
      ORDER BY se.position
    `,
    sessionId,
  );

  return {
    sessionId: header.sessionId,
    programName: header.programName,
    startedAt: header.startedAt,
    exercises,
  };
}

function deriveSetPayload(exercise: SessionExerciseState) {
  const reps = exercise.targetReps ?? exercise.targetRepsMin ?? null;
  const holdSec = exercise.targetHoldSec ?? null;
  return {
    reps,
    holdSec,
    restSec: exercise.restSec ?? 90,
  };
}

export async function logSetForExercise(sessionExerciseId: number): Promise<ActiveSessionState> {
  const db = await getDb();

  const exercise = await db.getFirstAsync<SessionExerciseState>(
    `
      SELECT
        se.id AS sessionExerciseId,
        se.position AS position,
        m.name AS movementName,
        stp.name AS stepName,
        stp.step_number AS stepNumber,
        tgt.raw_target AS targetRaw,
        tgt.target_sets AS targetSets,
        tgt.target_reps AS targetReps,
        tgt.target_reps_min AS targetRepsMin,
        tgt.target_reps_max AS targetRepsMax,
        tgt.target_hold_sec AS targetHoldSec,
        tgt.rest_sec AS restSec,
        COALESCE((
          SELECT COUNT(*)
          FROM set_log sl
          WHERE sl.session_exercise_id = se.id
        ), 0) AS loggedSets
      FROM session_exercise se
      INNER JOIN step stp ON stp.id = se.step_id
      INNER JOIN movement m ON m.id = stp.movement_id
      LEFT JOIN step_target tgt ON tgt.id = se.step_target_id
      WHERE se.id = ?
      LIMIT 1
    `,
    sessionExerciseId,
  );

  if (!exercise) {
    throw new Error(`No se encontro el bloque ${sessionExerciseId}`);
  }

  const payload = deriveSetPayload(exercise);

  await db.runAsync(
    `
      INSERT INTO set_log (session_exercise_id, set_index, reps, hold_sec, rest_sec, completed)
      VALUES (?, ?, ?, ?, ?, 1)
    `,
    [sessionExerciseId, exercise.loggedSets + 1, payload.reps, payload.holdSec, payload.restSec],
  );

  const session = await db.getFirstAsync<{ sessionId: number }>(
    `
      SELECT session_id AS sessionId
      FROM session_exercise
      WHERE id = ?
      LIMIT 1
    `,
    sessionExerciseId,
  );

  if (!session) {
    throw new Error('No se encontro la sesion asociada al bloque.');
  }

  return getActiveSessionState(session.sessionId);
}

export async function finishSession(sessionId: number): Promise<SessionSummary> {
  const db = await getDb();
  const existing = await db.getFirstAsync<{ finishedAt: string | null }>(
    `
      SELECT finished_at AS finishedAt
      FROM session
      WHERE id = ?
      LIMIT 1
    `,
    sessionId,
  );

  const autoProgressions = existing?.finishedAt ? [] : await applyAutomaticProgressionForSession(sessionId);

  await db.runAsync(
    `
      UPDATE session
      SET finished_at = ?
      WHERE id = ?
    `,
    [new Date().toISOString(), sessionId],
  );

  const summary = await getSessionSummary(sessionId);
  return {
    ...summary,
    autoProgressions,
  };
}

export async function getSessionSummary(sessionId: number): Promise<SessionSummary> {
  const db = await getDb();

  const summary = await db.getFirstAsync<SessionSummary>(
    `
      SELECT
        s.id AS sessionId,
        p.name AS programName,
        s.started_at AS startedAt,
        s.finished_at AS finishedAt,
        COALESCE((
          SELECT COUNT(*)
          FROM set_log sl
          INNER JOIN session_exercise se ON se.id = sl.session_exercise_id
          WHERE se.session_id = s.id
        ), 0) AS totalSets,
        COALESCE((
          SELECT COUNT(*)
          FROM session_exercise se
          WHERE se.session_id = s.id
        ), 0) AS totalExercises,
        COALESCE((
          SELECT COUNT(*)
          FROM session_exercise se
          WHERE se.session_id = s.id
            AND EXISTS (
              SELECT 1
              FROM set_log sl
              WHERE sl.session_exercise_id = se.id
            )
        ), 0) AS completedExercises
      FROM session s
      LEFT JOIN program p ON p.id = s.program_id
      WHERE s.id = ?
      LIMIT 1
    `,
    sessionId,
  );

  if (!summary) {
    throw new Error(`No se encontro el resumen de la sesion ${sessionId}`);
  }

  return summary;
}
