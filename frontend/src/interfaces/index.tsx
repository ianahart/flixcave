export interface ISubNavListItem {
  id: number;
  text: string;
}

export interface IJoinForm {
  first_name: { name: string; value: string; error: string; type: string };
  last_name: { name: string; value: string; error: string; type: string };
  email: { name: string; value: string; error: string; type: string };
  password: { name: string; value: string; error: string; type: string };
  confirm_password: { name: string; value: string; error: string; type: string };
}

export interface ILoginForm {
  email: { name: string; value: string; error: string; type: string };
  password: { name: string; value: string; error: string; type: string };
}

export interface IUser {
  id: number | null;
  first_name: string;
  initials: string;
  last_name: string;
  email: string;
  logged_in: boolean;
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface ILoginResponse {
  message?: string;
  user: IUser;
  tokens: ITokens;
}
