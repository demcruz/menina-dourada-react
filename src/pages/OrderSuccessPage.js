import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaClipboardList } from 'react-icons/fa';
import './OrderSuccessPage.css';
import AdvancedSEO from '../seo/AdvancedSEO';

const MERCHANT_ID = 5746534315;

// Calcula data estimada de entrega: +10 dias úteis (seg-sex) a partir de hoje
function getEstimatedDelivery(fromDate) {
  const date = fromDate ? new Date(fromDate) : new Date();
  let businessDays = 0;
  while (businessDays < 10) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) businessDays++;
  }
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

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

  // Google Customer Reviews — opt-in snippet
  // Disparado uma vez após a confirmação do pedido
  useEffect(() => {
    if (!hasData || !deliveryInfo.email) return;

    const estimatedDelivery = getEstimatedDelivery(confirmedAt);

    const renderSurvey = () => {
      if (!window.gapi) return;
      window.gapi.load('surveyoptin', () => {
        window.gapi.surveyoptin.render({
          merchant_id:             MERCHANT_ID,
          order_id:                paymentId,
          email:                   deliveryInfo.email,
          delivery_country:        'BR',
          estimated_delivery_date: estimatedDelivery,
        });
      });
    };

    // Define o callback ANTES de injetar o script para evitar race condition
    window.renderOptIn = renderSurvey;

    if (!document.getElementById('google-survey-optin')) {
      const script = document.createElement('script');
      script.id  = 'google-survey-optin';
      script.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      // Script já carregado — chama direto
      renderSurvey();
    }
  }, [hasData, paymentId, deliveryInfo.email, confirmedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hasData) {
    return (
      <div className="success-page-container">
        <AdvancedSEO
          title="Pedido Confirmado | Menina Dourada"
          description="Seu pagamento foi aprovado. Em breve você receberá novidades sobre o envio."
          noindex
        />
        <div className="success-card fallback">
          <FaClipboardList size={56} color="#bfa14a" />
          <h1>Nenhum pedido encontrado</h1>
          <p>
            Esta pagina aparece logo apos confirmarmos o pagamento PIX. Finalize um novo pedido para
            visualizar o resumo completo novamente.
          </p>
          <div className="success-actions">
            <Link to="/produtos" className="action-button shopping">
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
      <AdvancedSEO
        title="Pedido Confirmado | Menina Dourada"
        description="Seu pagamento foi aprovado. Em breve você receberá novidades sobre o envio."
        noindex
      />
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
            <Link to="/produtos" className="action-button shopping">
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
                {item.image && <img src={item.image} alt={item.name || 'Produto Menina Dourada'} width="64" height="64" loading="lazy" decoding="async" />}
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
