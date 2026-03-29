import { useState, useRef, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null); // { message, type }
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'warning') => {
    // Evita spam: se já está visível com a mesma mensagem, ignora
    if (timerRef.current) return;

    setToast({ message, type });

    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, 3000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}
