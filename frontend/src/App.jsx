import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import UserDashboard from '../pages/UserDashboard';
import ResponderDashboard from '../pages/ResponderDashboard';
import NewsDetailPage from '../pages/NewsDetailPage';
import AllNews from '../pages/AllNews';
import BustNewsDashboard from '../pages/BustNewsDashboard';
import BustResolution from '../pages/BustResolution';

function App() {
  return (
    <Router>  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/citizen/dashboard" element={<UserDashboard />} />
        <Route path="/responder/dashboard" element={<ResponderDashboard />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/all-news" element={<AllNews />} />
        <Route path="/bust-news" element={<BustNewsDashboard />} />
        <Route path="/resolution/:id" element={<BustResolution />} />
      </Routes>
    </Router>
  );
}

export default App;