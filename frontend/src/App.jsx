// src/App.jsx
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/home/HomePage';
import ProfilePage from './components/pages/profile/Profilepage';
import ProductPage from './components/pages/Product/Productpage';
import Productlist from './components/pages/Productlist/Productlist';
import Order from './components/pages/Order/Order';
import ChatWidget from './components/ChatWidget';
import ScrollToTop from './components/Srcolltotop';// import kiya
import Cart from './components/pages/cart/Cart';
import SearchPage from './components/pages/Search/SearchPage';
import CategoryPage from './components/pages/Category/CategoryPage';

function App() {
    return (
      <Router>
        <ScrollToTop /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/12345" element={<Productlist />}/>
          <Route path="/123456" element={<Order />}/>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <ChatWidget />
      </Router>
    );
}



export default App;
