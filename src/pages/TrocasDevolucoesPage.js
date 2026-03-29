import React from 'react';
import { Link } from 'react-router-dom';
import AdvancedSEO from '../seo/AdvancedSEO';
import { webPageSchema } from '../seo/schema';
import '../styles/InstitucionalPage.css';

const TrocasDevolucoesPage = () => (
  <>
    <AdvancedSEO
      title="Trocas e Devoluções | Menina Dourada"
      description="Política de trocas e devoluções da Menina Dourada. Devolução em até 7 dias e troca em até 30 dias após o recebimento."
      url="https://meninadourada.shop/trocas-e-devolucoes"
      canonical="https://meninadourada.shop/trocas-e-devolucoes"
      jsonLd={webPageSchema('Trocas e Devoluções', 'https://meninadourada.shop/trocas-e-devolucoes')}
    />

    <div className="inst-page">
      <div className="inst-hero">
        <span className="inst-hero-icon">🔄</span>
        <h1>Trocas e Devoluções</h1>
        <p>Nosso compromisso é com a sua satisfação.</p>
      </div>

      <div className="inst-section">
        <h2>↩️ Prazo para Devolução</h2>
        <p>
          Você pode solicitar a devolução de um ou mais itens em até{' '}
          <strong>7 dias corridos</strong> após o recebimento do pedido, conforme o{' '}
          Código de Defesa do Consumidor.
        </p>
      </div>

      <div className="inst-section">
        <h2>🔁 Prazo para Troca</h2>
        <p>
          Você pode solicitar a troca em até <strong>30 dias corridos</strong> após o recebimento.
        </p>
      </div>

      <div className="inst-section">
        <h2>📏 Troca por Tamanho</h2>
        <p>Disponível em até <strong>15 dias corridos</strong> após o recebimento.</p>
        <p>O produto deve ser enviado em até <strong>7 dias</strong> após a solicitação.</p>
        <div className="inst-highlight inst-highlight-danger">
          <p>
            <strong>Atenção:</strong> a troca por tamanho não garante reserva de estoque.
            Caso o item não esteja disponível, será realizado o estorno do valor pago.
          </p>
        </div>
      </div>

      <div className="inst-section">
        <h2>✅ Condições do Produto</h2>
        <p>Para que a troca ou devolução seja aceita, o produto deve estar:</p>
        <ul>
          <li>Sem uso</li>
          <li>Com etiqueta original</li>
          <li>Em perfeitas condições</li>
        </ul>
      </div>

      <div className="inst-section">
        <h2>💰 Forma de Reembolso</h2>
        <p>
          Após a análise e aprovação, o reembolso será realizado conforme o método de
          pagamento utilizado na compra.
        </p>
      </div>

      <div className="inst-section">
        <h2>Como Iniciar uma Solicitação</h2>
        <p>Entre em contato com nosso suporte informando o número do pedido e o motivo:</p>
        <div className="inst-contact-grid">
          <a
            href="mailto:contato@meninadourada.shop"
            className="inst-contact-card email"
          >
            <span className="inst-contact-icon">✉️</span>
            <strong>E-mail</strong>
            <span>contato@meninadourada.shop</span>
          </a>
          <a
            href="https://wa.me/5521998043352"
            target="_blank"
            rel="noopener noreferrer"
            className="inst-contact-card whatsapp"
          >
            <span className="inst-contact-icon">💬</span>
            <strong>WhatsApp</strong>
            <span>(21) 99804-3352</span>
          </a>
        </div>
      </div>

      <Link to="/produtos" className="inst-back">← Voltar para a loja</Link>
    </div>
  </>
);

export default TrocasDevolucoesPage;
