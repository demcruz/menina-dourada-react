import React from 'react';
import { Link } from 'react-router-dom';
import AdvancedSEO from '../seo/AdvancedSEO';
import { webPageSchema } from '../seo/schema';
import { BUSINESS } from '../config/business';
import '../styles/InstitucionalPage.css';

const TermosPage = () => (
  <>
    <AdvancedSEO
      title="Termos de Uso | Menina Dourada"
      description="Termos e condições de uso da loja Menina Dourada. Regras de compra, pagamento, entrega e responsabilidades."
      url="https://meninadourada.shop/termos"
      canonical="https://meninadourada.shop/termos"
      jsonLd={webPageSchema('Termos de Uso', 'https://meninadourada.shop/termos')}
    />

    <div className="inst-page">
      <div className="inst-hero">
        <span className="inst-hero-icon">📋</span>
        <h1>Termos de Uso</h1>
        <p>Última atualização: abril de 2026</p>
      </div>

      <div className="inst-section">
        <h2>1. Identificação</h2>
        <p>
          Este site é operado por <strong>{BUSINESS.legalName}</strong>, CNPJ{' '}
          <strong>{BUSINESS.cnpj}</strong>, com sede em <strong>{BUSINESS.location}</strong>,
          doravante denominada <strong>Menina Dourada</strong>.
        </p>
        <p>
          Ao acessar e utilizar o site <strong>meninadourada.shop</strong>, você concorda com
          estes Termos de Uso. Caso não concorde, não utilize o site.
        </p>
      </div>

      <div className="inst-section">
        <h2>2. Uso do site</h2>
        <ul>
          <li>O site destina-se exclusivamente à venda de produtos de moda praia feminina</li>
          <li>É proibido o uso do site para fins ilegais ou que violem direitos de terceiros</li>
          <li>Você é responsável pela veracidade das informações fornecidas no cadastro e checkout</li>
          <li>O acesso ao site pode ser suspenso em caso de uso indevido</li>
        </ul>
      </div>

      <div className="inst-section">
        <h2>3. Compras e pedidos</h2>
        <ul>
          <li>Os preços exibidos são em Reais (BRL) e incluem impostos aplicáveis</li>
          <li>O frete é calculado no checkout com base no CEP de entrega</li>
          <li>
            Frete grátis para compras acima de{' '}
            <strong>R$ {BUSINESS.freeShipping.toFixed(2).replace('.', ',')}</strong>
          </li>
          <li>O pedido é confirmado após a aprovação do pagamento</li>
          <li>Nos reservamos o direito de cancelar pedidos com suspeita de fraude</li>
          <li>Imagens dos produtos são meramente ilustrativas; cores podem variar conforme o monitor</li>
        </ul>
      </div>

      <div className="inst-section">
        <h2>4. Pagamentos</h2>
        <ul>
          <li>Aceitamos pagamento via <strong>PIX</strong> e <strong>cartão de crédito</strong></li>
          <li>Pagamentos são processados pela plataforma Asaas, certificada PCI DSS</li>
          <li>Não armazenamos dados de cartão de crédito em nossos servidores</li>
          <li>O prazo de validade do QR Code PIX é de 24 horas após a geração</li>
          <li>Em caso de pagamento não confirmado, o pedido é automaticamente cancelado</li>
        </ul>
      </div>

      <div className="inst-section">
        <h2>5. Entrega</h2>
        <ul>
          <li>Prazo de processamento: até 3 dias úteis após confirmação do pagamento</li>
          <li>Prazos de entrega variam conforme modalidade e região (ver Política de Frete)</li>
          <li>O código de rastreio é enviado por e-mail após o despacho</li>
          <li>Não nos responsabilizamos por atrasos causados por transportadoras ou eventos de força maior</li>
        </ul>
      </div>

      <div className="inst-section">
        <h2>6. Trocas e devoluções</h2>
        <p>
          Conforme o Código de Defesa do Consumidor (Lei 8.078/1990), você tem direito a:
        </p>
        <ul>
          <li>Devolução em até <strong>{BUSINESS.returnDays} dias corridos</strong> após o recebimento</li>
          <li>Troca em até <strong>{BUSINESS.exchangeDays} dias corridos</strong> após o recebimento</li>
        </ul>
        <p>
          Consulte nossa{' '}
          <Link to="/trocas-e-devolucoes" style={{ color: 'var(--cta-gold-end)', fontWeight: 600 }}>
            Política de Trocas e Devoluções
          </Link>{' '}
          para detalhes completos.
        </p>
      </div>

      <div className="inst-section">
        <h2>7. Propriedade intelectual</h2>
        <p>
          Todo o conteúdo do site (textos, imagens, logotipos, design) é de propriedade exclusiva
          da Menina Dourada ou licenciado para uso. É proibida a reprodução sem autorização prévia
          por escrito.
        </p>
      </div>

      <div className="inst-section">
        <h2>8. Limitação de responsabilidade</h2>
        <p>
          A Menina Dourada não se responsabiliza por danos indiretos decorrentes do uso do site,
          interrupções de serviço por manutenção ou falhas de terceiros (provedores de internet,
          transportadoras, processadores de pagamento).
        </p>
      </div>

      <div className="inst-section">
        <h2>9. Legislação aplicável</h2>
        <p>
          Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca do
          Rio de Janeiro – RJ para dirimir quaisquer controvérsias.
        </p>
      </div>

      <div className="inst-section">
        <h2>10. Contato</h2>
        <div className="inst-contact-grid">
          <a href={`mailto:${BUSINESS.email}`} className="inst-contact-card email">
            <span className="inst-contact-icon">✉️</span>
            <strong>E-mail</strong>
            <span>{BUSINESS.email}</span>
          </a>
          <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer" className="inst-contact-card whatsapp">
            <span className="inst-contact-icon">💬</span>
            <strong>WhatsApp</strong>
            <span>{BUSINESS.phone}</span>
          </a>
        </div>
      </div>

      <Link to="/produtos" className="inst-back">← Voltar para a loja</Link>
    </div>
  </>
);

export default TermosPage;
