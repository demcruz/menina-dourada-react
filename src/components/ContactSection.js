// src/components/ContactSection.js
import React from 'react';

const ContactSection = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Mensagem enviada! Em breve entraremos em contato.');
        e.target.reset();
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container mx-auto px-4">
                <h2 className="section-title">Entre em Contato</h2>

                <div className="contact-content-wrapper md:flex-row">
                    {/* Coluna do Formulário (Permanece a mesma) */}
                    <div className="contact-form-area md:w-1/2 md:pr-8">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="form-field-label">Nome</label>
                                <input type="text" id="name" name="name" className="w-full" required />
                            </div>

                            <div>
                                <label htmlFor="email" className="form-field-label">E-mail</label>
                                <input type="email" id="email" name="email" className="w-full" required />
                            </div>

                            <div>
                                <label htmlFor="subject" className="form-field-label">Assunto</label>
                                <select id="subject" name="subject" className="w-full">
                                    <option value="">Selecione um assunto</option>
                                    <option value="duvidas">Dúvidas sobre produtos</option>
                                    <option value="trocas">Trocas e devoluções</option>
                                    <option value="parcerias">Parcerias</option>
                                    <option value="outros">Outros</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="form-field-label">Mensagem</label>
                                <textarea id="message" name="message" rows="4" className="w-full" required></textarea>
                            </div>

                            <button type="submit" className="contact-submit-button">
                                Enviar mensagem
                            </button>
                        </form>
                    </div>

                    {/* Esta div será removida ou substituída por outros elementos se você quiser adicionar algo aqui */}
                    {/* Por enquanto, para focar no formulário, podemos até removê-la e fazer a coluna do formulário ocupar 100% em desktop. */}
                    {/* Se você quiser manter 2 colunas e adicionar outra coisa aqui, me avise. */}
                    {/* Por simplicidade, vamos deixar o formulário ocupar as duas colunas em desktop por agora. */}
                    {/* OU, se você quiser manter o layout de 2 colunas, podemos adicionar a informação do WhatsApp solta aqui, por exemplo: */}
                    <div className="md:w-1/2 md:pl-8 flex flex-col items-center justify-center text-center">
                        <h3 className="contact-info-title">Ou fale com a gente!</h3>
                        <i className="fab fa-whatsapp text-gold-600 text-6xl mb-4"></i>
                        <p className="text-xl font-bold mb-2">(21) 998043354</p>
                        <a href="https://wa.me/5511987654321" className="contact-whatsapp-link text-lg">Enviar mensagem pelo WhatsApp</a>
                    </div>
                    {/* Decida se quer a versão acima (Whatsapp extra) ou só o formulário ocupando tudo */}
                    {/* Para este exemplo, vou mantar o layout de 2 colunas com o WhatsApp. */}
                </div>
            </div>
        </section>
    );
};

export default ContactSection;