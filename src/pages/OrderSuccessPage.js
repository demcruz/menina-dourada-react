import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaClipboardList } from 'react-icons/fa';

const OrderSuccessPage = () => {
    return (
        <div className="success-page-container">
            <div className="success-card">
                <div className="success-icon">
                    <FaCheckCircle size={60} color="#4CAF50"/>
                </div>

                <h1 className="success-title">Pagamento Aprovado!</h1>
                <p className="success-subtitle">Seu pedido foi realizado com sucesso</p>

                <div className="success-details">
                    <div className="info-row">
                        <span className="info-label">Número do Pedido:</span>
                        <span className="info-value">#1340014759</span>
                    </div>
                </div>

                <p className="email-notice">
                    Em breve você receberá um e-mail com os detalhes da sua compra
                </p>

                <div className="success-actions">
                    <Link to="/shop" className="action-button shopping">
                        <FaShoppingBag />
                        <span>Continuar Comprando</span>
                    </Link>
                    <Link to="/meus-pedidos" className="action-button orders">
                        <FaClipboardList />
                        <span>Meus Pedidos</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;