import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

import log from '../img/logo2.png'

const Navbar = ({ setIsCartOpen, cart }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Detecta scroll para aplicar efeito translúcido
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`navbar-main ${isScrolled ? 'navbar-scrolled' : ''}`}>
            {/* Trust bar — visível apenas antes do scroll */}
            {!isScrolled && (
                <div className="trust-bar">
                    <span>🚚 Frete grátis acima de R$&nbsp;250</span>
                    <span className="trust-bar-divider">·</span>
                    <span>🔒 Pagamento seguro</span>
                    <span className="trust-bar-divider">·</span>
                    <span>⭐ Qualidade premium</span>
                </div>
            )}
            <div className="navbar-content">
<Link to="/" className="navbar-logo-link">
                    <img src={log} alt="Menina Dourada Logo" className="navbar-logo-image" />
                </Link>
                <div className="navbar-links-desktop">
                    <Link to="/" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Home</Link>
                    <Link to="/produtos" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Loja</Link>
                    <Link to="/sobre" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Sobre Nós</Link>
                    <Link to="/contato" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Contato</Link>
                </div>

                <div className="navbar-actions">
                    <button id="cart-button" className="cart-button-icon-container" onClick={() => setIsCartOpen(true)}>
                        <i className="fas fa-shopping-bag cart-icon"></i>
                        <span id="cart-count" className="cart-count-badge">{totalItems}</span>
                    </button>
                    <button className="mobile-menu-toggle-button" id="mobile-menu-button" onClick={toggleMobileMenu}>
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div id="mobile-menu" className="mobile-menu-panel">
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