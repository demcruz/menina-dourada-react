import React from 'react';
import '../styles/CartSidebar.css';

function CartSidebar({ isOpen, toggleCart, cart, removeFromCart }) {
  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Seu Carrinho</h2>
<button className="close-button" onClick={toggleCart}>✖</button>
      </div>

      {cart.length === 0 ? (
        <p className="empty">Seu carrinho está vazio.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item, index) => (
            <li className="cart-item" key={index}>
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">{item.price}</span>
              </div>
              <button className="remove-button" onClick={() => removeFromCart(index)}>Remover</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartSidebar;
