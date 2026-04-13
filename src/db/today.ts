import type { SQLiteDatabase } from 'expo-sqlite';

import { ensurePrebuiltDatabase, openDb } from '../../data/cellstrength_db/ts/initDb';

export type TodayExercise = {
  position: number;
  movementSlug: string | null;
  movementName: string;
  stepNumber: number | null;
  stepName: string | null;
  prescription: string | null;
};

export type ProgramDaySchedule = {
  dayIndex: number;
  title: string | null;
  items: Array<{
    position: number;
    movementName: string;
    customName: string | null;
    prescription: string | null;
  }>;
};

export type CurrentProgram = {
  code: string;
  name: string;
  description: string | null;
  daysPerWeek: number;
};

export type TodayDossier = {
  program: CurrentProgram;
  todayLabel: string;
  isRestDay: boolean;
  exercises: TodayExercise[];
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

function getTodayLabel() {
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date());
}

export async function getCurrentProgram(code = DEFAULT_PROGRAM_CODE): Promise<CurrentProgram> {
  const db = await getDb();

  const program = await db.getFirstAsync<{
    code: string;
    name: string;
    description: string | null;
    daysPerWeek: number;
  }>(
    `
      SELECT
        code,
        name,
        description,
        days_per_week AS daysPerWeek
      FROM program
      WHERE code = ?
      LIMIT 1
    `,
    code,
  );

  if (!program) {
    throw new Error(`No se encontro el programa ${code}`);
  }

  return program;
}

export async function getTodayDossier(code = DEFAULT_PROGRAM_CODE): Promise<TodayDossier> {
  const db = await getDb();
  const program = await getCurrentProgram(code);
  const dayIndex = getTodayProgramDayIndex(program.daysPerWeek);

  if (!dayIndex) {
    return {
      program,
      todayLabel: getTodayLabel(),
      isRestDay: true,
      exercises: [],
    };
  }

  const exercises = await db.getAllAsync<TodayExercise>(
    `
      SELECT
        de.position AS position,
        m.slug AS movementSlug,
        COALESCE(m.name, de.custom_name) AS movementName,
        s.step_number AS stepNumber,
        s.name AS stepName,
        de.prescription AS prescription
      FROM day_exercise de
      INNER JOIN program_day pd ON pd.id = de.program_day_id
      LEFT JOIN movement m ON m.id = de.movement_id
      LEFT JOIN step s ON s.id = COALESCE(
        (
          SELECT uml.current_step_id
          FROM user_movement_level uml
          WHERE uml.movement_id = de.movement_id
          LIMIT 1
        ),
        (
          SELECT st.id
          FROM step st
          WHERE st.movement_id = de.movement_id
          ORDER BY st.step_number
          LIMIT 1
        )
      )
      WHERE pd.program_id = (SELECT id FROM program WHERE code = ? LIMIT 1)
        AND pd.day_index = ?
      ORDER BY de.position
    `,
    [code, dayIndex],
  );

  return {
    program,
    todayLabel: getTodayLabel(),
    isRestDay: false,
    exercises,
  };
}

export async function getProgramSchedule(code = DEFAULT_PROGRAM_CODE): Promise<{
  program: CurrentProgram;
  schedule: ProgramDaySchedule[];
}> {
  const db = await getDb();
  const program = await getCurrentProgram(code);

  const rows = await db.getAllAsync<{
    dayIndex: number;
    title: string | null;
    position: number;
    movementName: string | null;
    customName: string | null;
    prescription: string | null;
  }>(
    `
      SELECT
        pd.day_index AS dayIndex,
        pd.title AS title,
        de.position AS position,
        m.name AS movementName,
        de.custom_name AS customName,
        de.prescription AS prescription
      FROM program_day pd
      INNER JOIN day_exercise de ON de.program_day_id = pd.id
      LEFT JOIN movement m ON m.id = de.movement_id
      WHERE pd.program_id = (SELECT id FROM program WHERE code = ? LIMIT 1)
      ORDER BY pd.day_index, de.position
    `,
    code,
  );

  const scheduleMap = new Map<number, ProgramDaySchedule>();

  rows.forEach((row) => {
    if (!scheduleMap.has(row.dayIndex)) {
      scheduleMap.set(row.dayIndex, {
        dayIndex: row.dayIndex,
        title: row.title,
        items: [],
      });
    }

    scheduleMap.get(row.dayIndex)?.items.push({
      position: row.position,
      movementName: row.movementName ?? row.customName ?? 'Ejercicio',
      customName: row.customName,
      prescription: row.prescription,
    });
  });

  return {
    program,
    schedule: Array.from(scheduleMap.values()),
  };
}
