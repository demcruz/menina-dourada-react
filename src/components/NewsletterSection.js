import React from 'react';

const NewsletterSection = () => {
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Newsletter subscribed!');
        alert('Obrigado por assinar nossa newsletter!');
        e.target.reset(); 
    };

    return (
        <section className="newsletter-section"> 
            <div className="container mx-auto px-4">
                <h2 className="newsletter-title">Receba ofertas exclusivas</h2> 
                <p className="newsletter-subtitle">Assine nossa newsletter e seja a primeira a saber sobre lançamentos, promoções e novidades.</p> 

                <form className="newsletter-form" onSubmit={handleSubmit}> 
                    <input
                        type="email"
                        placeholder="Seu melhor e-mail"
                        className="newsletter-input" 
                        required
                    />
                    <button type="submit" className="newsletter-button"> 
                        Assinar
                    </button>
                </form>
            </div>
        </section>
    );
};

export default NewsletterSection;