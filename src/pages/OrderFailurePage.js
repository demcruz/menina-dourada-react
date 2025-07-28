import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderFailurePage = () => {
    const location = useLocation();
    const [paymentId, setPaymentId] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setPaymentId(queryParams.get('payment_id'));
        setPreferenceId(queryParams.get('preference_id'));
        // Você pode adicionar lógica aqui para sugerir ao usuário tentar novamente
        // ou verificar os dados do cartão.
    }, [location]);

    return (
        <div className="order-status-container container">
            <h1 className="order-status-title failure">Pagamento Recusado</h1>
            <p className="order-status-message">Não foi possível processar seu pagamento.</p>
            {paymentId && <p className="order-detail">ID do Pagamento: <strong>{paymentId}</strong></p>}
            {preferenceId && <p className="order-detail">ID da Preferência: <strong>{preferenceId}</strong></p>}
            <p className="order-status-message">Por favor, verifique os dados do seu pagamento e tente novamente.</p>
            <Link to="/checkout" className="order-status-button">Tentar Novamente</Link>
            <Link to="/contact" className="order-status-link">Precisa de Ajuda? Entre em Contato</Link>
        </div>
    );
};

export default OrderFailurePage;
