import { useState, useCallback, useRef } from 'react';

const FRETE_API_URL = 'https://api.meninadourada.shop/frete/calcular';

// Tipos de serviço aceitos
const SERVICOS_ACEITOS = ['PAC', 'SEDEX', 'Jadlog'];

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Normaliza CEP removendo não-dígitos
 * @param {string} cep 
 * @returns {string} CEP com 8 dígitos ou string vazia se inválido
 */
const normalizeCep = (cep) => {
  if (!cep) return '';
  const digits = cep.toString().replace(/\D/g, '');
  return digits.length === 8 ? digits : '';
};

/**
 * Formata prazo de entrega para exibição
 * @param {object} param0 - { delivery_range, delivery_time }
 * @returns {string} Label formatado ex: "4-5 dias" ou "3 dias"
 */
const formatPrazo = ({ delivery_range, delivery_time }) => {
  if (delivery_range?.min && delivery_range?.max) {
    if (delivery_range.min === delivery_range.max) {
      return `${delivery_range.min} ${delivery_range.min === 1 ? 'dia útil' : 'dias úteis'}`;
    }
    return `${delivery_range.min}-${delivery_range.max} dias úteis`;
  }
  if (delivery_time) {
    return `${delivery_time} ${delivery_time === 1 ? 'dia útil' : 'dias úteis'}`;
  }
  return 'Consultar prazo';
};

/**
 * Converte valor para número de forma segura
 * @param {any} value 
 * @returns {number}
 */
const toNumber = (value) => {
  if (typeof value === 'number' && !isNaN(value)) return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Deduplica opções Jadlog escolhendo menor preço (empate: menor prazo)
 * @param {Array} jadlogOptions 
 * @returns {object|null}
 */
const deduplicateJadlog = (jadlogOptions) => {
  if (!jadlogOptions || jadlogOptions.length === 0) return null;
  if (jadlogOptions.length === 1) return jadlogOptions[0];
  
  return jadlogOptions.reduce((best, current) => {
    const bestPrice = toNumber(best.price);
    const currentPrice = toNumber(current.price);
    
    if (currentPrice < bestPrice) return current;
    if (currentPrice === bestPrice) {
      const bestMax = best.delivery_range?.max || best.delivery_time || 999;
      const currentMax = current.delivery_range?.max || current.delivery_time || 999;
      if (currentMax < bestMax) return current;
    }
    return best;
  });
};

/**
 * Normaliza serviços de uma única origem (shipments[0].services)
 * @param {Array} services 
 * @returns {Array<ShippingOption>}
 */
const normalizeFromShipments = (services) => {
  if (!services || !Array.isArray(services)) return [];
  
  // Filtra apenas serviços aceitos
  const filtered = services.filter(s => 
    SERVICOS_ACEITOS.some(accepted => 
      s.service?.toUpperCase() === accepted.toUpperCase() ||
      s.name?.toUpperCase() === accepted.toUpperCase()
    )
  );
  
  // Agrupa por tipo de serviço
  const grouped = {
    PAC: [],
    SEDEX: [],
    Jadlog: [],
  };
  
  filtered.forEach(s => {
    const serviceName = (s.service || s.name || '').toUpperCase();
    if (serviceName.includes('PAC')) grouped.PAC.push(s);
    else if (serviceName.includes('SEDEX')) grouped.SEDEX.push(s);
    else if (serviceName.includes('JADLOG')) grouped.Jadlog.push(s);
  });
  
  const result = [];
  
  // PAC - pega o primeiro (geralmente só tem um)
  if (grouped.PAC.length > 0) {
    const pac = grouped.PAC[0];
    result.push({
      key: 'PAC',
      price: toNumber(pac.price),
      currency: pac.currency || 'BRL',
      prazoLabel: formatPrazo(pac),
      picture: pac.picture || pac.company?.picture || null,
      delivery_range: pac.delivery_range,
      delivery_time: pac.delivery_time,
      company: pac.company?.name || 'Correios',
      meta: null,
    });
  }
  
  // SEDEX - pega o primeiro
  if (grouped.SEDEX.length > 0) {
    const sedex = grouped.SEDEX[0];
    result.push({
      key: 'SEDEX',
      price: toNumber(sedex.price),
      currency: sedex.currency || 'BRL',
      prazoLabel: formatPrazo(sedex),
      picture: sedex.picture || sedex.company?.picture || null,
      delivery_range: sedex.delivery_range,
      delivery_time: sedex.delivery_time,
      company: sedex.company?.name || 'Correios',
      meta: null,
    });
  }
  
  // Jadlog - deduplica
  if (grouped.Jadlog.length > 0) {
    const jadlog = deduplicateJadlog(grouped.Jadlog);
    if (jadlog) {
      result.push({
        key: 'Jadlog',
        price: toNumber(jadlog.price),
        currency: jadlog.currency || 'BRL',
        prazoLabel: formatPrazo(jadlog),
        picture: jadlog.picture || jadlog.company?.picture || null,
        delivery_range: jadlog.delivery_range,
        delivery_time: jadlog.delivery_time,
        company: jadlog.company?.name || 'Jadlog',
        meta: null,
      });
    }
  }
  
  return result;
};

/**
 * Normaliza serviços de múltiplas origens usando combined
 * @param {object} combined - { PAC, SEDEX, Jadlog }
 * @returns {Array<ShippingOption>}
 */
const normalizeFromCombined = (combined) => {
  if (!combined) return [];
  
  const result = [];
  
  ['PAC', 'SEDEX', 'Jadlog'].forEach(key => {
    const data = combined[key];
    if (data && data.total_price !== undefined) {
      result.push({
        key,
        price: toNumber(data.total_price),
        currency: 'BRL',
        prazoLabel: formatPrazo({ delivery_range: data.delivery_range }),
        picture: null, // Combined não tem picture individual
        delivery_range: data.delivery_range,
        delivery_time: data.delivery_range?.max || null,
        company: key === 'Jadlog' ? 'Jadlog' : 'Correios',
        meta: {
          parts: data.parts,
          origins: Object.keys(data.parts || {}),
        },
      });
    }
  });
  
  return result;
};

// ============================================
// HOOK PRINCIPAL
// ============================================

const useFreteCalculator = () => {
  const [freteState, setFreteState] = useState({
    cepDestino: '',
    servicoSelecionado: null, // 'PAC' | 'SEDEX' | 'Jadlog' | null
    freteValor: null,
    prazoLabel: '',
    prazoMin: null,
    prazoMax: null,
    status: 'idle', // idle | loading | success | error
    errorMessage: '',
    opcoesFrete: [], // Array<ShippingOption>
    shipmentsInfo: null, // "2 pacotes (GO + RJ)" quando múltiplas origens
  });

  const abortControllerRef = useRef(null);

  /**
   * Seleciona um serviço de frete
   */
  const setServico = useCallback((servicoKey) => {
    setFreteState(prev => {
      const opcao = prev.opcoesFrete.find(op => op.key === servicoKey);
      if (!opcao) return prev;
      
      return {
        ...prev,
        servicoSelecionado: servicoKey,
        freteValor: opcao.price,
        prazoLabel: opcao.prazoLabel,
        prazoMin: opcao.delivery_range?.min || opcao.delivery_time,
        prazoMax: opcao.delivery_range?.max || opcao.delivery_time,
      };
    });
  }, []);

  /**
   * Atualiza CEP de destino
   */
  const setCepDestino = useCallback((cep) => {
    const normalized = normalizeCep(cep);
    setFreteState(prev => ({ ...prev, cepDestino: normalized || cep.replace(/\D/g, '') }));
  }, []);

  /**
   * Constrói payload de items para a API
   * @param {Array} cart - Itens do carrinho
   * @returns {Array}
   */
  const buildItemsPayload = useCallback((cart) => {
    if (!cart || cart.length === 0) return [];
    
    return cart.map(item => {
      const variacao = item.variacoes?.[0] || item;
      const qty = parseInt(item.quantity) || 1;
      const peso = toNumber(variacao.peso || item.peso || 0.3);
      const dimensoes = variacao.dimensoes || item.dimensoes || { altura: 4, largura: 12, comprimento: 17 };
      
      return {
        ufCadastro: item.ufCadastro || variacao.ufCadastro || 'GO',
        peso: peso * qty, // Multiplica peso pela quantidade
        dimensoes: {
          altura: toNumber(dimensoes.altura) || 4,
          largura: toNumber(dimensoes.largura) || 12,
          comprimento: toNumber(dimensoes.comprimento) || 17,
        },
      };
    });
  }, []);

  /**
   * Calcula frete chamando a API Lambda
   * @param {string} cepDestino 
   * @param {Array} cart - Itens do carrinho
   */
  const calcularFrete = useCallback(async (cepDestino, cart) => {
    const cep = normalizeCep(cepDestino);
    
    if (!cep || cep.length !== 8) {
      setFreteState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'CEP inválido. Digite 8 dígitos.',
      }));
      return;
    }

    // Constrói items do payload
    const items = buildItemsPayload(cart);
    
    if (items.length === 0) {
      setFreteState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Carrinho vazio.',
      }));
      return;
    }

    // Cancela requisição anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setFreteState(prev => ({
      ...prev,
      cepDestino: cep,
      status: 'loading',
      errorMessage: '',
      opcoesFrete: [],
      shipmentsInfo: null,
    }));

    try {
      const response = await fetch(FRETE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          cepDestino: cep,
          items,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }

      const data = await response.json();
      
      let opcoes = [];
      let shipmentsInfo = null;

      // Verifica se tem múltiplas origens
      if (data.shipments?.length === 2 && data.combined) {
        // Múltiplas origens - usa combined
        opcoes = normalizeFromCombined(data.combined);
        const ufs = data.shipments.map(s => s.originUF).join(' + ');
        shipmentsInfo = `Chega em 2 pacotes (${ufs})`;
      } else if (data.shipments?.length >= 1) {
        // Uma origem - usa services do primeiro shipment
        opcoes = normalizeFromShipments(data.shipments[0].services);
      }

      if (opcoes.length === 0) {
        setFreteState(prev => ({
          ...prev,
          status: 'error',
          errorMessage: 'Nenhuma opção de frete disponível para este CEP.',
          freteValor: null,
          prazoLabel: '',
          prazoMin: null,
          prazoMax: null,
          opcoesFrete: [],
          shipmentsInfo: null,
        }));
        return;
      }

      // Seleciona PAC por padrão, ou o mais barato se PAC não existir
      const pacOption = opcoes.find(op => op.key === 'PAC');
      const defaultOption = pacOption || opcoes.reduce((min, op) => 
        op.price < min.price ? op : min, opcoes[0]
      );

      setFreteState(prev => ({
        ...prev,
        cepDestino: cep,
        status: 'success',
        errorMessage: '',
        opcoesFrete: opcoes,
        servicoSelecionado: defaultOption.key,
        freteValor: defaultOption.price,
        prazoLabel: defaultOption.prazoLabel,
        prazoMin: defaultOption.delivery_range?.min || defaultOption.delivery_time,
        prazoMax: defaultOption.delivery_range?.max || defaultOption.delivery_time,
        shipmentsInfo,
      }));

    } catch (error) {
      if (error.name === 'AbortError') return;

      console.error('Erro ao calcular frete:', error);
      
      setFreteState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: error.message || 'Erro ao calcular frete. Tente novamente.',
        freteValor: null,
        prazoLabel: '',
        prazoMin: null,
        prazoMax: null,
        opcoesFrete: [],
        shipmentsInfo: null,
      }));
    }
  }, [buildItemsPayload]);

  /**
   * Reseta estado do frete
   */
  const resetFrete = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFreteState({
      cepDestino: '',
      servicoSelecionado: null,
      freteValor: null,
      prazoLabel: '',
      prazoMin: null,
      prazoMax: null,
      status: 'idle',
      errorMessage: '',
      opcoesFrete: [],
      shipmentsInfo: null,
    });
  }, []);

  return {
    ...freteState,
    setServico,
    setCepDestino,
    calcularFrete,
    resetFrete,
  };
};

export default useFreteCalculator;
