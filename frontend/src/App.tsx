import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Join from './pages/join';
import Login from './pages/login';
function App() {
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
