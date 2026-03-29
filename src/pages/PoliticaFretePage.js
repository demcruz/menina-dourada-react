import React from 'react';
import { Link } from 'react-router-dom';
import AdvancedSEO from '../seo/AdvancedSEO';
import { webPageSchema } from '../seo/schema';
import '../styles/InstitucionalPage.css';

const PoliticaFretePage = () => (
  <>
    <AdvancedSEO
      title="Política de Frete | Menina Dourada"
      description="Saiba tudo sobre prazos, valores e condições de entrega da Menina Dourada. Frete grátis a partir de R$ 250. Entregamos para todo o Brasil."
      url="https://meninadourada.shop/politica-de-frete"
      canonical="https://meninadourada.shop/politica-de-frete"
      jsonLd={webPageSchema('Política de Frete', 'https://meninadourada.shop/politica-de-frete')}
    />

    <div className="inst-page">
      <div className="inst-hero">
        <span className="inst-hero-icon">🚚</span>
        <h1>Política de Frete</h1>
        <p>Entregamos para todo o território nacional com segurança e cuidado.</p>
      </div>

      <div className="inst-section">
        <h2>📦 Prazo de Processamento</h2>
        <p>
          Após a confirmação do pagamento, o pedido será processado e enviado para a transportadora
          em até <strong>3 dias úteis</strong>. A partir desse envio, passa a contar o prazo de
          entrega informado no checkout.
        </p>
        <p>
          O prazo de entrega e o valor do frete podem variar de acordo com o local de entrega e a
          modalidade escolhida no momento da compra.
        </p>
        <div className="inst-highlight">
          <p>
            As entregas são realizadas em horário comercial e atendemos todo o território nacional.
          </p>
        </div>
      </div>

      <div className="inst-section">
        <h2>🚛 Modalidades de Envio</h2>
        <ul>
          <li><strong>Correios SEDEX</strong> — entrega expressa</li>
          <li><strong>Correios PAC</strong> — entrega econômica</li>
          <li><strong>Transportadoras parceiras</strong> — conforme disponibilidade na sua região</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          O prazo e o valor do frete são calculados automaticamente no carrinho. Basta inserir o
          CEP e clicar em <strong>"Calcular Frete"</strong>.
        </p>
      </div>

      <div className="inst-section">
        <h2>🎁 Frete Grátis</h2>
        <p>
          Oferecemos <strong>frete grátis</strong> para compras acima de <strong>R$ 250,00</strong>.
        </p>
        <div className="inst-highlight">
          <p>Combine peças e aproveite o frete grátis na sua compra!</p>
        </div>
      </div>

      <div className="inst-section">
        <h2>⚠️ Períodos de Alta Demanda</h2>
        <p>
          Em períodos de alta demanda, como promoções e datas sazonais, podem ocorrer atrasos
          por parte das transportadoras. Faremos o possível para minimizar qualquer impacto e
          manteremos você informado.
        </p>
        <p>
          Caso haja qualquer problema com sua entrega, entre em contato com nosso suporte:{' '}
          <a
            href="mailto:contato@meninadourada.shop"
            style={{ color: 'var(--cta-gold-end)', fontWeight: 600 }}
          >
            contato@meninadourada.shop
          </a>
        </p>
      </div>

      <div className="inst-section">
        <h2>📦 Embalagem</h2>
        <p>
          Todos os pedidos são enviados com <strong>embalagem segura e lacrada</strong>, garantindo
          a integridade dos produtos durante o transporte.
        </p>
        <div className="inst-highlight inst-highlight-danger">
          <p>
            <strong>Importante:</strong> caso a embalagem esteja violada no momento da entrega,
            recuse o recebimento e entre em contato conosco imediatamente.
          </p>
        </div>
      </div>

      <div className="inst-section">
        <h2>Precisa de ajuda?</h2>
        <div className="inst-contact-grid">
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
          <a
            href="mailto:contato@meninadourada.shop"
            className="inst-contact-card email"
          >
            <span className="inst-contact-icon">✉️</span>
            <strong>E-mail</strong>
            <span>contato@meninadourada.shop</span>
          </a>
        </div>
      </div>

      <Link to="/produtos" className="inst-back">← Voltar para a loja</Link>
    </div>
  </>
);

export default PoliticaFretePage;
