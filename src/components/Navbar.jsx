import React from 'react';
import '../styles/Navbar.css';

function Navbar({ setIsCartOpen, cart }) {

  return (
    <nav className="navbar">
      <div className="navbar-container">
  <a href="#home" className="navbar-logo">Menina Dourada</a>
  <div className="navbar-links">
    <a href="#produtos">Produtos</a>
    <a href="#sobre">Sobre</a>
    <a href="#depoimentos">Depoimentos</a>
    <a href="#contato">Contato</a>
  </div>
  <button onClick={() => setIsCartOpen(true)}>
  🛒 ({cart.length})
</button>
</div>
    </nav>
  );
}


export default Navbar;
