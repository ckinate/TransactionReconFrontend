export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  expireAt: Date;
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
}