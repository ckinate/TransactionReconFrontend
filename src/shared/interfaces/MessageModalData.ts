
export interface MessageModalData {
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  buttonText?: string;
  buttonClass?: string;
}