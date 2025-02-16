'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { apiGetAdminDetails } from '@services/apiFunctions'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        let setUserData = {
            secretId: userData.secretId,
            email: userData.email,
            name: userData.name,
            adminType: userData.adminType
        }
        setUser(setUserData);
        setToken(token)
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken('');
        router.push('/login');
    };

    const manageDataFlow = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await apiGetAdminDetails()
                if (response.status) {
                    const data = response.user
                    login(token, data)
                } else {
                    logout()
                }
            } catch (err) {
                logout()
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        manageDataFlow()
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
