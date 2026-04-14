import { useEffect, useRef, useState } from "react";

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });

  const set = (v) => {
    setVal(v);
    localStorage.setItem(key, JSON.stringify(v));
  };
  return [val, set];
}

export function useAsync(fn, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      if (mounted.current) setData(result);
      return result;
    } catch (e) {
      if (mounted.current) setError(e);
      throw e;
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (deps.length > 0) execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, execute, setData };
}
