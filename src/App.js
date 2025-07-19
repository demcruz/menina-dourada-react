import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import TestimonialsSection from './components/TestimonialsSection';




function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);


  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <div>
<Navbar setIsCartOpen={setIsCartOpen} cart={cart} />
      <HeroSection />
      <ProductGrid addToCart={addToCart} />
      <AboutSection />
      <TestimonialsSection />

      <ContactSection />
      <CartSidebar
        isOpen={isCartOpen}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        cart={cart}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}

export default App;
