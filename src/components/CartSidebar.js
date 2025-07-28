import React from 'react';
import { Link } from 'react-router-dom'; 
import './CartSidebar.css'; // Importa os estilos do carrinho

const CartSidebar = ({ isOpen, toggleCart, cart, removeFromCart, updateCartItemQuantity, onCheckoutClick }) => {
    // Garante que price e quantity são números válidos antes de somar
    const subtotal = cart.reduce((total, item) => {
        // Converte para float/int, default 0 se o valor for inválido (NaN, null, undefined)
        const price = parseFloat(item.price) || 0; 
        const quantity = parseInt(item.quantity) || 0; 
        return total + (price * quantity);
    }, 0);

    // Função auxiliar para formatar valores monetários com segurança
    const formatCurrency = (value) => {
        // Garante que o valor é um número antes de formatar
        const numValue = parseFloat(value) || 0; 
        return numValue.toFixed(2).replace('.', ',');
    };

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
                                    {/* Adicionar imagem do produto ao item do carrinho, se disponível */}
                                    {/* Acessa a primeira imagem da primeira variação do item */}
                                    {item.variacoes && item.variacoes[0]?.imagens[0]?.url && (
                                        <img src={item.variacoes[0].imagens[0].url} alt={item.name} className="cart-item-image" />
                                    )}

                                    <div className="cart-item-details">
                                        <h4 className="cart-item-name">{item.name}</h4>
                                        <div className="cart-item-quantity-control">
                                            <button
                                                className="quantity-button"
                                                onClick={() => updateCartItemQuantity(item.id, (parseInt(item.quantity) || 0) - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-display">{parseInt(item.quantity) || 0}</span>
                                            <button
                                                className="quantity-button"
                                                onClick={() => updateCartItemQuantity(item.id, (parseInt(item.quantity) || 0) + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-price-remove">
                                        {/* Garante que o cálculo seja feito com números válidos e formatado */}
                                        <p className="cart-item-price">
                                            R$ {formatCurrency((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0))}
                                        </p>
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
                            <span id="cart-subtotal">R$ {formatCurrency(subtotal)}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Frete</span>
                            <span id="cart-shipping">Calcular</span>
                        </div>
                        <div className="cart-total-row">
                            <span>Total</span>
                            <span id="cart-total">R$ {formatCurrency(subtotal)}</span> {/* Total é igual ao subtotal por enquanto */}
                        </div>
                    </div>


                    <Link to="/checkout" className="checkout-button" onClick={onCheckoutClick}>
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
