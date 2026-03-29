import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://meninadourada.shop';
const DEFAULT_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

const DEFAULT_META = {
  title: 'Menina Dourada Swim | Biquínis, Maiôs e Moda Praia',
  description:
    'Menina Dourada Swim é a loja oficial de moda praia feminina: biquínis, maiôs, cangas e acessórios. Envio para todo o Brasil e pagamento via PIX.',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
};

const ROUTE_META = {
  '/': {
    title: 'Menina Dourada Swim | Biquínis, Maiôs e Moda Praia',
    description:
      'Menina Dourada Swim é a loja oficial de moda praia feminina: biquínis, maiôs, cangas e acessórios. Envio para todo o Brasil e pagamento via PIX.',
  },
  '/loja': {
    title: 'Produtos | Menina Dourada',
    description:
      'Compre biquínis, maiôs, cangas e acessórios na Menina Dourada Swim. Entrega para todo o Brasil e pagamento via PIX.',
    canonical: `${SITE_URL}/produtos`,
    robots: 'noindex, follow',
  },
  '/shop': {
    title: 'Produtos | Menina Dourada',
    description:
      'Compre biquínis, maiôs, cangas e acessórios na Menina Dourada Swim. Entrega para todo o Brasil e pagamento via PIX.',
    canonical: `${SITE_URL}/produtos`,
    robots: 'noindex, follow',
  },
  '/produtos': {
    title: 'Produtos | Menina Dourada',
    description:
      'Compre biquínis, maiôs, cangas e acessórios na Menina Dourada Swim. Entrega para todo o Brasil e pagamento via PIX.',
  },
  '/sobre': {
    title: 'Sobre a Menina Dourada',
    description:
      'Conheça a história da Menina Dourada Swim e nosso compromisso com moda praia feminina de qualidade.',
  },
  '/about': {
    title: 'Sobre a Menina Dourada',
    description:
      'Conheça a história da Menina Dourada Swim e nosso compromisso com moda praia feminina de qualidade.',
    canonical: `${SITE_URL}/sobre`,
    robots: 'noindex, follow',
  },
  '/contato': {
    title: 'Contato | Menina Dourada Swim',
    description:
      'Fale com a equipe da Menina Dourada Swim por WhatsApp ou formulário de contato.',
  },
  '/contact': {
    title: 'Contato | Menina Dourada Swim',
    description:
      'Fale com a equipe da Menina Dourada Swim por WhatsApp ou formulário de contato.',
    canonical: `${SITE_URL}/contato`,
    robots: 'noindex, follow',
  },
  '/checkout': {
    title: 'Checkout seguro | Menina Dourada Swim',
    description: 'Finalize seu pedido com segurança e pagamento via PIX.',
    robots: 'noindex, nofollow',
  },
  '/checkout/success': {
    title: 'Pedido confirmado | Menina Dourada Swim',
    description: 'Seu pagamento foi aprovado. Em breve você receberá novidades sobre o envio.',
    robots: 'noindex, nofollow',
  },
  '/checkout/failure': {
    title: 'Pagamento pendente | Menina Dourada Swim',
    description: 'Estamos aguardando a confirmação do pagamento do seu pedido.',
    robots: 'noindex, nofollow',
  },
  '/checkout/rejected': {
    title: 'Pagamento recusado | Menina Dourada Swim',
    description: 'Seu pagamento não foi aprovado. Tente novamente ou fale conosco.',
    robots: 'noindex, nofollow',
  },
};

const normalizePathname = (pathname) => {
  if (!pathname) return '/';
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
};

const ensureMeta = (attributes) => {
  const selector = attributes.name
    ? `meta[name="${attributes.name}"]`
    : `meta[property="${attributes.property}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) element.setAttribute(key, value);
  });
};

const ensureLink = (attributes) => {
  const selectorParts = [];
  if (attributes.rel) selectorParts.push(`rel="${attributes.rel}"`);
  if (attributes.hreflang) selectorParts.push(`hreflang="${attributes.hreflang}"`);
  const selector = selectorParts.length
    ? `link[${selectorParts.join('][')}]`
    : 'link';

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) element.setAttribute(key, value);
  });
};

const SEO = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = normalizePathname(pathname);
    const routeMeta = ROUTE_META[normalizedPath];
    const isKnownRoute = Boolean(routeMeta);

    const fallbackMeta = isKnownRoute
      ? {}
      : {
          title: 'Página não encontrada | Menina Dourada Swim',
          description: 'A página solicitada não foi encontrada.',
          robots: 'noindex, follow',
        };

    const meta = {
      ...DEFAULT_META,
      ...fallbackMeta,
      ...routeMeta,
    };

    const canonical =
      meta.canonical || `${SITE_URL}${normalizedPath === '/' ? '/' : normalizedPath}`;

    document.title = meta.title;

    ensureMeta({ name: 'description', content: meta.description });
    ensureMeta({ name: 'robots', content: meta.robots });

    ensureMeta({ property: 'og:title', content: meta.title });
    ensureMeta({ property: 'og:description', content: meta.description });
    ensureMeta({ property: 'og:url', content: canonical });
    ensureMeta({ property: 'og:image', content: DEFAULT_IMAGE });

    ensureMeta({ name: 'twitter:title', content: meta.title });
    ensureMeta({ name: 'twitter:description', content: meta.description });
    ensureMeta({ name: 'twitter:image', content: DEFAULT_IMAGE });

    ensureLink({ rel: 'canonical', href: canonical });
    ensureLink({ rel: 'alternate', hreflang: 'pt-BR', href: canonical });
  }, [pathname]);

  return null;
};

export default SEO;
