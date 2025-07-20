import React, { useState  } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import TestimonialsSection from './components/TestimonialsSection';
import FeaturedCollections from './components/FeaturedCollections';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CheckoutPage from './pages/CheckoutPage'; 


function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (productToAdd, quantity = 1, selectedSize = '', selectedColor = '') => {
    setCart(prevCart => {
     
      const existingItem = prevCart.find(item =>
        item.id === productToAdd.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productToAdd.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...productToAdd, quantity: quantity, selectedSize, selectedColor }];
      }
    });
    
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => { 
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCart(prevCart => {
        if (newQuantity <= 0) {
            return prevCart.filter(item => item.id !== itemId);
        }
        return prevCart.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
    });
  };

  
  const emptyCart = () => setCart([]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const currentCartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <Router>
      <div className="bg-sand-50 text-sand-800">
        <Navbar setIsCartOpen={setIsCartOpen} cart={cart} />

        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <FeaturedCollections />
              <ProductGrid addToCart={addToCart} openProductModal={openProductModal} />
              <AboutSection />
              <ContactSection />
              <NewsletterSection />
              <TestimonialsSection />
            </>
          } />
          
          <Route path="/checkout" element={
            <CheckoutPage
              cart={cart}
              subtotal={currentCartSubtotal}
              emptyCart={emptyCart} 
            />
          } />

          <Route path="/shop" element={<ProductGrid addToCart={addToCart} openProductModal={openProductModal} />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="*" element={<div>404: Not Found</div>} />
        </Routes>

        <Footer />

        <CartSidebar
          isOpen={isCartOpen}
          toggleCart={toggleCart}
          cart={cart}
          removeFromCart={removeFromCart}
          updateCartItemQuantity={updateCartItemQuantity}
        
          onCheckoutClick={() => { toggleCart();  }}
        />

        {selectedProduct && (
          <ProductModal
            isOpen={isProductModalOpen}
            onClose={closeProductModal}
            product={selectedProduct}
            addToCart={addToCart}
          />
        )}
      </div>
    </Router>
  );
}

export default App;