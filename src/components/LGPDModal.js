import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LGPDModal.css';

const LGPDModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Verifica se o usuário já aceitou os termos
        const lgpdAccepted = localStorage.getItem('lgpd-accepted');
        
        if (!lgpdAccepted) {
            // Mostra o modal após um pequeno delay para melhor UX
            setTimeout(() => {
                setIsVisible(true);
            }, 1500);
        }
    }, []);

    const handleAccept = () => {
        setIsClosing(true);
        
        // Aguarda a animação de saída antes de remover
        setTimeout(() => {
            localStorage.setItem('lgpd-accepted', 'true');
            setIsVisible(false);
        }, 400);
    };

    if (!isVisible) return null;

    return (
        <div className={`lgpd-overlay-minimal ${isClosing ? 'fade-out' : ''}`}>
            <div className="lgpd-banner-minimal">
                <div className="lgpd-content-minimal">
                    <p className="lgpd-text-minimal">
                        Utilizamos cookies para melhorar sua experiência. Ao continuar, você aceita nossa{' '}
                        <Link to="/privacidade" className="lgpd-link">Política de Privacidade</Link>.
                    </p>
                    <button 
                        className="lgpd-accept-minimal"
                        onClick={handleAccept}
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LGPDModal;