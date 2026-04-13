import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';
import { websiteSchema, organizationSchema, clothingStoreSchema } from './seo/schema';

// Componentes globais — carregados imediatamente (presentes em todas as páginas)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import LGPDModal from './components/LGPDModal';
import ContactWidget from './components/ContactWidget';
import SEO from './components/SEO';
import LoadingSpinner from './components/LoadingSpinner';
// AdvancedSEO usa react-helmet e precisa ser síncrono para não causar flash de meta tags
import AdvancedSEO from './seo/AdvancedSEO';

// Lazy-loaded — cada rota vira um chunk separado no bundle
const HeroSection          = lazy(() => import('./components/HeroSection'));
const ProductGrid          = lazy(() => import('./components/ProductGrid'));
const AboutSection         = lazy(() => import('./components/AboutSection'));
const NewsletterSection    = lazy(() => import('./components/NewsletterSection'));
const AboutPage            = lazy(() => import('./pages/AboutPage'));
const ContatoPage          = lazy(() => import('./pages/ContatoPage'));
const CheckoutPage         = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage     = lazy(() => import('./pages/OrderSuccessPage'));
const OrderPendingPage     = lazy(() => import('./pages/OrderPendingPage'));
const OrderFailurePage     = lazy(() => import('./pages/OrderFailurePage'));
const ProductSeoPage       = lazy(() => import('./pages/ProductSeoPage'));
const PoliticaFretePage    = lazy(() => import('./pages/PoliticaFretePage'));
const TrocasDevolucoesPage = lazy(() => import('./pages/TrocasDevolucoesPage'));
const PrivacidadePage      = lazy(() => import('./pages/PrivacidadePage'));
const TermosPage           = lazy(() => import('./pages/TermosPage'));

const PageFallback = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <LoadingSpinner />
  </div>
);

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
        item.id === productToAdd.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      );
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productToAdd.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, {
        ...productToAdd,
        quantity,
        selectedSize,
        selectedColor,
        tamanho: selectedSize || productToAdd.tamanho,
        cor: selectedColor || productToAdd.cor,
        ufCadastro: productToAdd.ufCadastro,
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity <= 0) return prevCart.filter(item => item.id !== itemId);
      return prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const emptyCart = () => setCart([]);

  const currentCartSubtotal = cart.reduce(
    (total, item) => total + (item.price * item.quantity), 0
  );

  return (
    <Router>
      <div className="bg-sand-50 text-sand-800">
        <ScrollToTop />
        <PageTracker />
        <SEO />
        <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
        <Navbar setIsCartOpen={setIsCartOpen} cart={cart} />

        <main id="main-content">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Home */}
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

            {/* Produtos */}
            <Route path="/produtos" element={
              <>
                <AdvancedSEO
                  title="Produtos | Menina Dourada"
                  description="Compre biquínis, maiôs, cangas e acessórios na Menina Dourada. Entrega para todo o Brasil."
                  url="https://meninadourada.shop/produtos"
                  canonical="https://meninadourada.shop/produtos"
                />
                <ProductGrid addToCart={addToCart} />
              </>
            } />

            {/* Produto individual */}
            <Route path="/produto/:slug" element={<ProductSeoPage addToCart={addToCart} />} />

            {/* Checkout — rotas filhas ANTES da rota pai para evitar ambiguidade */}
            <Route path="/checkout/success"  element={<OrderSuccessPage />} />
            <Route path="/checkout/failure"  element={<OrderPendingPage />} />
            <Route path="/checkout/rejected" element={<OrderFailurePage />} />
            <Route path="/checkout" element={
              <CheckoutPage
                cart={cart}
                subtotal={currentCartSubtotal}
                emptyCart={emptyCart}
              />
            } />

            {/* Páginas institucionais */}
            <Route path="/sobre"               element={<AboutPage />} />
            <Route path="/contato"             element={<ContatoPage />} />
            <Route path="/politica-de-frete"   element={<PoliticaFretePage />} />
            <Route path="/trocas-e-devolucoes" element={<TrocasDevolucoesPage />} />
            <Route path="/privacidade"         element={<PrivacidadePage />} />
            <Route path="/termos"              element={<TermosPage />} />

            {/* Redirects de URLs legadas e aliases de política */}
            <Route path="/shop"    element={<Navigate to="/produtos"    replace />} />
            <Route path="/loja"    element={<Navigate to="/produtos"    replace />} />
            <Route path="/about"   element={<Navigate to="/sobre"       replace />} />
            <Route path="/contact" element={<Navigate to="/contato"     replace />} />
            <Route path="/lgpd"    element={<Navigate to="/privacidade" replace />} />
            <Route path="/cookies" element={<Navigate to="/privacidade" replace />} />

            {/* 404 */}
            <Route path="*" element={
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                404: Página não encontrada
              </div>
            } />
          </Routes>
        </Suspense>
        </main>

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
