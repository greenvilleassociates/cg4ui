import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './organisms/Home/home';
import Home2 from './pages/home2';
import ParkDetails from './organisms/ParkDetails/parkDetails';
import Cart from './organisms/Cart/cart'
import ParkService from './services/parkService';
import CartService from './services/cartService';
import { useState } from 'react';
import Homebar from './components/Homebar/homebar';
import Footer from './components/Footer/footer';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Details2 from './pages/Details2';
import AllReviews from './pages/AllReviews';
import Logout from './pages/Logout';

function App() {

  const parkService = new ParkService();
  const cartService = new CartService();
  const [cart, setCart ] = useState(cartService.loadCart());

  const handleChange = () => {
    setCart(cartService.loadCart());
  }

  return (
      <div className="App">
        <div className="header content">
          <Homebar numItems={cart ? cart.length : 0} />
        </div>
        <Routes>
          <Route path="/" caseSensitive={false} element={<Login />} />
          <Route path="/welcome" caseSensitive={false} element={<Welcome/>} />  
          <Route path="/login" caseSensitive={false} element={<Login/>} />
          <Route path="/logout" caseSensitive={false} element={<Logout/>} />
          <Route path="/register" caseSensitive={false} element={<Register/>} />  
	      <Route path="/home" caseSensitive={false} element={<Home parkService={parkService} cartService={cartService} />} />
          <Route path="/home2" caseSensitive={false} element={<Home2 />} />
          <Route path="/details2" caseSensitive={false} element={<Details2 />} />
          <Route path="/allreviews" caseSensitive={false} element={<AllReviews />} />
          <Route path="/details/:parkId" caseSensitive={false} element={<ParkDetails parkService={parkService} cartService={cartService} onBook={handleChange} />} />
          <Route path="/details" caseSensitive={false} element={<ParkDetails />} />
		  <Route path="/cart" caseSensitive={false} element={<Cart cartService={cartService} handleChange={handleChange} /> } />
        </Routes>
        <div className="footer content">
          <Footer />
        </div>
      </div>
  );
}

export default App;
