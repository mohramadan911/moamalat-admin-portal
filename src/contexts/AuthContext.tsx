import React, { createContext, useContext, useEffect, useState } from 'react';
import { signUp, signIn, signOut, confirmSignUp, getCurrentUser, resendSignUpCode, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  confirmEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser({
        email: currentUser.signInDetails?.loginId || '',
        name: currentUser.username,
        tenantId: currentUser.signInDetails?.loginId || undefined,
        tenantRole: undefined,
        tenantStatus: undefined
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signIn({ username: email, password });
      await checkAuthState();
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name
          }
        }
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const confirmEmail = async (email: string, code: string) => {
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
    } catch (error) {
      throw error;
    }
  };

  const resendCode = async (email: string) => {
    try {
      await resendSignUpCode({ username: email });
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await resetPassword({ username: email });
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    confirmEmail,
    resendCode,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
