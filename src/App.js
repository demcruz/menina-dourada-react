import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import AboutSection from './components/AboutSection';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';
import CheckoutPage from './pages/CheckoutPage';
import LGPDModal from './components/LGPDModal';
import ContactWidget from './components/ContactWidget';
import SEO from './components/SEO';
import AdvancedSEO from './seo/AdvancedSEO';
import { websiteSchema, organizationSchema, clothingStoreSchema } from './seo/schema';



// <<<< IMPORTAR AS NOVAS PÁGINAS DE STATUS DO PEDIDO >>>>
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderPendingPage from './pages/OrderPendingPage';
import OrderFailurePage from './pages/OrderFailurePage';
import ProductSeoPage from './pages/ProductSeoPage';
import PoliticaFretePage from './pages/PoliticaFretePage';
import TrocasDevolucoesPage from './pages/TrocasDevolucoesPage';
import ContatoPage from './pages/ContatoPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

const PageTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  return null;
};

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
        // Garante que tamanho, cor e ufCadastro estejam disponíveis
        return [...prevCart, { 
          ...productToAdd, 
          quantity: quantity, 
          selectedSize, 
          selectedColor,
          tamanho: selectedSize || productToAdd.tamanho,
          cor: selectedColor || productToAdd.cor,
          ufCadastro: productToAdd.ufCadastro, // Origem do frete
        }];
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

  const currentCartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <Router>
      <div className="bg-sand-50 text-sand-800">
        <ScrollToTop />
        <PageTracker />
        <SEO />
        <Navbar setIsCartOpen={setIsCartOpen} cart={cart} />

        <Routes>
          <Route path="/" element={
            <>
              <AdvancedSEO
                title="Menina Dourada | Moda Praia Feminina e Cangas"
                description="Encontre cangas, moda praia feminina e peças com estilo tropical na Menina Dourada."
                url="https://meninadourada.shop/"
                canonical="https://meninadourada.shop/"
                jsonLd={[websiteSchema(), organizationSchema(), clothingStoreSchema()]}
              />
              <HeroSection />
              
              <ProductGrid addToCart={addToCart} />
              <AboutSection />
              <NewsletterSection />
            </>
          } />

          <Route path="/checkout" element={
            <CheckoutPage
              cart={cart}
              subtotal={currentCartSubtotal}
              emptyCart={emptyCart}
            />
          } />

          <Route path="/shop" element={<Navigate to="/produtos" replace />} />
          <Route path="/loja" element={<Navigate to="/produtos" replace />} />
          <Route path="/produtos" element={<><AdvancedSEO title="Produtos | Menina Dourada" description="Compre biquínis, maiôs, cangas e acessórios na Menina Dourada. Entrega para todo o Brasil." url="https://meninadourada.shop/produtos" canonical="https://meninadourada.shop/produtos" /><ProductGrid addToCart={addToCart} /></>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/politica-de-frete" element={<PoliticaFretePage />} />
          <Route path="/trocas-e-devolucoes" element={<TrocasDevolucoesPage />} />
          <Route path="/produto/:slug" element={<ProductSeoPage addToCart={addToCart} />} />
          <Route path="*" element={<div>404: Not Found</div>} />
          <Route path="/checkout/success" element={<OrderSuccessPage />} />
          <Route path="/checkout/failure" element={<OrderPendingPage />} />
          <Route path="/checkout/rejected" element={<OrderFailurePage />} />

        </Routes>
        <Footer />



        <CartSidebar
          isOpen={isCartOpen}
          toggleCart={toggleCart}
          cart={cart}
          removeFromCart={removeFromCart}
          updateCartItemQuantity={updateCartItemQuantity}

          onCheckoutClick={() => { toggleCart(); }}
        />

        <LGPDModal />
        <ContactWidget />
      </div>
    </Router>
  );
}

export default App;
