import React from 'react';
// CORREÇÃO AQUI: O caminho agora é './NewsletterForm/NewsletterForm'
import NewsletterForm from './NewsletterForm'; // <<<< Caminho corrigido

const NewsletterSection = () => {
    return (
        <section className="newsletter-section">
            <div className="container mx-auto px-4">
                

                {/* Substitui o formulário existente pelo nosso novo componente */}
                <NewsletterForm />

            </div>
        </section>
    );
};

export default NewsletterSection;