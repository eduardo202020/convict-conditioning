PRAGMA foreign_keys = ON;

-- =========================
-- A) Catálogo (Big Six + Steps)
-- =========================
CREATE TABLE IF NOT EXISTS movement (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS step (
  id INTEGER PRIMARY KEY,
  movement_id INTEGER NOT NULL,
  step_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  goal TEXT,
  technique_notes TEXT,
  is_master_step INTEGER DEFAULT 0,
  UNIQUE(movement_id, step_number),
  FOREIGN KEY (movement_id) REFERENCES movement(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS step_media (
  id INTEGER PRIMARY KEY,
  step_id INTEGER NOT NULL,
  kind TEXT NOT NULL,
  uri TEXT NOT NULL,
  credit TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (step_id) REFERENCES step(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cue (
  id INTEGER PRIMARY KEY,
  step_id INTEGER NOT NULL,
  type TEXT NOT NULL,       -- checklist|common_mistake|tip
  text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (step_id) REFERENCES step(id) ON DELETE CASCADE
);

-- =========================
-- B) Modos + Targets
-- =========================
CREATE TABLE IF NOT EXISTS scheme (
  id INTEGER PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,     -- initial|intermediate|advanced
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS step_target (
  id INTEGER PRIMARY KEY,
  step_id INTEGER NOT NULL,
  scheme_id INTEGER NOT NULL,

  -- Objetivo por reps:
  target_sets INTEGER,
  target_reps INTEGER,

  -- Objetivo por rango de reps (si aplica):
  target_reps_min INTEGER,
  target_reps_max INTEGER,

  -- Objetivo por tiempo (si aplica):
  target_hold_sec INTEGER,

  -- Copia humana del objetivo (ej: "2x10-30" o "30 sec")
  raw_target TEXT,

  rest_sec INTEGER DEFAULT 90,
  tempo_down_sec INTEGER DEFAULT 0,
  tempo_pause_sec INTEGER DEFAULT 0,
  tempo_up_sec INTEGER DEFAULT 0,
  pass_rule TEXT DEFAULT 'meet_target',

  FOREIGN KEY (step_id) REFERENCES step(id) ON DELETE CASCADE,
  FOREIGN KEY (scheme_id) REFERENCES scheme(id) ON DELETE CASCADE,
  UNIQUE(step_id, scheme_id)
);

CREATE TABLE IF NOT EXISTS user_movement_level (
  id INTEGER PRIMARY KEY,
  movement_id INTEGER NOT NULL,
  current_step_id INTEGER NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (movement_id) REFERENCES movement(id) ON DELETE CASCADE,
  FOREIGN KEY (current_step_id) REFERENCES step(id),
  UNIQUE(movement_id)
);

-- =========================
-- C) Rutinas
-- =========================
CREATE TABLE IF NOT EXISTS program (
  id INTEGER PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  scheme_id INTEGER NOT NULL,
  days_per_week INTEGER NOT NULL,
  program_kind TEXT NOT NULL DEFAULT 'base', -- base|hybrid
  created_at TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (scheme_id) REFERENCES scheme(id)
);

CREATE TABLE IF NOT EXISTS program_day (
  id INTEGER PRIMARY KEY,
  program_id INTEGER NOT NULL,
  day_index INTEGER NOT NULL,
  title TEXT,
  FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE,
  UNIQUE(program_id, day_index)
);

CREATE TABLE IF NOT EXISTS day_exercise (
  id INTEGER PRIMARY KEY,
  program_day_id INTEGER NOT NULL,
  movement_id INTEGER,
  step_id INTEGER,
  custom_name TEXT,
  prescription TEXT,
  position INTEGER NOT NULL,
  is_warmup INTEGER DEFAULT 0,
  custom_rest_sec INTEGER,
  FOREIGN KEY (program_day_id) REFERENCES program_day(id) ON DELETE CASCADE,
  FOREIGN KEY (movement_id) REFERENCES movement(id),
  FOREIGN KEY (step_id) REFERENCES step(id),
  CHECK (
    movement_id IS NOT NULL
    OR step_id IS NOT NULL
    OR custom_name IS NOT NULL
  ),
  UNIQUE(program_day_id, position)
);

-- =========================
-- D) Sesiones reales (tracking)
-- =========================
CREATE TABLE IF NOT EXISTS session (
  id INTEGER PRIMARY KEY,
  program_id INTEGER,
  program_day_id INTEGER,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  note TEXT,
  rpe INTEGER,
  FOREIGN KEY (program_id) REFERENCES program(id),
  FOREIGN KEY (program_day_id) REFERENCES program_day(id)
);

CREATE TABLE IF NOT EXISTS session_exercise (
  id INTEGER PRIMARY KEY,
  session_id INTEGER NOT NULL,
  step_id INTEGER NOT NULL,
  step_target_id INTEGER,
  position INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE,
  FOREIGN KEY (step_id) REFERENCES step(id),
  FOREIGN KEY (step_target_id) REFERENCES step_target(id),
  UNIQUE(session_id, position)
);

CREATE TABLE IF NOT EXISTS set_log (
  id INTEGER PRIMARY KEY,
  session_exercise_id INTEGER NOT NULL,
  set_index INTEGER NOT NULL,
  reps INTEGER,
  hold_sec INTEGER,
  rest_sec INTEGER,
  completed INTEGER DEFAULT 1,
  set_rpe INTEGER,
  FOREIGN KEY (session_exercise_id) REFERENCES session_exercise(id) ON DELETE CASCADE,
  UNIQUE(session_exercise_id, set_index)
);

-- =========================
-- E) Progresión
-- =========================
CREATE TABLE IF NOT EXISTS progression_event (
  id INTEGER PRIMARY KEY,
  movement_id INTEGER NOT NULL,
  from_step_id INTEGER NOT NULL,
  to_step_id INTEGER NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (movement_id) REFERENCES movement(id),
  FOREIGN KEY (from_step_id) REFERENCES step(id),
  FOREIGN KEY (to_step_id) REFERENCES step(id)
);

-- =========================
-- F) Indexes
-- =========================
CREATE INDEX IF NOT EXISTS idx_step_movement ON step(movement_id, step_number);
CREATE INDEX IF NOT EXISTS idx_target_step_scheme ON step_target(step_id, scheme_id);
CREATE INDEX IF NOT EXISTS idx_dayexercise_day ON day_exercise(program_day_id, position);
CREATE INDEX IF NOT EXISTS idx_session_dates ON session(started_at);
CREATE INDEX IF NOT EXISTS idx_setlog_session_ex ON set_log(session_exercise_id);
