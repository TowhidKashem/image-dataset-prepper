import { useState, useEffect, useCallback, useRef } from 'react';

export type UseStateCallbackT<T> = (state: T, cb?: (state: T) => void) => void;

export const useStateCallback = <T>(
  initialState: T
): [T, UseStateCallbackT<T>] => {
  const [state, setState] = useState(initialState);

  const cbRef = useRef<((state: T) => void) | undefined>(undefined);

  const setStateCallback = useCallback((state: T, cb?: (state: T) => void) => {
    cbRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = undefined;
    }
  }, [state]);

  return [state, setStateCallback];
};
