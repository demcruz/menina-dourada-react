import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <>
    <Helmet>
      <title>Página não encontrada | Menina Dourada</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="description" content="" />
    </Helmet>
    <div style={{
      padding: '4rem 1rem',
      textAlign: 'center',
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    }}>
      <h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.1rem', color: '#666' }}>
        Essa página não existe ou foi removida.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          backgroundColor: '#c8956c',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Voltar para a loja
      </Link>
    </div>
  </>
);

export default NotFoundPage;
