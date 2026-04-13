import React from 'react';
import '../styles/AboutPage.css';
import AdvancedSEO from '../seo/AdvancedSEO';
import { organizationSchema, breadcrumbSchema } from '../seo/schema';
import { BUSINESS } from '../config/business';

const AboutPage = () => {
  return (
    <div className="about-page">
      <AdvancedSEO
        title="Sobre a Menina Dourada | Moda Praia Feminina"
        description="Conheça a história da Menina Dourada, marca brasileira de moda praia feminina. Biquínis, maiôs, cangas e acessórios com entrega para todo o Brasil."
        url="https://meninadourada.shop/sobre"
        canonical="https://meninadourada.shop/sobre"
        jsonLd={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", url: "https://meninadourada.shop/" },
            { name: "Sobre", url: "https://meninadourada.shop/sobre" },
          ]),
        ]}
      />
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">Sobre a Menina Dourada</h1>
          <p className="about-subtitle">
            Uma marca brasileira que celebra a beleza natural e empodera mulheres através da moda praia
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="about-container">
        
        {/* História da Marca */}
        <section className="about-section">
          <h2 className="section-title">Nossa História</h2>
          <div className="section-content">
            <p>
              A <strong>Menina Dourada</strong> nasceu da paixão pelo verão brasileiro e pela valorização da beleza natural feminina. 
              Fundada com o propósito de criar peças únicas que destacam a personalidade de cada mulher, nossa marca se 
              consolidou como referência em moda praia no Brasil.
            </p>
            <p>
              Desde o início, acreditamos que cada mulher possui sua própria luz dourada - aquela confiança especial que 
              brilha quando ela se sente verdadeiramente bem consigo mesma. É essa essência que buscamos capturar em 
              cada criação.
            </p>
            <p>
              Nossa jornada começou com o sonho de democratizar a moda praia de qualidade, oferecendo peças que combinam 
              design exclusivo, conforto e preços acessíveis para mulheres de todo o Brasil.
            </p>
          </div>
        </section>

        {/* O que vendemos */}
        <section className="about-section">
          <h2 className="section-title">Nossos Produtos</h2>
          <div className="section-content">
            <p>
              A <strong>Menina Dourada</strong> é especializada em moda praia feminina, oferecendo uma linha completa de produtos:
            </p>
            <div className="products-grid">
              <div className="product-item">
                <h3>👙 Biquínis</h3>
                <p>Modelos exclusivos em diversos estilos: cortininha, tomara que caia, asa delta, ripple e muito mais. 
                Tamanhos do PP ao GG.</p>
              </div>
              <div className="product-item">
                <h3>🩱 Maiôs</h3>
                <p>Peças elegantes e confortáveis para quem busca sofisticação e praticidade na praia ou piscina.</p>
              </div>
              <div className="product-item">
                <h3>🏖️ Cangas e Saídas</h3>
                <p>Acessórios essenciais para completar o look praia com estilo e versatilidade.</p>
              </div>
              <div className="product-item">
                <h3>✨ Acessórios</h3>
                <p>Bolsas de praia, chapéus, óculos e outros itens para um visual completo e harmonioso.</p>
              </div>
            </div>
            <p>
              Todas as nossas peças são confeccionadas com tecidos de alta qualidade, resistentes ao cloro e água salgada, 
              garantindo durabilidade e conforto em todas as ocasiões.
            </p>
          </div>
        </section>

        {/* Onde atuamos */}
        <section className="about-section">
          <h2 className="section-title">Onde Atuamos</h2>
          <div className="section-content">
            <p>
              A <strong>Menina Dourada</strong> atende <strong>todo o território nacional</strong>, levando moda praia de qualidade 
              para mulheres de Norte a Sul do Brasil.
            </p>
            
            <div className="coverage-info">
              <div className="coverage-item">
                <h3>🚚 Entrega Nacional</h3>
                <p>Enviamos para todos os estados brasileiros através dos Correios (PAC e SEDEX) e transportadoras parceiras como Jadlog.</p>
              </div>
              
              <div className="coverage-item">
                <h3>📍 Principais Regiões</h3>
                <p>Atendemos com destaque as regiões:</p>
                <ul>
                  <li><strong>Sudeste:</strong> Rio de Janeiro, São Paulo, Minas Gerais, Espírito Santo</li>
                  <li><strong>Nordeste:</strong> Bahia, Pernambuco, Ceará, e demais estados</li>
                  <li><strong>Sul:</strong> Rio Grande do Sul, Santa Catarina, Paraná</li>
                  <li><strong>Centro-Oeste:</strong> Goiás, Mato Grosso, Brasília</li>
                  <li><strong>Norte:</strong> Amazonas, Pará, e demais estados</li>
                </ul>
              </div>
              
              <div className="coverage-item">
                <h3>⚡ Prazos de Entrega</h3>
                <p>Trabalhamos com diferentes modalidades para atender suas necessidades:</p>
                <ul>
                  <li><strong>SEDEX:</strong> 2-5 dias úteis (principais capitais)</li>
                  <li><strong>PAC:</strong> 5-10 dias úteis (mais econômico)</li>
                  <li><strong>Jadlog:</strong> 3-8 dias úteis (alternativa rápida)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contato */}
        <section className="about-section">
          <h2 className="section-title">Fale Conosco</h2>
          <div className="section-content">
            <p>
              Estamos sempre prontas para atender você! Nossa equipe está disponível para esclarecer dúvidas, 
              ajudar na escolha do tamanho ideal e acompanhar seu pedido.
            </p>
            
            <div className="contact-grid">
              <div className="contact-item">
                <h3>📱 WhatsApp</h3>
                <p><strong>(21) 99804-3352</strong></p>
                <p>Segunda a Sexta: 9h às 18h<br/>Sábado: 9h às 14h</p>
                <a 
                  href="https://wa.me/5521998043352?text=Olá! Gostaria de saber mais sobre os produtos da Menina Dourada" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-button"
                >
                  Falar no WhatsApp
                </a>
              </div>
              
              <div className="contact-item">
                <h3>📧 E-mail</h3>
                <p><strong>{BUSINESS.email}</strong></p>
                <p>Respondemos em até 24 horas</p>
              </div>
              
              <div className="contact-item">
                <h3>🌐 Site Oficial</h3>
                <p><strong>www.meninadourada.shop</strong></p>
                <p>Loja online segura com pagamento via PIX</p>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram */}
        <section className="about-section">
          <h2 className="section-title">Siga-nos no Instagram</h2>
          <div className="section-content">
            <div className="instagram-section">
              <div className="instagram-content">
                <h3>📸 @meninadouradaloja</h3>
                <p>
                  Acompanhe nosso Instagram para ver as novidades em primeira mão, dicas de styling, 
                  looks inspiradores e muito mais conteúdo exclusivo sobre moda praia.
                </p>
                <ul>
                  <li>✨ Lançamentos exclusivos</li>
                  <li>👙 Looks e combinações</li>
                  <li>📱 Stories com promoções</li>
                  <li>🌊 Inspirações de verão</li>
                  <li>💬 Atendimento direto via DM</li>
                </ul>
                <a 
                  href="https://www.instagram.com/meninadouradaloja/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="instagram-button"
                >
                  Seguir no Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Missão e Valores */}
        <section className="about-section">
          <h2 className="section-title">Nossa Missão</h2>
          <div className="section-content">
            <div className="mission-grid">
              <div className="mission-item">
                <h3>🎯 Missão</h3>
                <p>
                  Empoderar mulheres através da moda praia, oferecendo peças que destacam a beleza natural 
                  e promovem autoestima e confiança.
                </p>
              </div>
              <div className="mission-item">
                <h3>👁️ Visão</h3>
                <p>
                  Ser a marca de moda praia mais querida do Brasil, reconhecida pela qualidade, 
                  design exclusivo e atendimento excepcional.
                </p>
              </div>
              <div className="mission-item">
                <h3>💎 Valores</h3>
                <ul>
                  <li><strong>Qualidade:</strong> Produtos duráveis e confortáveis</li>
                  <li><strong>Inclusividade:</strong> Tamanhos para todos os corpos</li>
                  <li><strong>Autenticidade:</strong> Design brasileiro original</li>
                  <li><strong>Excelência:</strong> Atendimento personalizado</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Informações Legais */}
        <section className="about-section">
          <h2 className="section-title">Informações da Empresa</h2>
          <div className="section-content">
            <ul>
              <li><strong>Razão Social:</strong> {BUSINESS.legalName}</li>
              <li><strong>CNPJ:</strong> {BUSINESS.cnpj}</li>
              <li><strong>Localização:</strong> {BUSINESS.location}</li>
              <li><strong>E-mail:</strong> <a href={`mailto:${BUSINESS.email}`} style={{ color: 'var(--cta-gold-end)' }}>{BUSINESS.email}</a></li>
              <li><strong>WhatsApp:</strong> {BUSINESS.phone}</li>
              <li><strong>Horário de atendimento:</strong> {BUSINESS.supportHours}</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;