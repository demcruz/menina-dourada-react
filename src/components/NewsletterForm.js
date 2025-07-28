import React, { useState } from 'react';
import { subscribeToNewsletter } from '../api/axiosInstance'; // Importa a função do serviço
import './NewsletterForm.css'; // Estilos para o formulário

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Limpa mensagens anteriores
    setIsError(false); // Limpa status de erro
    setIsLoading(true); // Ativa o loading

    if (!email) {
      setMessage('Por favor, insira seu e-mail.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await subscribeToNewsletter(email);
      setMessage(response.message || 'Inscrição realizada com sucesso!');
      setIsError(false);
      setEmail(''); // Limpa o campo de e-mail após o sucesso
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao inscrever seu e-mail.';
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false); // Desativa o loading
    }
  };

  return (
    <div className="newsletter-container">
      <h3 className="newsletter-title">Receba nossas novidades!</h3>
      <p className="newsletter-subtitle">Inscreva-se para receber ofertas exclusivas e atualizações.</p>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
          className="newsletter-input"
          required
          disabled={isLoading}
        />
        <button type="submit" className="newsletter-button" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Inscrever'}
        </button>
      </form>
      {message && (
        <p className={`newsletter-message ${isError ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterForm;
