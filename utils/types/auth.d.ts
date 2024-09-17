export type TUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  email_verified: number;
  created_at: string;
  updated_at: string;
  refresh_token: string;
};

export type AuthUser = {
  accesToken: string;
  refreshToken: string;
  user: TUser;
};

export type TLogin = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  data?: AuthUser;
  success?: boolean;
};
