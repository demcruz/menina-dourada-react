import React, { useState  } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importar seus componentes existentes
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
import CheckoutPage from './pages/CheckoutPage'; // <--- Importe a nova página

// Restante do seu código (ALL_PRODUCTS_DATA, PRODUCTS_PER_LOAD)

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (productToAdd, quantity = 1, selectedSize = '', selectedColor = '') => {
    setCart(prevCart => {
      // Lógica para adicionar ao carrinho, talvez considerando tamanho/cor para itens únicos
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
    // Após adicionar ao carrinho, talvez abrir a sidebar:
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => { // Mudança para remover pelo ID do item no carrinho (considerando size/color)
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

  // Função para limpar o carrinho (útil após o checkout)
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
          {/* <--- Adicionando a rota para a página de checkout ---> */}
          <Route path="/checkout" element={
            <CheckoutPage
              cart={cart}
              subtotal={currentCartSubtotal}
              emptyCart={emptyCart} // Passa a função para esvaziar o carrinho
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
          // Passa uma função para fechar o carrinho e navegar para o checkout
          onCheckoutClick={() => { toggleCart(); /* Fechar o carrinho */ }}
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