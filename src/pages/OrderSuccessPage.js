import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderSuccessPage = () => {
    const location = useLocation();
    const [paymentId, setPaymentId] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setPaymentId(queryParams.get('payment_id'));
        setPreferenceId(queryParams.get('preference_id'));
        // Você pode adicionar lógica aqui para, por exemplo, buscar os detalhes do pedido no backend
        // usando o paymentId ou preferenceId, se necessário.
    }, [location]);

    return (
        <div className="order-status-container container">
            <h1 className="order-status-title success">Pagamento Aprovado!</h1>
            <p className="order-status-message">Seu pedido foi realizado com sucesso.</p>
            {paymentId && <p className="order-detail">ID do Pagamento: <strong>{paymentId}</strong></p>}
            {preferenceId && <p className="order-detail">ID da Preferência: <strong>{preferenceId}</strong></p>}
            <p className="order-status-message">Em breve você receberá um e-mail com os detalhes da sua compra.</p>
            <Link to="/shop" className="order-status-button">Continuar Comprando</Link>
            <Link to="/my-orders" className="order-status-link">Ver Meus Pedidos (se houver)</Link>
        </div>
    );
};

export default OrderSuccessPage;