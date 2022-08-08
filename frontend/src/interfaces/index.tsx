export interface ISubNavListItem {
  id: number;
  text: string;
}

export interface ISearchTotal {
  person: number;
  collection: number;
  movie: number;
  tv: number;
}

export interface ICollection {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
}

export interface IMovie {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IPerson {
  adult: boolean;
  gender: number;
  id: number;
  known_for: IMovie[];
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path?: string;
}

export interface ITv {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
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
