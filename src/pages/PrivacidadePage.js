import React from 'react';
import { Link } from 'react-router-dom';
import AdvancedSEO from '../seo/AdvancedSEO';
import { webPageSchema } from '../seo/schema';
import { BUSINESS } from '../config/business';
import '../styles/InstitucionalPage.css';

const PrivacidadePage = () => (
  <>
    <AdvancedSEO
      title="Política de Privacidade | Menina Dourada"
      description="Saiba como a Menina Dourada coleta, usa e protege seus dados pessoais conforme a LGPD (Lei 13.709/2018)."
      url="https://meninadourada.shop/privacidade"
      canonical="https://meninadourada.shop/privacidade"
      jsonLd={webPageSchema('Política de Privacidade', 'https://meninadourada.shop/privacidade')}
    />

    <div className="inst-page">
      <div className="inst-hero">
        <span className="inst-hero-icon">🔒</span>
        <h1>Política de Privacidade</h1>
        <p>Última atualização: abril de 2026</p>
      </div>

      <div className="inst-section">
        <h2>1. Quem somos</h2>
        <p>
          <strong>{BUSINESS.legalName}</strong>, inscrita no CNPJ sob o nº <strong>{BUSINESS.cnpj}</strong>,
          com sede em <strong>{BUSINESS.location}</strong>, operando sob o nome fantasia{' '}
          <strong>{BUSINESS.tradeName}</strong> e domínio <strong>meninadourada.shop</strong>.
        </p>
        <p>
          Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos
          seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD –
          Lei nº 13.709/2018).
        </p>
      </div>

      <div className="inst-section">
        <h2>2. Dados que coletamos</h2>
        <p>Coletamos os seguintes dados para processar seus pedidos e melhorar sua experiência:</p>
        <ul>
          <li><strong>Identificação:</strong> nome completo, CPF</li>
          <li><strong>Contato:</strong> e-mail, telefone/celular</li>
          <li><strong>Entrega:</strong> endereço completo (CEP, rua, número, bairro, cidade, estado)</li>
          <li><strong>Pagamento:</strong> dados de pagamento processados de forma segura via Asaas (não armazenamos dados de cartão)</li>
          <li><strong>Navegação:</strong> cookies de sessão, preferências e dados de analytics (Google Analytics)</li>
        </ul>
      </div>

      <div className="inst-section">
        <h2>3. Como usamos seus dados</h2>
        <ul>
          <li>Processar e entregar seus pedidos</li>
          <li>Enviar confirmações de compra e atualizações de entrega</li>
          <li>Calcular frete e prazo de entrega</li>
          <li>Responder dúvidas e solicitações de suporte</li>
          <li>Melhorar nossos produtos e serviços</li>
          <li>Cumprir obrigações legais e fiscais</li>
          <li>Enviar comunicações de marketing (somente com seu consentimento)</li>
        </ul>
      </div>

      <div className="inst-section">
        <h2>4. Compartilhamento de dados</h2>
        <p>Seus dados são compartilhados apenas com parceiros essenciais para a operação:</p>
        <ul>
          <li><strong>Processador de pagamentos:</strong> Asaas Gestão Financeira S.A. — para processar pagamentos via PIX e cartão</li>
          <li><strong>Transportadoras:</strong> Correios, Jadlog e parceiros logísticos — para entrega dos pedidos</li>
          <li><strong>Infraestrutura:</strong> Amazon Web Services (AWS) — armazenamento seguro de dados</li>
          <li><strong>Analytics:</strong> Google Analytics — dados anonimizados de navegação</li>
        </ul>
        <p>
          Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing
          sem seu consentimento explícito.
        </p>
      </div>

      <div className="inst-section">
        <h2>5. Cookies</h2>
        <p>Utilizamos cookies para:</p>
        <ul>
          <li><strong>Sessão:</strong> manter seu carrinho e preferências durante a navegação</li>
          <li><strong>Analytics:</strong> entender como os usuários navegam no site (Google Analytics)</li>
          <li><strong>Funcionalidade:</strong> lembrar suas preferências de consentimento (LGPD)</li>
        </ul>
        <p>
          Você pode gerenciar ou desativar cookies nas configurações do seu navegador. A desativação
          pode afetar algumas funcionalidades do site.
        </p>
      </div>

      <div className="inst-section">
        <h2>6. Segurança dos dados</h2>
        <p>
          Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
          autorizado, perda ou alteração:
        </p>
        <ul>
          <li>Comunicação criptografada via HTTPS/TLS</li>
          <li>Dados armazenados em servidores seguros na AWS (região sa-east-1)</li>
          <li>Acesso restrito aos dados por pessoal autorizado</li>
          <li>Dados de pagamento processados diretamente pelo Asaas (PCI DSS compliant)</li>
        </ul>
      </div>

      <div className="inst-section">
        <h2>7. Seus direitos (LGPD)</h2>
        <p>Conforme a LGPD, você tem direito a:</p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados</li>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
          <li>Revogar o consentimento a qualquer momento</li>
          <li>Solicitar a portabilidade dos dados</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato pelo e-mail{' '}
          <a href={`mailto:${BUSINESS.email}`} style={{ color: 'var(--cta-gold-end)', fontWeight: 600 }}>
            {BUSINESS.email}
          </a>.
        </p>
      </div>

      <div className="inst-section">
        <h2>8. Retenção de dados</h2>
        <p>
          Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta
          política e obrigações legais (ex: dados fiscais por 5 anos conforme legislação brasileira).
          Após esse período, os dados são excluídos ou anonimizados.
        </p>
      </div>

      <div className="inst-section">
        <h2>9. Contato — Encarregado de Dados (DPO)</h2>
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

      <div className="inst-section">
        <div className="inst-highlight">
          <p>
            Esta política pode ser atualizada periodicamente. Recomendamos revisá-la regularmente.
            Alterações significativas serão comunicadas por e-mail ou aviso no site.
          </p>
        </div>
      </div>

      <Link to="/produtos" className="inst-back">← Voltar para a loja</Link>
    </div>
  </>
);

export default PrivacidadePage;
