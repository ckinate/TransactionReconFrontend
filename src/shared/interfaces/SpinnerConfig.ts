export interface SpinnerConfig {
  message?: string;
  type?: 'border' | 'grow';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  backdrop?: boolean;
}

export interface SimpleSpinnerConfig {
  message?: string;
  show: boolean;
}