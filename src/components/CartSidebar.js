import React from 'react';
import { Link } from 'react-router-dom';
import './CartSidebar.css';
import { API_BASE_URL } from '../api/axiosInstance';
import { getThumbSrc } from '../utils/productImage';

const buildImageUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

const getCartItemImage = (item) => {
    const img = item.imagens?.[0] || item.variacoes?.[0]?.imagens?.[0];
    const url =
        item.image ||
        (img ? getThumbSrc(img) : null) ||
        item.variacoes?.[0]?.imagemPrincipal;
    return buildImageUrl(url);
};

const CartSidebar = ({ isOpen, toggleCart, cart, removeFromCart, updateCartItemQuantity, onCheckoutClick }) => {
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
    }, 0);

    const formatCurrency = (value) => {
        const numValue = parseFloat(value) || 0;
        return numValue.toFixed(2).replace('.', ',');
    };

    // Mensagem PIX
    const pixMessage = subtotal > 0 ? 'Pagamento via PIX • Aprovação imediata' : '';

    return (
        <>
            <div className={`cart-sidebar ${isOpen ? 'cart-open' : 'cart-closed'}`}>
                {/* Header */}
                <div className="cart-header">
                    <h3 className="cart-header-title">Seu Carrinho</h3>
                    <button className="cart-close-btn" onClick={toggleCart} aria-label="Fechar carrinho">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            <p>Seu carrinho está vazio</p>
                            <Link
                                to="/produtos"
                                className="cart-empty-btn"
                                onClick={toggleCart}
                            >
                                Explorar produtos
                            </Link>                        </div>
                    ) : (
                        cart.map((item) => {
                            const imageUrl = getCartItemImage(item) || 'https://via.placeholder.com/80x80?text=Foto';
                            const altText = item.nome || item.name || 'Produto';
                            const quantityValue = parseInt(item.quantity) || 0;
                            const priceValue = (parseFloat(item.price) || 0) * quantityValue;
                            const itemInfo = [item.cor, item.tamanho].filter(Boolean).join(', ');

                            return (
                                <div key={item.id} className="cart-item">
                                    <img src={imageUrl} alt={altText} className="cart-item-img" width="72" height="72" loading="lazy" decoding="async" />
                                    
                                    <div className="cart-item-info">
                                        <div className="cart-item-top">
                                            <div className="cart-item-name-wrap">
                                                <h4 className="cart-item-name">{altText}</h4>
                                                {itemInfo && <span className="cart-item-variant">({itemInfo})</span>}
                                            </div>
                                            <button
                                                className="cart-item-remove"
                                                onClick={() => removeFromCart(item.id)}
                                                aria-label="Remover item"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                        
                                        <div className="cart-item-bottom">
                                            <div className="cart-item-qty">
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => updateCartItemQuantity(item.id, quantityValue - 1)}
                                                    disabled={quantityValue <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="qty-value">{quantityValue}</span>
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => updateCartItemQuantity(item.id, quantityValue + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="cart-item-price">R$ {formatCurrency(priceValue)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer - só mostra se tiver itens */}
                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary">
                            <div className="cart-summary-row">
                                <span>Subtotal</span>
                                <span>R$ {formatCurrency(subtotal)}</span>
                            </div>
                            <div className="cart-summary-total">
                                <span>Total</span>
                                <div className="cart-total-value">
                                    <strong>R$ {formatCurrency(subtotal)}</strong>
                                    <span className="cart-pix-info">{pixMessage}</span>
                                </div>
                            </div>
                        </div>

                        <Link to="/checkout" className="cart-checkout-btn" onClick={onCheckoutClick}>
                            Finalizar Compra
                        </Link>

                        <Link
                            to="/produtos"
                            className="cart-continue-btn"
                            onClick={toggleCart}
                        >
                            Ver mais produtos
                        </Link>
                    </div>
                )}
            </div>

            {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
        </>
    );
};

export default CartSidebar;
