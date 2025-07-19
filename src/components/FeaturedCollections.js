// src/components/FeaturedCollections.js
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedCollections = () => {
  const collections = [
    {
      id: 1,
      name: 'Coleção Verão',
      // Novas URLs para garantir que funcionem
      image: 'https://picsum.photos/id/1018/1470/800', // Imagem de paisagem mais genérica
      link: '/shop?collection=verao',
    },
    {
      id: 2,
      name: 'Coleção Clássica',
      image: 'https://picsum.photos/id/1025/1470/800', // Outra imagem de paisagem
      link: '/shop?collection=classica',
    },
    {
      id: 3,
      name: 'Coleção Exclusiva',
      image: 'https://picsum.photos/id/1039/1470/800', // Mais uma imagem de paisagem
      link: '/shop?collection=exclusiva',
    },
  ];

  return (
    <section className="featured-collections-section">
      <div className="container">
        <h2 className="section-title">Nossas Coleções</h2>

        <div className="collections-grid md:grid-cols-3">
          {collections.map((collection) => (
            <Link to={collection.link} key={collection.id} className="collection-card">
              <div className="collection-card-image-wrapper">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="collection-image"
                  />
              </div>
              <div className="collection-overlay">
                <h3 className="collection-title-overlay">{collection.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;