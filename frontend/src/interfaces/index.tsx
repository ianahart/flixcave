export interface ISubNavListItem {
  id: number;
  text: string;
  link: string;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IGenresResponse {
  message?: string;
  genres: IGenre[];
}

export interface IFavorite {
  backdrop_path: string;
  id: number;
  resource_id: number;
  title: string;
  type: string;
  user_id: number;
}

export interface IResource {
  backdrop_path: string;
  id: number;
  original_title?: string;
  original_name?: string;
  vote_average: number;
  vote_percent: number;
  release_date: string;
}

export interface IResourcesResponse {
  message?: string;
  page: number;
  resources: IResource[];
}

export interface IGetFavoritesResponse {
  message?: string;
  has_next: boolean;
  page: number;
  favorites: IFavorite[];
}

export interface IWatchListItem {
  backdrop_path: string;
  id: number;
  resource_id: number;
  title: string;
  type: string;
  user_id: number;
  note: string;
}

export interface IGetWatchlistResponse {
  message?: string;
  has_next: boolean;
  page: number;
  watchlist_items: IWatchListItem[];
}

export interface IProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface IPersonDetails {
  birthday: string;
  name: string;
  biography: string;
  place_of_birth: string;
  profile_path: string;
}

export interface IList {
  user_id: number;
  id: number;
  name: string;
}

export interface IListsResponse {
  message?: string;
  lists: IList[];
}

export interface IPersonDetailsResponse {
  message?: string;
  person_details: IPersonDetails;
}

export interface IPopulateList {
  id: number;
  name: string;
}

export interface IPopulateListResponse {
  message?: string;
  results: IPopulateList[];
}

export interface IListItem {
  id: number;
  backdrop_path: string;
  title: string;
  type: string;
  resource_id: number;
}

export interface IListResponse {
  message?: string;
  has_next: boolean;
  page: number;
  list_items: IListItem[];
}

export interface ITvDetails {
  backdrop_path: string;
  first_air_date: string;
  last_air_date: string;
  original_name: string;
  genres: IGenre[];
  id: number;
  overview: string;
  poster_path: string;
  production_companies: IProductionCompany[];
  tagline: string;
  vote_average: number;
  vote_percent: number;
  favorited: boolean;
  watchlist: boolean;
}

export interface IMovieDetails {
  backdrop_path: string;
  budget: number;
  genres: IGenre[] | [];
  id: number;
  original_title: string;
  overview: string;
  poster_path: string;
  production_companies: IProductionCompany[];
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  vote_average: number;
  vote_percent: number;
  date: string;
  favorited: boolean;
  watchlist: boolean;
}

export interface ITvDetailsResponse {
  message?: string;
  tv_details: ITvDetails;
}

export interface IMovieDetailsResponse {
  message?: string;
  movie_details: IMovieDetails;
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
  member_since: string;
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
