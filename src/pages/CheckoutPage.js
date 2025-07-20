import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutPage = ({ cart, subtotal, removeFromCart, updateCartItemQuantity }) => {
   

 
    const sampleCartItems = cart || [ 
        { id: '1', name: 'Biquíni Sol Dourado', price: 189.90, quantity: 1, image: 'https://images.unsplash.com/photo-1616216447660-f463372c3d9a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: '2', name: 'Maiô Elegance', price: 249.90, quantity: 2, image: 'https://images.unsplash.com/photo-1594916895315-e21e7d9b4009?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ];
    const currentSubtotal = subtotal || sampleCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCost = 0.00; // Por enquanto, frete grátis ou fixo
    const totalAmount = currentSubtotal + shippingCost;


    const handlePlaceOrder = (e) => {
        e.preventDefault();
        alert('Pedido finalizado! Obrigado por sua compra!');
     
        console.log('Finalizando compra...');
     
    };

    return (
        <div className="checkout-page-container">
            <div className="container mx-auto px-4 py-8">
                <h1 className="checkout-title section-title">Finalizar Compra</h1> 

                <div className="checkout-layout-grid md:flex-row">
                    <div className="checkout-section checkout-shipping-details">
                        <h2 className="checkout-section-heading">1. Informações de Entrega</h2>
                        <form className="checkout-form-section">
                            <div className="form-group">
                                <label htmlFor="fullName" className="form-field-label">Nome Completo</label>
                                <input type="text" id="fullName" className="w-full" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cpf" className="form-field-label">CPF</label>
                                <input type="text" id="cpf" className="w-full" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address" className="form-field-label">Endereço</label>
                                <input type="text" id="address" className="w-full" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city" className="form-field-label">Cidade</label>
                                <input type="text" id="city" className="w-full" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state" className="form-field-label">Estado</label>
                                <input type="text" id="state" className="w-full" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zip" className="form-field-label">CEP</label>
                                <input type="text" id="zip" className="w-full" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone" className="form-field-label">Telefone</label>
                                <input type="text" id="phone" className="w-full" required />
                            </div>
                        </form>
                    </div>

                    <div className="checkout-section-right-column">
                        <div className="checkout-section checkout-payment-details">
                            <h2 className="checkout-section-heading">2. Forma de Pagamento</h2>
                            <div className="payment-options">
                                <label className="payment-option-card">
                                    <input type="radio" name="paymentMethod" value="creditCard" defaultChecked /> Cartão de Crédito
                                </label>
                                <label className="payment-option-card">
                                    <input type="radio" name="paymentMethod" value="boleto" /> Boleto Bancário
                                </label>
                                <label className="payment-option-card">
                                    <input type="radio" name="paymentMethod" value="pix" /> Pix
                                </label>
                            </div>
                            {/* Campos para cartão de crédito, se aplicável */}
                            <form className="checkout-form-section mt-4">
                                <div className="form-group">
                                    <label htmlFor="cardNumber" className="form-field-label">Número do Cartão</label>
                                    <input type="text" id="cardNumber" className="w-full" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cardName" className="form-field-label">Nome no Cartão</label>
                                    <input type="text" id="cardName" className="w-full" />
                                </div>
                                <div className="form-group flex justify-between">
                                    <div className="w-1/2 pr-2">
                                        <label htmlFor="expiryDate" className="form-field-label">Validade (MM/AA)</label>
                                        <input type="text" id="expiryDate" className="w-full" placeholder="MM/AA" />
                                    </div>
                                    <div className="w-1/2 pl-2">
                                        <label htmlFor="cvv" className="form-field-label">CVV</label>
                                        <input type="text" id="cvv" className="w-full" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="checkout-section checkout-order-summary">
                            <h2 className="checkout-section-heading">3. Resumo do Pedido</h2>
                            <div className="summary-items">
                                {sampleCartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <img src={item.image} alt={item.name} className="summary-item-image" />
                                        <div className="summary-item-details">
                                            <span className="summary-item-name">{item.name}</span>
                                            <span className="summary-item-qty">x{item.quantity}</span>
                                        </div>
                                        <span className="summary-item-price">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-totals">
                                <div className="summary-total-row">
                                    <span>Subtotal</span>
                                    <span>R$ {currentSubtotal.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <div className="summary-total-row">
                                    <span>Frete</span>
                                    <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <div className="summary-total-row summary-grand-total">
                                    <span>Total</span>
                                    <span>R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
                                </div>
                            </div>
                            <button className="place-order-button" onClick={handlePlaceOrder}>
                                Confirmar Pedido
                            </button>
                            <div className="back-to-cart-link-container">
                                 <Link to="/shop" className="back-to-cart-link">Voltar para a Loja</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;