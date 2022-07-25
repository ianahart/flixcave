import React from 'react';
import { useCallback } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Join from './pages/join';
import Login from './pages/login';
import { AxiosError } from 'axios';
import { http, retreiveTokens } from './helpers/utils';
import { saveUser } from './features/userSlice';
import { useEffectOnce } from './hooks/UseEffectOnce';
import { useAppDispatch } from './app/hooks';
function App() {
  const dispatch = useAppDispatch();
  const refreshUser = useCallback(async () => {
    try {
      const tokens = retreiveTokens();
      console.log(tokens);
      const headers = { headers: { Authorization: `Bearer ${tokens.access_token}` } };
      const response = await http.get('/account/refresh/', headers);
      dispatch(saveUser(response.data.user));
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  }, []);

  useEffectOnce(() => {
    refreshUser();
  });

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="site">
          <div className="site-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/join" element={<Join />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
