import React from 'react';
import '../styles/ContactSection.css';

function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <h2>Entre em Contato</h2>
        <form className="contact-form">
          <input type="text" placeholder="Seu nome" required />
          <input type="email" placeholder="Seu e-mail" required />
          <select required>
            <option value="">Selecione um assunto</option>
            <option>Dúvidas</option>
            <option>Trocas e devoluções</option>
            <option>Parcerias</option>
            <option>Outros</option>
          </select>
          <textarea placeholder="Sua mensagem" rows="5" required />
          <button type="submit">Enviar</button>
        </form>
        <p className="contact-info">Ou fale com a gente no WhatsApp: <strong>(11) 98765-4321</strong></p>
      </div>
    </section>
  );
}

export default ContactSection;
