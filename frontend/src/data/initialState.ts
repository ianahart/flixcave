export const joinState = {
  first_name: { name: 'first_name', value: '', error: '', type: 'text' },
  last_name: { name: 'last_name', value: '', error: '', type: 'text' },
  email: { name: 'email', value: '', error: '', type: 'email' },
  password: { name: 'password', value: '', error: '', type: 'password' },
  confirm_password: { name: 'confirm_password', value: '', error: '', type: 'password' },
};

export const loginState = {
  email: { name: 'email', value: '', error: '', type: 'text' },
  password: { name: 'password', value: '', error: '', type: 'password' },
};

export const personDetailsState = {
  birthday: '',
  name: '',
  biography: '',
  place_of_birth: '',
  profile_path: '',
};

export const collectionDetailsState = {
  backdrop_path: '',
  first_air_date: '',
  genres: [],
  last_air_date: '',
  original_name: '',
  overview: '',
  poster_path: '',
  tagline: '',
  vote_average: 0,
  number_of_seasons: 0,
  number_of_episodes: 0,
};

export const movieDetailsState = {
  backdrop_path: '',
  budget: 0,
  genres: [],
  id: 0,
  original_title: '',
  overview: '',
  poster_path: '',
  production_companies: [],
  date: '',
  revenue: 0,
  runtime: 0,
  status: '',
  tagline: '',
  vote_average: 0,
  vote_percent: 0,
};

export const tvDetailsState = {
  backdrop_path: '',
  first_air_date: '',
  genres: [],
  last_air_date: '',
  original_name: '',
  overview: '',
  poster_path: '',
  production_companies: [],
  tagline: '',
  vote_average: 0,
  id: 0,
  vote_percent: 0,
};
