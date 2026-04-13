export type RootStackParamList = {
  Onboarding: undefined;
  ChooseProgram: undefined;
  SetInitialLevels: undefined;
  MainTabs: undefined;
  Profile: undefined;
  CurrentProgram: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  HoyStack: undefined;
  ProgresoStack: undefined;
  BibliotecaStack: undefined;
};

export type HoyStackParamList = {
  Today: undefined;
  ActiveSession: undefined;
  SessionSummary: undefined;
};

export type ProgresoStackParamList = {
  ProgressOverview: undefined;
  MovementProgress: { slug?: string } | undefined;
};

export type BibliotecaStackParamList = {
  BigSix: undefined;
  Movement: { slug: string; name: string };
  StepDetail: { slug: string; stepNumber?: number; name?: string };
  MediaViewer: { title: string };
};
