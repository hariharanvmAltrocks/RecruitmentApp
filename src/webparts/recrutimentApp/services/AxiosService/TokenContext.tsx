

import { useState, useEffect } from "react";


let _token: string | null = null;


const _subscribers = new Set<(token: string | null) => void>();


export const getToken = (): string | null => _token;

export const setToken = (token: string | null): void => {
    _token = token;
    _subscribers.forEach((notify) => notify(token));
};


export const clearToken = (): void => setToken(null);


export const useToken = (): {
    token: string | null;
    setToken: (token: string | null) => void;
} => {

    const [token, setLocalState] = useState<string | null>(_token);

    useEffect(() => {
        _subscribers.add(setLocalState);


        if (_token !== token) {
            setLocalState(_token);
        }


        return () => {
            _subscribers.delete(setLocalState);
        };
    }, []);

    return { token, setToken };
};