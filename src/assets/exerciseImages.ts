import type { ImageSourcePropType } from 'react-native';

type ExerciseImageMap = Record<string, Record<number, ImageSourcePropType[]>>;

const exerciseImages: ExerciseImageMap = {
  pushup: {
    1: [require('../../assets/images/pushup/step-01-1.png'), require('../../assets/images/pushup/step-01-2.png')],
    2: [require('../../assets/images/pushup/step-02-1.png'), require('../../assets/images/pushup/step-02-2.png')],
    3: [require('../../assets/images/pushup/step-03-1.png'), require('../../assets/images/pushup/step-03-2.png')],
    4: [require('../../assets/images/pushup/step-04-1.png'), require('../../assets/images/pushup/step-04-2.png')],
    5: [require('../../assets/images/pushup/step-05-1.png'), require('../../assets/images/pushup/step-05-2.png')],
    6: [require('../../assets/images/pushup/step-06-1.png'), require('../../assets/images/pushup/step-06-2.png')],
    7: [require('../../assets/images/pushup/step-07-1.png'), require('../../assets/images/pushup/step-07-2.png')],
    8: [require('../../assets/images/pushup/step-08-1.png'), require('../../assets/images/pushup/step-08-2.png')],
    9: [require('../../assets/images/pushup/step-09-1.png'), require('../../assets/images/pushup/step-09-2.png')],
    10: [require('../../assets/images/pushup/step-10-1.png'), require('../../assets/images/pushup/step-10-2.png')],
  },
  squat: {
    1: [require('../../assets/images/squat/step-01-1.png'), require('../../assets/images/squat/step-01-2.png')],
    2: [require('../../assets/images/squat/step-02-1.png'), require('../../assets/images/squat/step-02-2.png')],
    3: [require('../../assets/images/squat/step-03-1.png'), require('../../assets/images/squat/step-03-2.png')],
    4: [require('../../assets/images/squat/step-04-1.png'), require('../../assets/images/squat/step-04-2.png')],
    5: [require('../../assets/images/squat/step-05-1.png'), require('../../assets/images/squat/step-05-2.png')],
    6: [require('../../assets/images/squat/step-06-1.png'), require('../../assets/images/squat/step-06-2.png')],
    7: [require('../../assets/images/squat/step-07-1.png'), require('../../assets/images/squat/step-07-2.png')],
    8: [require('../../assets/images/squat/step-08-1.png'), require('../../assets/images/squat/step-08-2.png')],
    9: [require('../../assets/images/squat/step-09-1.png'), require('../../assets/images/squat/step-09-2.png')],
  },
  pullup: {
    1: [require('../../assets/images/pullup/step-01-1.png'), require('../../assets/images/pullup/step-01-2.png')],
    2: [require('../../assets/images/pullup/step-02-1.png'), require('../../assets/images/pullup/step-02-2.png')],
    3: [require('../../assets/images/pullup/step-03-1.png'), require('../../assets/images/pullup/step-03-2.png')],
    4: [require('../../assets/images/pullup/step-04-1.png'), require('../../assets/images/pullup/step-04-2.png')],
    5: [require('../../assets/images/pullup/step-05-1.png'), require('../../assets/images/pullup/step-05-2.png')],
    6: [require('../../assets/images/pullup/step-06-1.png'), require('../../assets/images/pullup/step-06-2.png')],
    7: [require('../../assets/images/pullup/step-07-1.png'), require('../../assets/images/pullup/step-07-2.png')],
    8: [require('../../assets/images/pullup/step-08-1.png'), require('../../assets/images/pullup/step-08-2.png')],
    9: [require('../../assets/images/pullup/step-09-1.png'), require('../../assets/images/pullup/step-09-2.png')],
    10: [require('../../assets/images/pullup/step-10-1.png'), require('../../assets/images/pullup/step-10-2.png')],
  },
  'leg-raise': {
    1: [require('../../assets/images/leg-raise/step-01-1.png'), require('../../assets/images/leg-raise/step-01-2.png')],
    2: [require('../../assets/images/leg-raise/step-02-1.png'), require('../../assets/images/leg-raise/step-02-2.png')],
    3: [require('../../assets/images/leg-raise/step-03-1.png'), require('../../assets/images/leg-raise/step-03-2.png')],
    4: [
      require('../../assets/images/leg-raise/step-04-1.png'),
      require('../../assets/images/leg-raise/step-04-2.png'),
      require('../../assets/images/leg-raise/step-04-3.png'),
    ],
    5: [require('../../assets/images/leg-raise/step-05-1.png'), require('../../assets/images/leg-raise/step-05-2.png')],
    6: [require('../../assets/images/leg-raise/step-06-1.png'), require('../../assets/images/leg-raise/step-06-2.png')],
    7: [require('../../assets/images/leg-raise/step-07-1.png'), require('../../assets/images/leg-raise/step-07-2.png')],
    8: [
      require('../../assets/images/leg-raise/step-08-1.png'),
      require('../../assets/images/leg-raise/step-08-2.png'),
      require('../../assets/images/leg-raise/step-08-3.png'),
    ],
    9: [require('../../assets/images/leg-raise/step-09-1.png'), require('../../assets/images/leg-raise/step-09-2.png')],
    10: [require('../../assets/images/leg-raise/step-10-1.png'), require('../../assets/images/leg-raise/step-10-2.png')],
  },
  bridge: {
    1: [require('../../assets/images/bridge/step-01-1.png'), require('../../assets/images/bridge/step-01-2.png')],
    2: [require('../../assets/images/bridge/step-02-1.png'), require('../../assets/images/bridge/step-02-2.png')],
    3: [require('../../assets/images/bridge/step-03-1.png'), require('../../assets/images/bridge/step-03-2.png')],
    4: [require('../../assets/images/bridge/step-04-1.png'), require('../../assets/images/bridge/step-04-2.png')],
    5: [require('../../assets/images/bridge/step-05-1.png'), require('../../assets/images/bridge/step-05-2.png')],
    6: [require('../../assets/images/bridge/step-06-1.png'), require('../../assets/images/bridge/step-06-2.png')],
    7: [
      require('../../assets/images/bridge/step-07-1.png'),
      require('../../assets/images/bridge/step-07-2.png'),
      require('../../assets/images/bridge/step-07-3.png'),
    ],
    8: [
      require('../../assets/images/bridge/step-08-1.png'),
      require('../../assets/images/bridge/step-08-2.png'),
      require('../../assets/images/bridge/step-08-3.png'),
    ],
    9: [
      require('../../assets/images/bridge/step-09-1.png'),
      require('../../assets/images/bridge/step-09-2.png'),
      require('../../assets/images/bridge/step-09-3.png'),
    ],
    10: [
      require('../../assets/images/bridge/step-10-1.png'),
      require('../../assets/images/bridge/step-10-2.png'),
      require('../../assets/images/bridge/step-10-3.png'),
    ],
  },
  'handstand-pushup': {
    1: [require('../../assets/images/handstand-pushup/step-01-1.png'), require('../../assets/images/handstand-pushup/step-01-2.png')],
    2: [require('../../assets/images/handstand-pushup/step-02-1.png'), require('../../assets/images/handstand-pushup/step-02-2.png')],
    3: [require('../../assets/images/handstand-pushup/step-03-1.png'), require('../../assets/images/handstand-pushup/step-03-2.png')],
    4: [require('../../assets/images/handstand-pushup/step-04-1.png'), require('../../assets/images/handstand-pushup/step-04-2.png')],
    5: [require('../../assets/images/handstand-pushup/step-05-1.png'), require('../../assets/images/handstand-pushup/step-05-2.png')],
    6: [require('../../assets/images/handstand-pushup/step-06-1.png'), require('../../assets/images/handstand-pushup/step-06-2.png')],
    7: [require('../../assets/images/handstand-pushup/step-07-1.png'), require('../../assets/images/handstand-pushup/step-07-2.png')],
    8: [require('../../assets/images/handstand-pushup/step-08-1.png'), require('../../assets/images/handstand-pushup/step-08-2.png')],
    9: [require('../../assets/images/handstand-pushup/step-09-1.png'), require('../../assets/images/handstand-pushup/step-09-2.png')],
    10: [require('../../assets/images/handstand-pushup/step-10-1.png'), require('../../assets/images/handstand-pushup/step-10-2.png')],
  },
};

exerciseImages['leg_raise'] = exerciseImages['leg-raise'];
exerciseImages['handstand_pushup'] = exerciseImages['handstand-pushup'];

const exerciseImageUriMap = Object.entries(exerciseImages).reduce<Record<string, ImageSourcePropType>>(
  (accumulator, [movementSlug, steps]) => {
    for (const [stepNumber, images] of Object.entries(steps)) {
      images.forEach((imageSource, index) => {
        const uri = `asset://images/${movementSlug}/step-${String(stepNumber).padStart(2, '0')}-${index + 1}.png`;
        accumulator[uri] = imageSource;
      });
    }

    return accumulator;
  },
  {},
);

export function getLocalExerciseImages(movementSlug: string, stepNumber: number) {
  return exerciseImages[movementSlug]?.[stepNumber] ?? [];
}

export function getLocalImageSource(uri: string) {
  return exerciseImageUriMap[uri] ?? null;
}
