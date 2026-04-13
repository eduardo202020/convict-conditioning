export type Program = {
  code: string;
  name: string;
  daysPerWeek: number;
  difficulty: string;
  philosophy: string;
};

export type Movement = {
  slug: string;
  name: string;
  currentStep: number;
  currentStepName: string;
  nextGoal: string;
  focus: string;
};

export type StepDetail = {
  number: number;
  name: string;
  goal: string;
};

export const programs: Program[] = [
  { code: 'new_blood', name: 'New Blood', daysPerWeek: 2, difficulty: 'Base', philosophy: 'Entrada prudente con cuatro movimientos y mucha recuperacion.' },
  { code: 'good_behavior', name: 'Good Behavior', daysPerWeek: 3, difficulty: 'General', philosophy: 'La rutina base mas equilibrada para fuerza, musculo y continuidad.' },
  { code: 'veterano', name: 'Veterano', daysPerWeek: 6, difficulty: 'Alta frecuencia', philosophy: 'Un movimiento por dia, foco total, sesiones cortas y constantes.' },
  { code: 'solitary_confinement', name: 'Solitary Confinement', daysPerWeek: 6, difficulty: 'Avanzado', philosophy: 'Alta densidad, trabajo auxiliar y demanda fuerte de recuperacion.' },
  { code: 'supermax', name: 'Supermax', daysPerWeek: 6, difficulty: 'Extremo', philosophy: 'Volumen salvaje para resistencia, no para fuerza maxima.' },
];

export const movements: Movement[] = [
  { slug: 'pushup', name: 'Push-Ups', currentStep: 4, currentStepName: 'Half Push-Ups', nextGoal: '2 series de 12', focus: 'Empuje horizontal' },
  { slug: 'squat', name: 'Squats', currentStep: 5, currentStepName: 'Full Squats', nextGoal: '2 series de 10', focus: 'Piernas y estructura' },
  { slug: 'pullup', name: 'Pull-Ups', currentStep: 3, currentStepName: 'Jackknife Pulls', nextGoal: '1 serie de 10', focus: 'Tiron vertical' },
  { slug: 'leg_raise', name: 'Leg Raises', currentStep: 2, currentStepName: 'Flat Knee Raises', nextGoal: '2 series de 15', focus: 'Core y cadera' },
  { slug: 'bridge', name: 'Bridges', currentStep: 1, currentStepName: 'Short Bridges', nextGoal: '1 serie de 10', focus: 'Cadena posterior' },
  { slug: 'handstand_pushup', name: 'Handstand Push-Ups', currentStep: 1, currentStepName: 'Wall Headstands', nextGoal: '30 segundos', focus: 'Empuje vertical' },
];

export const todayExercises = [
  { id: 'pullups', sample: 'Muestra 01', movement: 'Pull-Ups', stepName: 'Jackknife Pulls', prescription: '2-3 series efectivas', figure: 'FIG. 17-B' },
  { id: 'bridges', sample: 'Muestra 02', movement: 'Bridges', stepName: 'Short Bridges', prescription: '1-2 series efectivas', figure: 'FIG. 41-A' },
];

export const stepCatalog: Record<string, StepDetail[]> = {
  pushup: [
    { number: 1, name: 'Wall Push-Ups', goal: '1x10' }, { number: 2, name: 'Incline Push-Ups', goal: '1x10' }, { number: 3, name: 'Kneeling Push-Ups', goal: '1x10' }, { number: 4, name: 'Half Push-Ups', goal: '1x8' }, { number: 5, name: 'Full Push-Ups', goal: '1x5' }, { number: 6, name: 'Close Push-Ups', goal: '1x5' }, { number: 7, name: 'Uneven Push-Ups', goal: '1x5' }, { number: 8, name: '1/2 One-Arm Push-Ups', goal: '1x5' }, { number: 9, name: 'Lever Push-Ups', goal: '1x5' }, { number: 10, name: 'One-Arm Push-Up', goal: '1x5' },
  ],
  squat: [
    { number: 1, name: 'Shoulderstand Squats', goal: '1x10' }, { number: 2, name: 'Jackknife Squats', goal: '1x10' }, { number: 3, name: 'Supported Squats', goal: '1x10' }, { number: 4, name: 'Half Squats', goal: '1x8' }, { number: 5, name: 'Full Squats', goal: '1x8' }, { number: 6, name: 'Close Squats', goal: '1x6' }, { number: 7, name: 'Uneven Squats', goal: '1x5' }, { number: 8, name: '1/2 One-Leg Squats', goal: '1x5' }, { number: 9, name: 'Assisted One-Leg Squats', goal: '1x5' }, { number: 10, name: 'One-Leg Squat', goal: '1x5' },
  ],
  pullup: [
    { number: 1, name: 'Vertical Pulls', goal: '1x10' }, { number: 2, name: 'Horizontal Pulls', goal: '1x10' }, { number: 3, name: 'Jackknife Pulls', goal: '1x10' }, { number: 4, name: 'Half Pull-Ups', goal: '1x7' }, { number: 5, name: 'Full Pull-Ups', goal: '1x5' }, { number: 6, name: 'Close Pull-Ups', goal: '1x5' }, { number: 7, name: 'Uneven Pull-Ups', goal: '1x5' }, { number: 8, name: '1/2 One-Arm Pull-Ups', goal: '1x4' }, { number: 9, name: 'Assisted Pull-Ups', goal: '1x3' }, { number: 10, name: 'One-Arm Pull-Up', goal: '1x1' },
  ],
  leg_raise: [
    { number: 1, name: 'Knee Tucks', goal: '1x10' }, { number: 2, name: 'Flat Knee Raises', goal: '1x10' }, { number: 3, name: 'Flat Bent Leg Raises', goal: '1x10' }, { number: 4, name: 'Flat Frog Raises', goal: '1x8' }, { number: 5, name: 'Flat Straight Leg Raises', goal: '1x8' }, { number: 6, name: 'Hanging Knee Raises', goal: '1x6' }, { number: 7, name: 'Hanging Bent Leg Raises', goal: '1x6' }, { number: 8, name: 'Hanging Frog Raises', goal: '1x5' }, { number: 9, name: 'Partial Straight Leg Raises', goal: '1x5' }, { number: 10, name: 'Hanging Straight Leg Raises', goal: '1x5' },
  ],
  bridge: [
    { number: 1, name: 'Short Bridges', goal: '1x10' }, { number: 2, name: 'Straight Bridges', goal: '1x10' }, { number: 3, name: 'Angled Bridges', goal: '1x8' }, { number: 4, name: 'Head Bridges', goal: '1x8' }, { number: 5, name: 'Half Bridges', goal: '1x8' }, { number: 6, name: 'Full Bridges', goal: '1x6' }, { number: 7, name: 'Wall Walking (Down)', goal: '1x3' }, { number: 8, name: 'Wall Walking (Up)', goal: '1x2' }, { number: 9, name: 'Closing Bridges', goal: '1x1' }, { number: 10, name: 'Stand-To-Stand Bridge', goal: '1x1' },
  ],
  handstand_pushup: [
    { number: 1, name: 'Wall Headstands', goal: '30 sec' }, { number: 2, name: 'Crow Stands', goal: '10 sec' }, { number: 3, name: 'Wall Handstands', goal: '30 sec' }, { number: 4, name: 'Half Handstand Push-Ups', goal: '1x5' }, { number: 5, name: 'Handstand Push-Ups', goal: '1x5' }, { number: 6, name: 'Close Handstand Push-Ups', goal: '1x5' }, { number: 7, name: 'Uneven Handstand Push-Ups', goal: '1x5' }, { number: 8, name: '1/2 One-Arm Handstand Push-Ups', goal: '1x4' }, { number: 9, name: 'Lever Handstand Push-Ups', goal: '1x3' }, { number: 10, name: 'One-Arm Handstand Push-Up', goal: '1x1' },
  ],
};

export const athleteProfile = { alias: 'Atleta de Hierro', activeProgram: 'Veterano', streak: 12, sessions: 48 };
