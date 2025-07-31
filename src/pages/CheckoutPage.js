import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPaymentPreference } from '../api/axiosInstance';

const CheckoutPage = ({ cart }) => {
    const navigate = useNavigate();

    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: '',
        email: '',
        cpf: '',
        phone: '',         // <-- NOVO
        address: '',
        number: '',        // <-- NOVO
        neighborhood: '',  // <-- NOVO
        city: '',
        state: '',
        zipCode: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Validação dos campos obrigatórios
        if (!Object.values(deliveryInfo).every(field => field.trim() !== '')) {
            setError('Por favor, preencha todas as informações de entrega.');
            setIsLoading(false);
            return;
        }

        // Monta o objeto conforme o PaymentRequestDTO do backend
        const paymentRequestDTO = {
            userId: "user-123", // ajuste conforme sua lógica de autenticação
            payerEmail: deliveryInfo.email, // ajuste conforme sua lógica de autenticação
            customerName: deliveryInfo.fullName,
            customerCpf: deliveryInfo.cpf,
            customerPhone: deliveryInfo.phone,
            shippingAddress: {
                street: deliveryInfo.address,
                number: deliveryInfo.number,
                neighborhood: deliveryInfo.neighborhood,
                city: deliveryInfo.city,
                state: deliveryInfo.state,
                zipCode: deliveryInfo.zipCode
            },
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                unitPrice: parseFloat(item.price) || parseFloat(item.variacoes?.[0]?.preco) || 0
            })),
            totalAmount: cart.reduce((total, item) => {
                const price = parseFloat(item.price) || parseFloat(item.variacoes?.[0]?.preco) || 0;
                return total + (price * item.quantity);
            }, 0)
        };

        try {
            const response = await createPaymentPreference(paymentRequestDTO);
            setSuccessMessage('Pedido criado! Você será redirecionado para o Mercado Pago para finalizar o pagamento.');
            setTimeout(() => {
                window.location.href = response.initPoint;
            }, 2000);
        } catch (err) {
            setError('Falha ao processar o pagamento. Tente novamente.');
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
                        <label className="form-field-label">Telefone</label>
                        <input type="text" name="phone" value={deliveryInfo.phone} onChange={handleDeliveryInfoChange} required />
                        <label className="form-field-label">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={deliveryInfo.email}
                            onChange={handleDeliveryInfoChange}
                            required
                        />
                        <label className="form-field-label">CPF</label>
                        <input type="text" name="cpf" value={deliveryInfo.cpf} onChange={handleDeliveryInfoChange} required />

                        <label className="form-field-label">Endereço</label>
                        <input type="text" name="address" value={deliveryInfo.address} onChange={handleDeliveryInfoChange} required />
                        <label className="form-field-label">Número</label>

                        <input type="text" name="number" value={deliveryInfo.number} onChange={handleDeliveryInfoChange} required />
                        <label className="form-field-label">Bairro</label>

                        <input type="text" name="neighborhood" value={deliveryInfo.neighborhood} onChange={handleDeliveryInfoChange} required />
                        <label className="form-field-label">Cidade</label>

                        <input type="text" name="city" value={deliveryInfo.city} onChange={handleDeliveryInfoChange} required />

                        <label className="form-field-label">Estado</label>
                        <input type="text" name="state" value={deliveryInfo.state} onChange={handleDeliveryInfoChange} required />

                        <label className="form-field-label">CEP</label>
                        <input type="text" name="zipCode" value={deliveryInfo.zipCode} onChange={handleDeliveryInfoChange} required />


                    </div>
                </div>

                <div className="checkout-section-right-column flex-1">
                    {/* Mensagem amigável sobre o redirecionamento */}
                    <div className="checkout-section">
                        <div className="payment-redirect-message" style={{ background: '#fffbe6', border: '1px solid #ffe58f', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                            <strong>Atenção:</strong> Após confirmar o pedido, você será redirecionado para o Mercado Pago para finalizar o pagamento com total segurança.
                        </div>
                    </div>

                    {/* 3. Resumo do Pedido */}
                    <div className="checkout-section">
                        <h2 className="checkout-section-heading">3. Resumo do Pedido</h2>
                        <div className="summary-items">
                            {cart.map(item => {
                                const price = parseFloat(item.price) || parseFloat(item.variacoes?.[0]?.preco) || 0;
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