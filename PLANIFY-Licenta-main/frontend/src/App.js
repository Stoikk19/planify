import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import CategoryPage from './pages/CategoryPage';
import OwnerDashboard from './pages/OwnerDashboard';
import SearchResults from './pages/SearchResults';
import About from './components/About';
import ClientDashboard from './pages/ClientDashboard';
import SalonProfile from './pages/SalonProfile';

const Home = () => (
  <>
    <Hero />
    <Categories />
    <About /> 
  </>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/categorie/:categorie" element={<CategoryPage />} />
          <Route path="/dashboard-owner" element={<OwnerDashboard />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/dashboard-client" element={<ClientDashboard />} />
          <Route path="/salon/:id" element={<SalonProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;