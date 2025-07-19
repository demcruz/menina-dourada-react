// src/components/CartSidebar.js
import React from 'react';
import { Link } from 'react-router-dom'; // <--- Importe Link aqui

const CartSidebar = ({ isOpen, toggleCart, cart, removeFromCart, updateCartItemQuantity, onCheckoutClick }) => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <>
            <div
                id="cart-sidebar"
                className={`cart-sidebar md:w-96 ${isOpen ? 'cart-open' : 'cart-closed'}`}
            >
                <div className="cart-content-padding">
                    <div className="cart-header">
                        <h3 className="cart-title">Seu Carrinho</h3>
                        <button id="close-cart" className="close-cart-button" onClick={toggleCart}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div id="cart-items" className="cart-items-list">
                        {cart.length === 0 ? (
                            (<p id="empty-cart-message" className="empty-cart-message">Seu carrinho está vazio</p>)
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-details">
                                        <h4 className="cart-item-name">{item.name}</h4>
                                        <div className="cart-item-quantity-control">
                                            <button
                                                className="quantity-button"
                                                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button
                                                className="quantity-button"
                                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-price-remove">
                                        <p className="cart-item-price">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                                        <button
                                            className="remove-item-button"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="cart-summary">
                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span id="cart-subtotal">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Frete</span>
                            <span id="cart-shipping">Calcular</span>
                        </div>
                        <div className="cart-total-row">
                            <span>Total</span>
                            <span id="cart-total">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>

                    {/* Botão Finalizar Compra agora é um Link */}
                    <Link to="/checkout" className="checkout-button" onClick={onCheckoutClick}> {/* Adiciona onClick aqui */}
                        Finalizar Compra
                    </Link>

                    <div className="continue-shopping-area">
                        <p className="continue-shopping-text">ou</p>
                        <button id="continue-shopping" className="continue-shopping-button" onClick={toggleCart}>
                            Continuar comprando
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div id="cart-overlay" className="cart-overlay" onClick={toggleCart}></div>
            )}
        </>
    );
};

export default CartSidebar;