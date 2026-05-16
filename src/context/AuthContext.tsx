import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  mfaStep: 'login' | 'verify-email' | 'verify-totp' | 'verify-passkey' | 'complete';
  tempUser: User | null;
  setMFAStep: (step: 'login' | 'verify-email' | 'verify-totp' | 'verify-passkey' | 'complete') => void;
  setTempUser: (user: User | null) => void;
  completeAuth: () => void;
  logout: () => Promise<void>;
  }

  const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  mfaStep: 'login',
  tempUser: null,
  setMFAStep: () => {},
  setTempUser: () => {},
  completeAuth: () => {},
  logout: async () => {},
  });

  export const useAuth = () => useContext(AuthContext);

  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaStep, setMFAStep] = useState<'login' | 'verify-email' | 'verify-totp' | 'verify-passkey' | 'complete'>('login');

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if MFA is enabled for this user in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        if (userData?.mfaEnabled && mfaStep !== 'complete') {
          setTempUser(user);
          setCurrentUser(null);
          const nextStep = userData.mfaType === 'passkey' ? 'verify-passkey' : (userData.mfaType === 'totp' ? 'verify-totp' : 'verify-email');
          setMFAStep(nextStep);
        } else {
          setCurrentUser(user);
          setMFAStep('complete');
        }
      } else {
        setCurrentUser(null);
        setTempUser(null);
        setMFAStep('login');
      }
      setLoading(false);
    });    return unsubscribe;
  }, [mfaStep]);

  const completeAuth = () => {
    if (tempUser) {
      setCurrentUser(tempUser);
      setMFAStep('complete');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setTempUser(null);
      setMFAStep('login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      mfaStep, 
      tempUser, 
      setMFAStep, 
      setTempUser, 
      completeAuth,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
