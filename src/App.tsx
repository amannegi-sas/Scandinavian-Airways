import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Results from './pages/Results';
import Checkout from './pages/Checkout';
import FlightStatus from './pages/FlightStatus';
import Destinations from './pages/Destinations';
import MyBookings from './pages/MyBookings';
import EuroBonus from './pages/EuroBonus';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/flight-status" element={<FlightStatus />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/eurobonus" element={<EuroBonus />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
