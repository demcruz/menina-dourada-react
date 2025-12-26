import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaClipboardList } from 'react-icons/fa';
import './OrderSuccessPage.css';

const formatCurrency = (value) =>
  (Number(value) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const formatDate = (value) => {
  if (!value) return 'Em processamento';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const {
    paymentId,
    totalAmount,
    dueDate,
    orderTitle,
    deliveryInfo = {},
    items = [],
    confirmedAt,
  } = state || {};

  const hasData = Boolean(paymentId);
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  if (!hasData) {
    return (
      <div className="success-page-container">
        <div className="success-card fallback">
          <FaClipboardList size={56} color="#bfa14a" />
          <h1>Nenhum pedido encontrado</h1>
          <p>
            Esta pagina aparece logo apos confirmarmos o pagamento PIX. Finalize um novo pedido para
            visualizar o resumo completo novamente.
          </p>
          <div className="success-actions">
            <Link to="/shop" className="action-button shopping">
              <FaShoppingBag />
              <span>Voltar para a loja</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingLines = [
    [deliveryInfo.address, deliveryInfo.number, deliveryInfo.complement].filter(Boolean).join(', '),
    [deliveryInfo.neighborhood, deliveryInfo.city, deliveryInfo.state, deliveryInfo.zipCode]
      .filter(Boolean)
      .join(' - '),
  ].filter(Boolean);

  return (
    <div className="success-page-container">
      <div className="success-grid">
        <section className="success-hero-card">
          <div className="status-pill">
            <FaCheckCircle size={18} />
            <span>Pagamento confirmado</span>
          </div>
          <h1>
            Obrigado, {deliveryInfo.fullName ? deliveryInfo.fullName.split(' ')[0] : 'cliente'}!
          </h1>
          <p>
            Recebemos o seu pagamento PIX e ja estamos preparando o envio. Assim que o pacote sair do
            estoque, voce recebera um e-mail com o codigo de rastreio.
          </p>
          <div className="hero-meta">
            <div>
              <span>Valor pago</span>
              <strong>{formatCurrency(totalAmount)}</strong>
            </div>
            <div>
              <span>ID do pagamento</span>
              <strong>{paymentId}</strong>
            </div>
            <div>
              <span>Itens</span>
              <strong>{totalQuantity}</strong>
            </div>
          </div>
          <div className="success-actions">
            <Link to="/shop" className="action-button shopping">
              <FaShoppingBag />
              <span>Continuar comprando</span>
            </Link>
            <Link to="/meus-pedidos" className="action-button orders">
              <FaClipboardList />
              <span>Meus pedidos</span>
            </Link>
          </div>
        </section>

        <section className="success-info-card">
          <h2>Dados de envio</h2>
          <p className="delivery-name">{deliveryInfo.fullName}</p>
          {deliveryInfo.email && <p className="delivery-line">{deliveryInfo.email}</p>}
          {(deliveryInfo.phone || deliveryInfo.mobilePhone) && (
            <p className="delivery-line">
              {[deliveryInfo.phone, deliveryInfo.mobilePhone].filter(Boolean).join(' / ')}
            </p>
          )}
          {shippingLines.map((line, index) => (
            <p className="delivery-line" key={index}>
              {line}
            </p>
          ))}
          <div className="info-note">
            Manteremos voce informado por e-mail sobre cada etapa. Assim que despacharmos, enviamos o
            rastreio automaticamente.
          </div>
        </section>

        <section className="success-info-card">
          <h2>Resumo do pedido</h2>
          <div className="info-row">
            <span>Pedido</span>
            <strong>{orderTitle || 'Pedido Menina Dourada'}</strong>
          </div>
          <div className="info-row">
            <span>Valor pago</span>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>
          <div className="info-row">
            <span>Confirmado em</span>
            <strong>{formatDate(confirmedAt)}</strong>
          </div>
          <div className="info-row">
            <span>Vencimento PIX</span>
            <strong>{dueDate || 'Pago imediatamente'}</strong>
          </div>
        </section>

        <section className="success-info-card">
          <h2>Itens</h2>
          <div className="items-list">
            {items.length === 0 && <p className="delivery-line">Itens indisponiveis.</p>}
            {items.map((item) => (
              <div className="item-row" key={`${item.id}-${item.name}`}>
                {item.image && <img src={item.image} alt={item.name} />}
                <div className="item-details">
                  <p>{item.name}</p>
                  <span>
                    Qtd: {item.quantity} • {formatCurrency(item.unitPrice)}
                  </span>
                </div>
                <strong>{formatCurrency(item.unitPrice * item.quantity)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
