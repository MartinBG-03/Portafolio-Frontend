export type AppEnvironmentName = 'dev' | 'qa' | 'prod';

export interface AppEnvironment {
  readonly name: AppEnvironmentName;
  readonly production: boolean;
  readonly apiBaseUrl: string;
}
