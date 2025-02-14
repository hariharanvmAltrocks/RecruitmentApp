import { useState, useEffect } from "react";

let globalToken: string | null = null;
let pendingToken: string | null = null;
let setGlobalToken: ((token: string | null) => void) | null = null;

export const useToken = () => {
    const [token, setTokenState] = useState<string | null>(globalToken);
    useEffect(() => {
        if (pendingToken) {
            setTokenState(pendingToken);
            globalToken = pendingToken;
            pendingToken = null;
        }
    }, []);

    const setToken = (newToken: string | null) => {
        globalToken = newToken;
        setTokenState(newToken);
    };

    setGlobalToken = setToken;

    return { token, setToken };
};

export const getToken = () => pendingToken;

export const setToken = (token: string | null) => {
    if (setGlobalToken) {
        useToken()
        setGlobalToken(token);
    } else {
        console.warn("setGlobalToken is not yet initialized. Storing token temporarily.");
        pendingToken = token;
    }
};
