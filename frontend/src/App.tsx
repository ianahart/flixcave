import React from 'react';
import { useCallback } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Join from './pages/join';
import Login from './pages/login';
import Search from './pages/search';
import { AxiosError } from 'axios';
import { http, retreiveTokens } from './helpers/utils';
import { saveUser } from './features/userSlice';
import { useEffectOnce } from './hooks/UseEffectOnce';
import { useAppDispatch } from './app/hooks';
import RequireGuest from './components/Mixed/RequireGuest';
import RequireAuth from './components/Mixed/RequireAuth';
import WithAxios from './helpers/WithAxios';
import MovieDetails from './pages/Details/MovieDetails';
import CollectionDetails from './pages/Details/CollectionDetails';
import TvDetails from './pages/Details/TvDetails';
import PersonDetails from './pages/Details/PersonDetails';
import Lists from './pages/Auth/Lists';
import List from './pages/Auth/List';
import Favorites from './pages/Auth/Favorites';
import WatchList from './pages/Auth/WatchList';
import MoviePopular from './pages/Links/Movies/Popular';
import TvPopular from './pages/Links/Tv/Popular';
import TvTopRated from './pages/Links/Tv/TopRated';
import MovieTopRated from './pages/Links/Movies/TopRated';
import MovieNowPlaying from './pages/Links/Movies/NowPlaying';
import PopularPeoples from './pages/Links/Person/Persons';
import WriteReview from './pages/Auth/WriteReview';
import Reviews from './pages/Reviews';

function App() {
  const dispatch = useAppDispatch();
  const refreshUser = useCallback(async () => {
    try {
      const tokens = retreiveTokens();
      const headers = { headers: { Authorization: `Bearer ${tokens.access_token}` } };
      const response = await http.get('/account/refresh/', headers);
      dispatch(saveUser(response.data.user));
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  }, [dispatch]);

  useEffectOnce(() => {
    refreshUser();
  });

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="site">
          <div className="site-content">
            <WithAxios>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies/popular" element={<MoviePopular />} />
                <Route path="/movies/top-rated" element={<MovieTopRated />} />
                <Route path="/movies/now-playing" element={<MovieNowPlaying />} />
                <Route path="/tv/popular" element={<TvPopular />} />
                <Route path="/tv/top-rated" element={<TvTopRated />} />
                <Route path="/people/popular" element={<PopularPeoples />} />
                <Route path="/discussions/reviews" element={<Reviews />} />
                <Route
                  path="/join"
                  element={
                    <RequireGuest>
                      <Join />
                    </RequireGuest>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <RequireGuest>
                      <Login />
                    </RequireGuest>
                  }
                />

                <Route
                  path="/lists"
                  element={
                    <RequireAuth>
                      <Lists />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/write-review"
                  element={
                    <RequireAuth>
                      <WriteReview />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/lists/:id"
                  element={
                    <RequireAuth>
                      <List />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/watchlist/"
                  element={
                    <RequireAuth>
                      <WatchList />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/favorites/"
                  element={
                    <RequireAuth>
                      <Favorites />
                    </RequireAuth>
                  }
                />

                <Route path="/search" element={<Search />}></Route>
                <Route path="/movies/:id" element={<MovieDetails />}></Route>
                <Route path="/collections/:id" element={<CollectionDetails />}></Route>
                <Route path="/tv/:id" element={<TvDetails />}></Route>
                <Route path="/people/:id" element={<PersonDetails />}></Route>
              </Routes>
            </WithAxios>
          </div>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
