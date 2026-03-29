import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL, createPaymentOrder } from '../api/axiosInstance';
import CustomerForm from '../components/checkout/CustomerForm';
import AddressForm from '../components/checkout/AddressForm';
import PixInfoCard from '../components/checkout/PixInfoCard';
import CheckoutTrustBlock from '../components/checkout/CheckoutTrustBlock';
import OrderSummary from '../components/checkout/OrderSummary';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import ShippingInfoCard from '../components/checkout/ShippingInfoCard';
import PixPaymentCard from '../components/checkout/PixPaymentCard';
import OrderItemsCard from '../components/checkout/OrderItemsCard';
import PixHowItWorks from '../components/checkout/PixHowItWorks';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import CreditCardPaymentForm from '../components/checkout/CreditCardPaymentForm';
import AdvancedSEO from '../seo/AdvancedSEO';
import useFreteCalculator from '../hooks/useFreteCalculator';
import { getThumbSrc } from '../utils/productImage';
import '../styles/Checkout.css';
import '../styles/PaymentMethod.css';
import '../styles/CreditCardForm.css';
import { trackEvent } from '../utils/analytics';

// Utility functions
const digitsOnly = (value = '') => (value ?? '').toString().replace(/\D/g, '');
const safeTrim = (value = '') => (value ?? '').toString().trim();
const getISODate = (date) => date.toISOString().split('T')[0];
const PIX_WS_URL = 'wss://05v2xyhlhc.execute-api.sa-east-1.amazonaws.com/prod';

const safeJsonParse = (value, fallback = null) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

const ensureDataUri = (value) => {
  if (!value || typeof value !== 'string') return value;
  return value.startsWith('data:') ? value : `data:image/png;base64,${value}`;
};

const isPaidWsEvent = (payload = {}) => {
  const type = (payload.type || payload.event || '').toString().toUpperCase();
  const status = (payload.status || payload.paymentStatus || '').toString().toUpperCase();
  if (['PAYMENT_PAID', 'PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED', 'PAYMENT_APPROVED'].includes(type)) return true;
  if (['PAID', 'RECEIVED', 'CONFIRMED'].includes(status)) return true;
  return false;
};

const normalizePixResponse = (rawResponse, fallbackPayment = {}) => {
  const envelope = safeJsonParse(rawResponse, rawResponse ?? {});
  const firstBody = safeJsonParse(envelope?.body, envelope);
  const finalPayload = safeJsonParse(firstBody?.body, firstBody) || {};
  const payment = finalPayload.payment?.raw || finalPayload.payment || firstBody?.payment?.raw || firstBody?.payment || envelope?.payment?.raw || envelope?.payment || fallbackPayment;
  const pixFromResponse = finalPayload.pixQrCode || payment?.pixQrCode || firstBody?.pixQrCode || envelope?.pixQrCode || null;
  const paymentId = payment?.id || finalPayload.paymentId || firstBody?.paymentId || envelope?.paymentId || '';
  const paymentValue = payment?.value ?? finalPayload.paymentValue ?? firstBody?.paymentValue ?? envelope?.paymentValue ?? fallbackPayment?.value ?? 0;
  const paymentDueDate = payment?.dueDate ?? finalPayload.dueDate ?? firstBody?.dueDate ?? envelope?.dueDate ?? fallbackPayment?.dueDate ?? '';
  const normalizedPix = pixFromResponse ? { ...pixFromResponse, encodedImage: pixFromResponse.encodedImage ? ensureDataUri(pixFromResponse.encodedImage) : undefined } : null;
  return { paymentId, paymentMeta: { value: paymentValue, dueDate: paymentDueDate }, pixQrCode: normalizedPix };
};

const formatCurrency = (value) => (parseFloat(value) || 0).toFixed(2).replace('.', ',');

// Credit card error code → user-friendly message
const CC_ERROR_MESSAGES = {
  denied_creditCard_transaction: 'Transação negada pela operadora. Tente outro cartão.',
  invalid_creditCard: 'Dados do cartão inválidos. Verifique número, validade e CVV.',
  invalid_creditCardHolderInfo: 'Dados do titular do cartão inválidos.',
  expired_creditCard: 'Cartão expirado.',
  insufficient_balance: 'Saldo insuficiente.',
  INVALID_CARD_DATA: 'Dados do cartão incompletos. Preencha todos os campos.',
  INVALID_HOLDER_INFO: 'Preencha nome e CPF do titular do cartão.',
  CREDIT_CARD_DISABLED: 'Pagamento com cartão não está disponível no momento.',
  CARD_TOKENIZATION_NOT_ENABLED: 'Tokenização de cartão não disponível.',
};

const getCreditCardErrorMessage = (errData) => {
  if (!errData) return 'Erro ao processar pagamento. Tente novamente.';
  const code = errData?.error?.code || errData?.code || '';
  if (CC_ERROR_MESSAGES[code]) return CC_ERROR_MESSAGES[code];
  const msg = errData?.error?.message || errData?.message || '';
  if (msg) return msg;
  return 'Erro ao processar pagamento com cartão. Tente novamente.';
};

// Normalize credit card response from backend
const normalizeCreditCardResponse = (rawResponse) => {
  const envelope = safeJsonParse(rawResponse, rawResponse ?? {});
  const firstBody = safeJsonParse(envelope?.body, envelope);
  const finalPayload = safeJsonParse(firstBody?.body, firstBody) || {};
  const payment = finalPayload.payment || firstBody?.payment || envelope?.payment || {};
  const paymentId = payment?.id || finalPayload.paymentId || firstBody?.paymentId || envelope?.paymentId || '';
  const status = (payment?.status || payment?.raw?.status || '').toUpperCase();
  const billingType = payment?.billingType || payment?.raw?.billingType || '';
  const creditCard = payment?.creditCard || payment?.raw?.creditCard || null;
  const value = payment?.value ?? payment?.raw?.value ?? 0;
  return { paymentId, status, billingType, creditCard, value };
};

// Checkout States
const CHECKOUT_STATES = {
  FILLING: 'filling',
  PAYMENT: 'payment',
  CONFIRMED: 'confirmed',
};

const CheckoutPage = ({ cart, emptyCart }) => {
  const navigate = useNavigate();
  
  // Checkout state
  const [checkoutState, setCheckoutState] = useState(CHECKOUT_STATES.FILLING);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', cpf: '', phone: '',
    zipCode: '', address: '', number: '', complement: '', neighborhood: '', city: '', state: '',
  });
  const [errors, setErrors] = useState({});
  
  // Payment state
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [paymentMeta, setPaymentMeta] = useState({ value: 0, dueDate: '' });
  const [pixQrCode, setPixQrCode] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('IDLE');

  // Payment method selection (PIX = default, preserves existing flow)
  const [paymentMethod, setPaymentMethod] = useState('PIX');

  // Credit card form ref (for triggering validation from parent)
  const ccFormRef = useRef(null);
  
  // Sistema de frete com API Lambda
  const freteCalculator = useFreteCalculator();
  const {
    freteValor,
    status: freteStatus,
    servicoSelecionado,
    cepDestino,
    prazoLabel,
    prazoMin,
    prazoMax,
    errorMessage: freteErrorMessage,
    opcoesFrete,
    shipmentsInfo,
    setServico,
    setCepDestino,
    calcularFrete,
  } = freteCalculator;

  // Confirmed data snapshots
  const [confirmedDeliveryInfo, setConfirmedDeliveryInfo] = useState(null);
  const [confirmedCartItems, setConfirmedCartItems] = useState([]);
  const [confirmedOrderTitle, setConfirmedOrderTitle] = useState('');
  const [confirmedShippingCost, setConfirmedShippingCost] = useState(0);
  
  // WebSocket refs
  const [wsRetryKey, setWsRetryKey] = useState(0);
  const [checkoutInitialized, setCheckoutInitialized] = useState(false);
  const wsRef = useRef(null);
  const wsConfirmedRef = useRef(false);

  const cleanupRealtime = useCallback(() => {
    if (wsRef.current) { try { wsRef.current.close(); } catch {} wsRef.current = null; }
    wsConfirmedRef.current = false;
  }, []);

  const subtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price) || parseFloat(item.variacoes?.[0]?.preco) || 0;
    return total + price * (parseInt(item.quantity) || 0);
  }, 0);

  const shippingCost = freteStatus === 'success' && freteValor !== null ? freteValor : 0;
  const totalWithShipping = subtotal + shippingCost;

  const totalQuantity = cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);

  const handleFreteServicoChange = useCallback((servico) => {
    setServico(servico);
  }, [setServico]);

  const handleFreteCepChange = useCallback((cep) => {
    setCepDestino(cep);
  }, [setCepDestino]);

  const handleCalcularFrete = useCallback((cep) => {
    setCepDestino(cep);
    if (cep && cep.length === 8) {
      const cepFormatado = `${cep.slice(0, 5)}-${cep.slice(5)}`;
      setFormData(prev => ({ ...prev, zipCode: cepFormatado }));
    }
    calcularFrete(cep, cart);
  }, [calcularFrete, cart, setCepDestino]);

  const handleShippingLoad = (options) => {
    // Shipping options loaded — no-op (avoid logging in production)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCepSearch = (addressData) => {
    setFormData(prev => ({ ...prev, ...addressData }));
  };

  const buildImageUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  };

  const snapshotCartItems = (items) => items.map((item) => {
    const unitPrice = parseFloat(item.price) || parseFloat(item.variacoes?.[0]?.preco) || 0;
    const rawImage = item.image || getThumbSrc(item.imagens?.[0] || item.variacoes?.[0]?.imagens?.[0]) || '';
    return { 
      id: item.cartItemId || item.id, 
      name: item.nome || item.name || 'Produto', 
      quantity: parseInt(item.quantity) || 0, 
      unitPrice, 
      image: buildImageUrl(rawImage) 
    };
  });

  const buildOrderTitle = () => {
    if (!cart.length) return 'Pedido Menina Dourada';
    const baseName = cart[0].nome || cart[0].name || 'Produto';
    const extraItems = cart.length - 1;
    return extraItems <= 0 ? baseName : `${baseName} e mais ${extraItems} item(s)`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'E-mail obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.firstName.trim()) newErrors.firstName = 'Nome obrigatório';
    if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome obrigatório';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF obrigatório';
    else if (digitsOnly(formData.cpf).length !== 11) newErrors.cpf = 'CPF inválido';
    if (!formData.phone.trim()) newErrors.phone = 'Celular obrigatório';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP obrigatório';
    if (!formData.address.trim()) newErrors.address = 'Endereço obrigatório';
    if (!formData.number.trim()) newErrors.number = 'Número obrigatório';
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade obrigatória';
    if (!formData.state) newErrors.state = 'Estado obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPaymentPayload = () => {
    const fullName = `${safeTrim(formData.firstName)} ${safeTrim(formData.lastName)}`;
    const customerBody = {
      name: fullName, cpfCnpj: digitsOnly(formData.cpf), email: safeTrim(formData.email),
      mobilePhone: digitsOnly(formData.phone), address: safeTrim(formData.address),
      addressNumber: safeTrim(formData.number), complement: safeTrim(formData.complement),
      province: safeTrim(formData.state), postalCode: digitsOnly(formData.zipCode),
      neighborhood: safeTrim(formData.neighborhood), city: safeTrim(formData.city),
    };
    const cleanedBody = Object.fromEntries(Object.entries(customerBody).filter(([, v]) => v));
    const avgUnitPrice = totalQuantity > 0 ? totalWithShipping / totalQuantity : totalWithShipping;
    return {
      ...cleanedBody, createPayment: true,
      payment: { billingType: 'PIX', value: Number(totalWithShipping.toFixed(2)), dueDate: getISODate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)) },
      order: { title: buildOrderTitle(), qty: totalQuantity || 1, unitPrice: Number(avgUnitPrice.toFixed(2)) },
    };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Credit card has its own submit path — do NOT trigger PIX flow
    if (paymentMethod === 'CREDIT_CARD') return;

    if (!validateForm()) return;

    if (freteStatus !== 'success' || freteValor === null) {
      setError('Por favor, calcule o frete antes de finalizar a compra.');
      return;
    }
    
    cleanupRealtime();
    setLoadingCreate(true);
    setLoadingQr(false);
    setError(null);
    setPaymentId('');
    setPixQrCode(null);
    setPaymentStatus('IDLE');
    wsConfirmedRef.current = false;

    if (!cart.length || totalQuantity === 0) {
      setLoadingCreate(false);
      return setError('Seu carrinho está vazio.');
    }

    // Snapshot data before transitioning
    const payload = buildPaymentPayload();
    const deliverySnapshot = { ...formData, fullName: `${formData.firstName} ${formData.lastName}` };
    const itemsSnapshot = snapshotCartItems(cart);
    const orderTitle = payload?.order?.title || buildOrderTitle();
    
    setConfirmedDeliveryInfo(deliverySnapshot);
    setConfirmedCartItems(itemsSnapshot);
    setConfirmedOrderTitle(orderTitle);
    setConfirmedShippingCost(shippingCost);
    
    // Transition to payment state
    setCheckoutState(CHECKOUT_STATES.PAYMENT);
    setLoadingQr(true);

    try {
      const response = await createPaymentOrder(payload);
      const { paymentId: normalizedPaymentId, paymentMeta: meta, pixQrCode: qr } = normalizePixResponse(response, payload.payment);
      
      if (!normalizedPaymentId) throw new Error('Resposta sem paymentId.');
      if (!qr?.payload) throw new Error('Resposta sem QR Code PIX.');
      
      setPaymentId(normalizedPaymentId);
      setPaymentMeta(meta);
      setPixQrCode(qr);
      setPaymentStatus('PENDING');
      setWsRetryKey(k => k + 1);

      // GA4: begin_checkout
      trackEvent('begin_checkout', {
        currency: 'BRL',
        value: Number(totalWithShipping.toFixed(2)),
      });
    } catch (err) {
      if (err?.isCanceled) return;
      setError(err?.data?.message || err?.message || 'Não foi possível processar o pedido. Tente novamente.');
      setCheckoutState(CHECKOUT_STATES.FILLING);
    } finally {
      setLoadingCreate(false);
      setLoadingQr(false);
    }
  };

  const handleRetryRealtime = () => {
    if (!paymentId) return;
    cleanupRealtime();
    setError(null);
    setPaymentStatus('PENDING');
    setWsRetryKey(k => k + 1);
  };

  const handleBackToForm = () => {
    cleanupRealtime();
    setCheckoutState(CHECKOUT_STATES.FILLING);
    setPaymentId('');
    setPixQrCode(null);
    setPaymentStatus('IDLE');
    setError(null);
  };

  // Credit Card submit — real backend integration via same POST /customers endpoint
  const handleCreditCardSubmit = async () => {
    if (!validateForm()) return;
    if (freteStatus !== 'success' || freteValor === null) {
      setError('Por favor, calcule o frete antes de finalizar a compra.');
      return;
    }
    // Validate card fields via ref
    if (!ccFormRef.current?.validate()) return;

    const cardData = ccFormRef.current.getData();

    if (!cart.length || totalQuantity === 0) {
      return setError('Seu carrinho está vazio.');
    }

    setLoadingCreate(true);
    setError(null);

    // Snapshot data
    const deliverySnapshot = { ...formData, fullName: `${formData.firstName} ${formData.lastName}` };
    const itemsSnapshot = snapshotCartItems(cart);
    const orderTitle = buildOrderTitle();

    setConfirmedDeliveryInfo(deliverySnapshot);
    setConfirmedCartItems(itemsSnapshot);
    setConfirmedOrderTitle(orderTitle);
    setConfirmedShippingCost(shippingCost);

    // GA4: begin_checkout (credit card)
    trackEvent('begin_checkout', {
      currency: 'BRL',
      value: Number(totalWithShipping.toFixed(2)),
    });

    // Build payload — same structure as PIX but with billingType CREDIT_CARD + card data
    const fullName = `${safeTrim(formData.firstName)} ${safeTrim(formData.lastName)}`;
    const customerBody = {
      name: fullName, cpfCnpj: digitsOnly(formData.cpf), email: safeTrim(formData.email),
      mobilePhone: digitsOnly(formData.phone), address: safeTrim(formData.address),
      addressNumber: safeTrim(formData.number), complement: safeTrim(formData.complement),
      province: safeTrim(formData.state), postalCode: digitsOnly(formData.zipCode),
      neighborhood: safeTrim(formData.neighborhood), city: safeTrim(formData.city),
    };
    const cleanedBody = Object.fromEntries(Object.entries(customerBody).filter(([, v]) => v));
    const avgUnitPrice = totalQuantity > 0 ? totalWithShipping / totalQuantity : totalWithShipping;

    // Expiry year: form gives 2-digit, Asaas expects 4-digit
    const expYearFull = cardData.expYear.length === 2
      ? `20${cardData.expYear}`
      : cardData.expYear;

    const payload = {
      ...cleanedBody,
      createPayment: true,
      payment: {
        billingType: 'CREDIT_CARD',
        value: Number(totalWithShipping.toFixed(2)),
        description: orderTitle,
        creditCard: {
          holderName: cardData.cardName,
          number: digitsOnly(cardData.cardNumber),
          expiryMonth: cardData.expMonth,
          expiryYear: expYearFull,
          ccv: digitsOnly(cardData.cvv),
        },
        creditCardHolderInfo: {
          name: fullName,
          cpfCnpj: digitsOnly(cardData.holderCpf),
          email: safeTrim(formData.email),
          postalCode: digitsOnly(formData.zipCode),
          addressNumber: safeTrim(formData.number),
          phone: digitsOnly(formData.phone),
        },
      },
      order: { title: orderTitle, qty: totalQuantity || 1, unitPrice: Number(avgUnitPrice.toFixed(2)) },
    };

    try {
      const response = await createPaymentOrder(payload);
      const { paymentId: ccPaymentId, status, value } = normalizeCreditCardResponse(response);

      if (!ccPaymentId) throw new Error('Resposta sem paymentId.');

      setPaymentId(ccPaymentId);
      setPaymentMeta({ value: value || totalWithShipping, dueDate: '' });

      if (status === 'CONFIRMED' || status === 'RECEIVED') {
        // Credit card approved synchronously — go straight to confirmed
        setPaymentStatus('PAID');
        setCheckoutState(CHECKOUT_STATES.CONFIRMED);

        // GA4: purchase (credit card)
        trackEvent('purchase', {
          transaction_id: ccPaymentId,
          currency: 'BRL',
          value: value || totalWithShipping,
          items: itemsSnapshot.map(i => ({
            item_id: i.id,
            item_name: i.name,
            price: i.unitPrice,
            quantity: i.quantity,
          })),
        });

        setTimeout(() => {
          emptyCart?.();
          navigate('/checkout/success', {
            state: {
              paymentId: ccPaymentId,
              totalAmount: value || totalWithShipping,
              dueDate: '',
              deliveryInfo: deliverySnapshot,
              items: itemsSnapshot,
              orderTitle: orderTitle || 'Pedido Menina Dourada',
              confirmedAt: new Date().toISOString(),
              paymentMethod: 'CREDIT_CARD',
            },
          });
        }, 2000);
      } else {
        // Unexpected status — show error but don't break
        setError(`Pagamento retornou status: ${status}. Entre em contato com o suporte.`);
      }
    } catch (err) {
      if (err?.isCanceled) return;
      const errData = err?.data || err?.response?.data || null;
      setError(getCreditCardErrorMessage(errData));
    } finally {
      setLoadingCreate(false);
    }
  };

  // Initialize checkout
  useEffect(() => {
    if (cart?.length > 0 && !checkoutInitialized) setCheckoutInitialized(true);
  }, [cart, checkoutInitialized]);

  useEffect(() => {
    if (!checkoutInitialized && (!cart || cart.length === 0)) navigate('/produtos');
  }, [checkoutInitialized, cart, navigate]);

  // Scroll to top when page loads or state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [checkoutState]);

  useEffect(() => () => cleanupRealtime(), [cleanupRealtime]);

  // WebSocket for payment confirmation
  useEffect(() => {
    if (!paymentId || paymentStatus !== 'PENDING') return () => {};
    
    let isActive = true;
    wsConfirmedRef.current = false;
    
    const socket = new WebSocket(PIX_WS_URL);
      wsRef.current = socket;

      socket.onopen = () => {
        if (isActive) {
          socket.send(JSON.stringify({ action: 'register', paymentId }));
        }
      };

    socket.onmessage = (event) => {
      if (!isActive) return;
      let data;
      try { data = JSON.parse(event.data); } catch { return; }
      
      if (data?.type === 'REGISTERED') return;
      
      const incomingPaymentId = data?.paymentId || data?.payment?.id || data?.payment?.paymentId || data?.id || '';
      
        if (isPaidWsEvent(data) && incomingPaymentId === paymentId && !wsConfirmedRef.current) {
          wsConfirmedRef.current = true;
          setPaymentStatus('CONFIRMING');
          
          // GA4: purchase (PIX confirmed)
          trackEvent('purchase', {
            transaction_id: paymentId,
            currency: 'BRL',
            value: paymentMeta?.value ?? subtotal,
            items: confirmedCartItems.map(i => ({
              item_id: i.id,
              item_name: i.name,
              price: i.unitPrice,
              quantity: i.quantity,
            })),
          });

          setError(null);
          setPaymentStatus('PAID');
        setCheckoutState(CHECKOUT_STATES.CONFIRMED);
        cleanupRealtime();
        
        // Navigate to success after brief delay
        setTimeout(() => {
          emptyCart?.();
          navigate('/checkout/success', {
            state: {
              paymentId,
              totalAmount: paymentMeta?.value ?? subtotal,
              dueDate: paymentMeta?.dueDate ?? '',
              deliveryInfo: confirmedDeliveryInfo || {},
              items: confirmedCartItems,
              orderTitle: confirmedOrderTitle || 'Pedido Menina Dourada',
              confirmedAt: new Date().toISOString(),
            },
          });
        }, 2000);
      }

      // Handle DENIED / CHARGEBACK from WebSocket (credit card scenarios)
      const wsStatus = (data?.status || '').toUpperCase();
      if (incomingPaymentId === paymentId && !wsConfirmedRef.current) {
        if (wsStatus === 'DENIED') {
          wsConfirmedRef.current = true;
          cleanupRealtime();
          setPaymentStatus('IDLE');
          setCheckoutState(CHECKOUT_STATES.FILLING);
          setError('Pagamento recusado pela operadora. Tente outro cartão.');
        } else if (wsStatus === 'CHARGEBACK') {
          wsConfirmedRef.current = true;
          cleanupRealtime();
          setPaymentStatus('IDLE');
          setError('Chargeback detectado. Entre em contato com o suporte.');
        }
      }
    };

    socket.onerror = () => {
      if (isActive && !wsConfirmedRef.current) {
        setError('Erro na conexão. Aguarde ou tente novamente.');
      }
    };

    socket.onclose = () => {};

    return () => {
      isActive = false;
try { socket.close(); } catch {}
      if (wsRef.current === socket) wsRef.current = null;
    };
  }, [paymentId, wsRetryKey, paymentStatus, cleanupRealtime, confirmedCartItems, confirmedDeliveryInfo, confirmedOrderTitle, paymentMeta, emptyCart, navigate, subtotal]);

  // ============================================
  // RENDER: State 1 - FILLING (Form)
  // ============================================
  const renderFillingState = () => (
    <form onSubmit={handlePlaceOrder} className="checkout-layout checkout-fade-in">
      <div className="checkout-main">
        <div className="checkout-card">
          <CustomerForm data={formData} onChange={handleChange} errors={errors} />
          <AddressForm
            data={formData}
            onChange={handleChange}
            onCepSearch={handleCepSearch}
            onShippingLoad={handleShippingLoad}
            onCalcularFrete={handleCalcularFrete}
            errors={errors}
          />
        </div>
      </div>

      <div className="checkout-sidebar">
        <PaymentMethodSelector selected={paymentMethod} onChange={(m) => { setPaymentMethod(m); setError(null); }} />

        {paymentMethod === 'PIX' && <PixInfoCard />}
        {paymentMethod === 'CREDIT_CARD' && (
          <CreditCardPaymentForm ref={ccFormRef} loading={loadingCreate} />
        )}

        <OrderSummary
          cart={cart}
          subtotal={subtotal}
          freteState={{
            cepDestino,
            servicoSelecionado,
            freteValor,
            prazoLabel,
            prazoMin,
            prazoMax,
            status: freteStatus,
            errorMessage: freteErrorMessage,
            opcoesFrete,
            shipmentsInfo,
          }}
          onCepChange={handleFreteCepChange}
          onServicoChange={handleFreteServicoChange}
          onCalcularFrete={handleCalcularFrete}
        />

        <CheckoutTrustBlock />

        <div className="checkout-cta-container">
          {paymentMethod === 'PIX' && (
            <>
              <button type="submit" className="checkout-cta-btn" disabled={loadingCreate}>
                {loadingCreate ? 'Processando...' : 'Finalizar Compra'}
              </button>
              <p className="checkout-cta-hint">
                Ao finalizar, você recebe o <strong>QR Code do PIX</strong>.
              </p>
            </>
          )}
          {paymentMethod === 'CREDIT_CARD' && (
            <>
              <button type="button" className="checkout-cta-btn" disabled={loadingCreate} onClick={handleCreditCardSubmit}>
                {loadingCreate ? 'Processando pagamento...' : 'Pagar com Cartão'}
              </button>
              <p className="checkout-cta-hint">
                Pagamento processado de forma <strong>segura</strong>.
              </p>
            </>
          )}
          <div className="checkout-trust">
            <span className="checkout-trust-icon">🔒</span>
            <span>Dados protegidos e usados apenas para processar o pedido.</span>
          </div>
        </div>

        {error && <div className="checkout-message checkout-message-error">{error}</div>}

        <Link to="/produtos" className="checkout-back-link">← Voltar para a loja</Link>
      </div>
    </form>
  );

  // ============================================
  // RENDER: State 2 - PAYMENT (QR Code)
  // ============================================
  const renderPaymentState = () => (
    <div className="payment-page checkout-fade-in">
      {/* Compact Header */}
      <div className="payment-header">
        <h2 className="payment-title">Escaneie o QR Code para pagar</h2>
      </div>

      {/* Mobile: Steps inline */}
      <div className="payment-mobile-steps">
        <PixHowItWorks />
      </div>

      {/* Main Grid: Desktop 2 cols, Mobile 1 col */}
      <div className="payment-grid">
        {/* Left: Instructions (Desktop only) */}
        <div className="payment-left">
          <PixHowItWorks compact />
          
          {/* Order Summary Compact */}
          <div className="payment-order-summary">
            <OrderItemsCard
              items={confirmedCartItems}
              subtotal={subtotal}
              shippingCost={confirmedShippingCost}
              compact
            />
          </div>

          {/* Shipping Info */}
          <ShippingInfoCard deliveryInfo={confirmedDeliveryInfo} />
          
          <button type="button" onClick={handleBackToForm} className="payment-edit-btn">
            ← Editar dados
          </button>
        </div>

        {/* Right: QR Code (Sticky on desktop) */}
        <div className="payment-right">
          <div className="payment-qr-sticky">
            <PixPaymentCard
              pixQrCode={pixQrCode}
              paymentMeta={paymentMeta}
              paymentStatus={paymentStatus}
              onRetry={handleRetryRealtime}
              isLoading={loadingQr}
            />
            
            {error && <div className="checkout-message checkout-message-error">{error}</div>}
          </div>
        </div>
      </div>

      {/* Mobile: Order details below */}
      <div className="payment-mobile-details">
        <OrderItemsCard
          items={confirmedCartItems}
          subtotal={subtotal}
          shippingCost={confirmedShippingCost}
          compact
        />
        <ShippingInfoCard deliveryInfo={confirmedDeliveryInfo} />
        <button type="button" onClick={handleBackToForm} className="payment-edit-btn">
          ← Editar dados
        </button>
      </div>
    </div>
  );

  // ============================================
  // RENDER: State 3 - CONFIRMED
  // ============================================
  const renderConfirmedState = () => (
    <div className="checkout-confirmed-layout checkout-fade-in">
      <div className="checkout-confirmed-icon">✅</div>
      <h2 className="checkout-confirmed-title">Pagamento Confirmado!</h2>
      <p className="checkout-confirmed-subtitle">
        Obrigado pela sua compra. Você será redirecionado em instantes...
      </p>
      <div className="checkout-confirmed-spinner" />
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="checkout-page">
      <AdvancedSEO
        title="Checkout seguro | Menina Dourada"
        description="Finalize seu pedido com segurança e pagamento via PIX."
        noindex
      />
      <div className="checkout-container">
        <header className="checkout-header">
          <h1 className="checkout-title">
            {checkoutState === CHECKOUT_STATES.FILLING && 'Finalizar Compra'}
            {checkoutState === CHECKOUT_STATES.PAYMENT && (paymentMethod === 'CREDIT_CARD' ? 'Pagamento Cartão' : 'Pagamento PIX')}
            {checkoutState === CHECKOUT_STATES.CONFIRMED && 'Pedido Confirmado'}
          </h1>
          <CheckoutSteps currentStep={checkoutState} />
        </header>

        {/* Mobile Summary - Only in filling state */}
        {checkoutState === CHECKOUT_STATES.FILLING && (
          <div className="checkout-mobile-summary">
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              isAccordion
              defaultOpen
              freteState={{
                cepDestino,
                servicoSelecionado,
                freteValor,
                prazoLabel,
                prazoMin,
                prazoMax,
                status: freteStatus,
                errorMessage: freteErrorMessage,
                opcoesFrete,
                shipmentsInfo,
              }}
              onCepChange={handleFreteCepChange}
              onServicoChange={handleFreteServicoChange}
              onCalcularFrete={handleCalcularFrete}
            />
          </div>
        )}

        {/* Render current state */}
        {checkoutState === CHECKOUT_STATES.FILLING && renderFillingState()}
        {checkoutState === CHECKOUT_STATES.PAYMENT && renderPaymentState()}
        {checkoutState === CHECKOUT_STATES.CONFIRMED && renderConfirmedState()}

        {/* Mobile Fixed CTA - Only in filling state */}
        {checkoutState === CHECKOUT_STATES.FILLING && (
          <div className="checkout-mobile-cta">
            {paymentMethod === 'PIX' && (
              <button 
                type="button" 
                className="checkout-cta-btn" 
                disabled={loadingCreate} 
                onClick={handlePlaceOrder}
              >
                {loadingCreate ? 'Processando...' : `Finalizar • R$ ${formatCurrency(totalWithShipping)}`}
              </button>
            )}
            {paymentMethod === 'CREDIT_CARD' && (
              <button 
                type="button" 
                className="checkout-cta-btn" 
                disabled={loadingCreate} 
                onClick={handleCreditCardSubmit}
              >
                {loadingCreate ? 'Processando...' : `Cartão • R$ ${formatCurrency(totalWithShipping)}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;



