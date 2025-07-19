import React from 'react';
import '../styles/ProductGrid.css';
import products from '../data/products';



const ProductGrid = ({ addToCart }) => {
  return (
    <section id="produtos" className="product-grid-section">
      <h2>Nossa Coleção</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} loading="lazy" />
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            <button onClick={() => addToCart(product)}>Adicionar ao carrinho</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
