// src/components/NewsletterSection.js
import React from 'react';

const NewsletterSection = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Adicione sua lógica de inscrição da newsletter aqui (ex: enviar para uma API)
        console.log('Newsletter subscribed!');
        alert('Obrigado por assinar nossa newsletter!');
        e.target.reset(); // Limpa o campo do e-mail
    };

    return (
        <section className="newsletter-section"> {/* Substituído: py-12 bg-gold-600 text-white */}
            <div className="container mx-auto px-4">
                <h2 className="newsletter-title">Receba ofertas exclusivas</h2> {/* Substituído: title-font text-3xl font-bold mb-4 */}
                <p className="newsletter-subtitle">Assine nossa newsletter e seja a primeira a saber sobre lançamentos, promoções e novidades.</p> {/* Substituído: mb-6 max-w-2xl mx-auto */}

                <form className="newsletter-form" onSubmit={handleSubmit}> {/* Substituído: max-w-md mx-auto flex */}
                    <input
                        type="email"
                        placeholder="Seu melhor e-mail"
                        className="newsletter-input" /* Substituído: flex-grow px-4 py-3 rounded-l focus:outline-none text-sand-800 */
                        required
                    />
                    <button type="submit" className="newsletter-button"> {/* Substituído: bg-sand-800 hover:bg-sand-900 px-6 py-3 rounded-r transition duration-300 */}
                        Assinar
                    </button>
                </form>
            </div>
        </section>
    );
};

export default NewsletterSection;