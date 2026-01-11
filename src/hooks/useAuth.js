import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook for authentication management
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [authForm, setAuthForm] = useState({ email: '', password: '', confirmPassword: '' });
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isConfigured, setIsConfigured] = useState(false);

    const passwordsMatch = authMode === 'signup' && authForm.password && authForm.password === authForm.confirmPassword;
    const passwordsMismatch = authMode === 'signup' && authForm.confirmPassword && authForm.password !== authForm.confirmPassword;

    useEffect(() => {
        if (!supabase) {
            setIsConfigured(false);
            return;
        }

        setIsConfigured(true);
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkUser = useCallback(async () => {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
    }, []);

    const handleAuth = useCallback(async (e, onSuccess) => {
        e.preventDefault();
        if (!supabase) return;

        if (authMode === 'signup' && authForm.password !== authForm.confirmPassword) {
            setAuthError('Passwords do not match');
            return;
        }

        setAuthLoading(true);
        setAuthError('');

        try {
            if (authMode === 'login') {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: authForm.email,
                    password: authForm.password,
                });
                if (error) throw error;
                setUser(data.user);
                setShowAuth(false);
                setAuthForm({ email: '', password: '', confirmPassword: '' });
                if (onSuccess) onSuccess(data.user);
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email: authForm.email,
                    password: authForm.password,
                });
                if (error) throw error;
                setAuthError('Check your email for confirmation link');
            }
        } catch (error) {
            setAuthError(error.message);
        } finally {
            setAuthLoading(false);
        }
    }, [authMode, authForm]);

    const openAuthModal = useCallback((mode) => {
        setAuthMode(mode);
        setAuthError('');
        setAuthForm({ email: '', password: '', confirmPassword: '' });
        setShowAuth(true);
    }, []);

    const handleForgotPassword = useCallback(async () => {
        if (!supabase || !authForm.email) {
            setAuthError('Please enter your email first');
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(authForm.email);
            if (error) throw error;
            setAuthError('Password reset email sent!');
        } catch (error) {
            setAuthError(error.message);
        }
    }, [authForm.email]);

    const handleLogout = useCallback(async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        setUser(null);
    }, []);

    return {
        user,
        showAuth,
        setShowAuth,
        authMode,
        setAuthMode,
        authForm,
        setAuthForm,
        authError,
        setAuthError,
        authLoading,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        handleAuth,
        openAuthModal,
        handleForgotPassword,
        handleLogout,
        checkUser,
        passwordsMatch,
        passwordsMismatch,
        isConfigured,
    };
}
