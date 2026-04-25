import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

import log from '../img/logo2.png';

// SVG icons inline — eliminam Font Awesome CDN (~80KB)
const BagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);

const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
);

const Navbar = ({ setIsCartOpen, cart }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const scrolledRef = useRef(false);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 50;
            if (scrolled !== scrolledRef.current) {
                scrolledRef.current = scrolled;
                setIsScrolled(scrolled);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleNavLinkClick = () => setIsMobileMenuOpen(false);

    return (
        <nav className={`navbar-main ${isScrolled ? 'navbar-scrolled' : ''}`}>
            {/* Trust bar — sempre renderizada, oculta via CSS quando scrolled para evitar CLS */}
            <div className={`trust-bar ${isScrolled ? 'trust-bar--hidden' : ''}`} aria-hidden={isScrolled}>
                <span>🚚 Frete grátis acima de R$ 250</span>
                <span className="trust-bar-divider">·</span>
                <span>🔒 Pagamento seguro</span>
                <span className="trust-bar-divider">·</span>
                <span>⭐ Qualidade premium</span>
            </div>
            <div className="navbar-content">
                <Link to="/" className="navbar-logo-link">
                    <img src={log} alt="Menina Dourada Logo" className="navbar-logo-image" width="140" height="40" />
                </Link>
                <div className="navbar-links-desktop">
                    <Link to="/" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Home</Link>
                    <Link to="/produtos" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Loja</Link>
                    <Link to="/sobre" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Sobre Nós</Link>
                    <Link to="/contato" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Contato</Link>
                </div>
                <div className="navbar-actions">
                    <button
                        id="cart-button"
                        className="cart-button-icon-container"
                        onClick={() => setIsCartOpen(true)}
                        aria-label={`Carrinho de compras, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
                    >
                        <BagIcon />
                        <span id="cart-count" className="cart-count-badge" aria-hidden="true">{totalItems}</span>
                    </button>
                    <button
                        className="mobile-menu-toggle-button"
                        id="mobile-menu-button"
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        <MenuIcon />
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div id="mobile-menu" className="mobile-menu-panel" role="navigation" aria-label="Menu principal">
                    <Link to="/" className="block py-2 hover:text-gold-600 transition" onClick={handleNavLinkClick}>Home</Link>
                    <Link to="/produtos" className="block py-2 hover:text-gold-600 transition" onClick={handleNavLinkClick}>Loja</Link>
                    <Link to="/sobre" className="block py-2 hover:text-gold-600 transition" onClick={handleNavLinkClick}>Sobre Nós</Link>
                    <Link to="/contato" className="block py-2 hover:text-gold-600 transition" onClick={handleNavLinkClick}>Contato</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
