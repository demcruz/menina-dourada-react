import React, { useState } from 'react';
import { subscribeToNewsletter } from '../api/axiosInstance';
import './NewsletterForm.css';

const NewsletterForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    aceite: false
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    if (!formData.email || !formData.nome) {
      setMessage('Por favor, preencha todos os campos.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!formData.aceite) {
      setMessage('Por favor, aceite receber nossas comunicações.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await subscribeToNewsletter(formData.email);
      setMessage(response.message || 'Inscrição realizada com sucesso! 🎉');
      setIsError(false);
      setFormData({ nome: '', email: '', aceite: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao inscrever seu e-mail.';
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newsletter-wrapper">
      <div className="newsletter-container">
        <div className="newsletter-content">
          {/* Header */}
          <div className="newsletter-header">
            <h3 className="newsletter-title">Assine nossa Newsletter</h3>
            <p className="newsletter-subtitle">
              Receba Ofertas e Novidades por email
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="newsletter-input-row">
              <div className="newsletter-input-group">
                <span className="newsletter-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <span className="newsletter-input-divider"></span>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite seu Nome"
                  className="newsletter-input"
                  disabled={isLoading}
                />
              </div>
              
              <div className="newsletter-input-group">
                <span className="newsletter-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </span>
                <span className="newsletter-input-divider"></span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite seu E-mail"
                  className="newsletter-input"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <button type="submit" className="newsletter-button" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'CADASTRAR'}
              </button>
            </div>
            
            {/* Checkbox */}
            <div className="newsletter-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="aceite"
                  checked={formData.aceite}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="newsletter-checkbox-mark"></span>
                <span className="newsletter-checkbox-text">
                  Aceito receber informes publicitários e promoções através da newsletter de Menina Dourada
                </span>
              </label>
            </div>
          </form>
          
          {/* Message */}
          {message && (
            <p className={`newsletter-message ${isError ? 'error' : 'success'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterForm;
