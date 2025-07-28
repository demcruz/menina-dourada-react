import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPaymentPreference } from '../api/axiosInstance';

const CheckoutPage = ({ cart }) => {
    const navigate = useNavigate();

    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: '',
        cpf: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [creditCardInfo, setCreditCardInfo] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [paymentResult, setPaymentResult] = useState(null);

    // Calcula o subtotal do carrinho (usando fallback para preço da variação)
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price) || parseFloat(item.variacoes?.[0]?.preco) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
    }, 0);

    const formatCurrency = (value) => {
        const numValue = parseFloat(value) || 0;
        return numValue.toFixed(2).replace('.', ',');
    };

    const handleDeliveryInfoChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleCreditCardInfoChange = (e) => {
        const { name, value } = e.target;
        setCreditCardInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        setPaymentResult(null);

        if (!Object.values(deliveryInfo).every(field => field.trim() !== '')) {
            setError('Por favor, preencha todas as informações de entrega.');
            setIsLoading(false);
            return;
        }

        // Monta os itens no formato esperado pelo backend
        const orderItems = cart.map(item => ({
            productId: item.id,
            productName: item.name,
            variationId: item.cartItemId,
            quantity: item.quantity,
            unitPrice: parseFloat(item.price) || parseFloat(item.variacoes?.[0]?.preco) || 0
        }));

        const paymentRequestDTO = {
            userId: "user-123",
            payerEmail: "cliente@teste.com",
            totalAmount: subtotal,
            items: orderItems
        };

        try {
            const response = await createPaymentPreference(paymentRequestDTO);
            setSuccessMessage('Pedido e Preferência de Pagamento criados com sucesso!');
            setPaymentResult(response);
            window.location.href = response.initPoint;
        } catch (err) {
            console.error("Erro ao finalizar compra:", err.response?.data || err.message || err);
            setError(err.response?.data?.message || 'Falha ao processar o pagamento. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!cart || cart.length === 0) {
            navigate('/shop');
        }
    }, [cart, navigate]);

    return (
        <div className="checkout-page-container container">
            <h1 className="checkout-title section-title">Finalizar Compra</h1>
            <form onSubmit={handlePlaceOrder} className="checkout-layout-grid md:flex-row">
                {/* 1. Informações de Entrega */}
                <div className="checkout-section checkout-shipping-details flex-1 md:pr-8 md:mb-0">
                    <h2 className="checkout-section-heading">1. Informações de Entrega</h2>
                    <div className="checkout-form-section">
                        <label className="form-field-label">Nome Completo</label>
                        <input type="text" name="fullName" value={deliveryInfo.fullName} onChange={handleDeliveryInfoChange} required />

                        <label className="form-field-label">CPF</label>
                        <input type="text" name="cpf" value={deliveryInfo.cpf} onChange={handleDeliveryInfoChange} required />

                        <label className="form-field-label">Endereço</label>
                        <input type="text" name="address" value={deliveryInfo.address} onChange={handleDeliveryInfoChange} required />

                        <label className="form-field-label">Cidade</label>
                        <input type="text" name="city" value={deliveryInfo.city} onChange={handleDeliveryInfoChange} required />

                        <label className="form-field-label">Estado</label>
                        <input type="text" name="state" value={deliveryInfo.state} onChange={handleDeliveryInfoChange} required />

                        <label className="form-field-label">CEP</label>
                        <input type="text" name="zipCode" value={deliveryInfo.zipCode} onChange={handleDeliveryInfoChange} required />
                    </div>
                </div>

                <div className="checkout-section-right-column flex-1">
                    {/* 2. Forma de Pagamento */}
                    <div className="checkout-section">
                        <h2 className="checkout-section-heading">2. Forma de Pagamento</h2>
                        <div className="payment-options">
                            <label className="payment-option-card">
                                <input type="radio" name="paymentMethod" value="creditCard" checked={paymentMethod === 'creditCard'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                Cartão de Crédito
                            </label>
                            <label className="payment-option-card">
                                <input type="radio" name="paymentMethod" value="boleto" checked={paymentMethod === 'boleto'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                Boleto Bancário
                            </label>
                            <label className="payment-option-card">
                                <input type="radio" name="paymentMethod" value="pix" checked={paymentMethod === 'pix'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                Pix
                            </label>
                        </div>

                        {paymentMethod === 'creditCard' && (
                            <div className="credit-card-form-fields">
                                <label className="form-field-label">Número do Cartão</label>
                                <input type="text" name="cardNumber" value={creditCardInfo.cardNumber} onChange={handleCreditCardInfoChange} required={paymentMethod === 'creditCard'} />

                                <label className="form-field-label">Nome no Cartão</label>
                                <input type="text" name="cardHolderName" value={creditCardInfo.cardHolderName} onChange={handleCreditCardInfoChange} required={paymentMethod === 'creditCard'} />

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="form-field-label">Validade (MM/AA)</label>
                                        <input type="text" name="expiryDate" value={creditCardInfo.expiryDate} onChange={handleCreditCardInfoChange} placeholder="MM/AA" required={paymentMethod === 'creditCard'} />
                                    </div>
                                    <div className="flex-1">
                                        <label className="form-field-label">CVV</label>
                                        <input type="text" name="cvv" value={creditCardInfo.cvv} onChange={handleCreditCardInfoChange} required={paymentMethod === 'creditCard'} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. Resumo do Pedido */}
                    <div className="checkout-section">
                        <h2 className="checkout-section-heading">3. Resumo do Pedido</h2>
                        <div className="summary-items">
    {cart.map(item => {
        const price = parseFloat(item.price) || parseFloat(item.variacoes?.[0]?.preco) || 0;
        // Busca imagem do produto, da variação ou placeholder
        const imageUrl =
            item.image ||
            item.imagens?.[0]?.url ||
            item.variacoes?.[0]?.imagens?.[0]?.url ||
            'https://via.placeholder.com/64x64?text=Sem+Imagem';

        return (
            <div key={item.cartItemId || item.id} className="summary-item" style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <img
                    src={imageUrl}
                    alt={item.name}
                    className="summary-item-image"
                    style={{
                        width: 48,
                        height: 48,
                        objectFit: 'cover',
                        borderRadius: 8,
                        marginRight: 12,
                        border: '1px solid #eee'
                    }}
                />
                <div className="summary-item-details" style={{ flex: 1 }}>
                    <span className="summary-item-name" style={{ fontWeight: 500 }}>{item.name}</span>
                    <span className="summary-item-qty" style={{ color: '#bfa14a', marginLeft: 8 }}>Qtd: {item.quantity}</span>
                </div>
                <span className="summary-item-price" style={{ fontWeight: 600 }}>
                    R$ {formatCurrency(price * item.quantity)}
                </span>
            </div>
        );
    })}
</div>
                        <div className="summary-totals">
                            <div className="summary-total-row">
                                <span>Subtotal</span>
                                <span>R$ {formatCurrency(subtotal)}</span>
                            </div>
                            <div className="summary-total-row">
                                <span>Frete</span>
                                <span>R$ 0,00</span>
                            </div>
                            <div className="summary-total-row summary-grand-total">
                                <span>Total</span>
                                <span>R$ {formatCurrency(subtotal)}</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="place-order-button" disabled={isLoading}>
                        {isLoading ? 'Processando...' : 'Confirmar Pedido'}
                    </button>

                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {error && <p className="error-message">{error}</p>}

                    {paymentResult && (
                        <div className="payment-result-area">
                            <h3 className="modal-section-title">Detalhes do Pagamento</h3>
                            {/* ...exibição dos detalhes do pagamento... */}
                            <button onClick={() => setPaymentResult(null)} className="clear-payment-result-button">Limpar Resultado</button>
                        </div>
                    )}

                    <div className="back-to-cart-link-container">
                        <Link to="/cart" className="back-to-cart-link">
                            Voltar para o Carrinho
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;