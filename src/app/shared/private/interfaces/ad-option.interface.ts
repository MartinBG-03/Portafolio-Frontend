export type AdOptionValue = string | number;

export interface AdOption {
  readonly value: AdOptionValue;
  readonly label: string;
  readonly disabled?: boolean;
}
