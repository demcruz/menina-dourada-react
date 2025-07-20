import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

import log from '../img/logo2.png'

const Navbar = ({ setIsCartOpen, cart }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="navbar-main"> {/* Substituído: bg-white shadow-md sticky top-0 z-50 */}
            <div className="navbar-content"> {/* Substituído: container mx-auto px-4 py-3 flex justify-between items-center */}
<Link to="/" className="navbar-logo-link"> {/* <--- New class for potential styling of the link container */}
                    <img src={log} alt="Menina Dourada Logo" className="navbar-logo-image" /> {/* <--- Use the imported image */}
                </Link>
                <div className="navbar-links-desktop"> {/* Substituído: hidden md:flex space-x-8 */}
                    <Link to="/" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Home</Link>
                    <Link to="/shop" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Loja</Link>
                    <Link to="/about" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Sobre Nós</Link>
                    <Link to="/contact" className="hover:text-gold-600 transition" onClick={handleNavLinkClick}>Contato</Link>
                </div>

                <div className="navbar-actions"> {/* Substituído: flex items-center space-x-4 */}
                    <button id="cart-button" className="cart-button-icon-container" onClick={() => setIsCartOpen(true)}> {/* Substituído: relative */}
                        <i className="fas fa-shopping-bag cart-icon"></i> {/* Substituído: text-xl hover:text-gold-600 transition */}
                        <span id="cart-count" className="cart-count-badge">{totalItems}</span> {/* Substituído: absolute -top-2 -right-2 bg-gold-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center */}
                    </button>
                    <button className="mobile-menu-toggle-button" id="mobile-menu-button" onClick={toggleMobileMenu}> {/* Substituído: md:hidden */}
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div id="mobile-menu" className="mobile-menu-panel"> {/* Substituído: md:hidden bg-white py-2 px-4 shadow-lg */}
                    <Link to="/" className="block py-2 hover:text-gold-600 transition" onClick={handleNavLinkClick}>Home</Link>
                    <Link to="/shop" className="block py-2 hover:text-gold-600 transition" onClick={handleNavLinkClick}>Loja</Link>
                    <Link to="/about" className="block py-2 hover:text-gold-600 transition" onClick={handleNavLinkClick}>Sobre Nós</Link>
                    <Link to="/contact" className="block py-2 hover:text-gold-600 transition" onClick={handleNavLinkClick}>Contato</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;