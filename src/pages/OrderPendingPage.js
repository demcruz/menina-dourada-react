import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderPendingPage = () => {
    const location = useLocation();
    const [paymentId, setPaymentId] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setPaymentId(queryParams.get('payment_id'));
        setPreferenceId(queryParams.get('preference_id'));
        // Você pode adicionar lógica aqui para instruir o usuário sobre o que fazer
        // (ex: verificar e-mail para boleto, aguardar confirmação do Pix).
    }, [location]);

    return (
        <div className="order-status-container container">
            <h1 className="order-status-title pending">Pagamento Pendente</h1>
            <p className="order-status-message">Seu pagamento está aguardando confirmação.</p>
            {paymentId && <p className="order-detail">ID do Pagamento: <strong>{paymentId}</strong></p>}
            {preferenceId && <p className="order-detail">ID da Preferência: <strong>{preferenceId}</strong></p>}
            <p className="order-status-message">Você receberá uma atualização por e-mail assim que o pagamento for confirmado.</p>
            <Link to="/shop" className="order-status-button">Continuar Comprando</Link>
            <Link to="/contact" className="order-status-link">Precisa de Ajuda? Entre em Contato</Link>
        </div>
    );
};

export default OrderPendingPage;
