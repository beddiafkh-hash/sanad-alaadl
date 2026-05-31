import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isInitialSetup: boolean;
  completeSetup: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialSetup, setIsInitialSetup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            const nameParts = (firebaseUser.displayName || '').split(' ');
            const firstName = nameParts[0] || 'الزميل';
            const lastName = nameParts.slice(1).join(' ') || 'المحامي';
            
            const newUser: User = {
              id: firebaseUser.uid,
              firstName,
              lastName,
              email: firebaseUser.email || '',
              role: 'ADMIN',
              welcomeName: `الأستاذ ${firstName}`,
              officeName: 'مكتب سند للمحاماة',
              photoUrl: firebaseUser.photoURL || ''
            } as any;
            
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error("Auth state firestore load error:", error);
          const nameParts = (firebaseUser.displayName || '').split(' ');
          const fallbackUser: User = {
            id: firebaseUser.uid,
            firstName: nameParts[0] || 'الزميل',
            lastName: nameParts.slice(1).join(' ') || 'المحامي',
            email: firebaseUser.email || '',
            role: 'ADMIN',
            welcomeName: `الأستاذ ${nameParts[0] || 'الزميل'}`,
            officeName: 'مكتب سند للمحاماة',
            photoUrl: firebaseUser.photoURL || ''
          } as any;
          setUser(fallbackUser);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const nameParts = (firebaseUser.displayName || '').split(' ');
        const firstName = nameParts[0] || 'الزميل';
        const lastName = nameParts.slice(1).join(' ') || 'المحامي';
        
        const newUser: User = {
          id: firebaseUser.uid,
          firstName,
          lastName,
          email: firebaseUser.email || '',
          role: 'ADMIN',
          welcomeName: `الأستاذ ${firstName}`,
          officeName: 'مكتب سند للمحاماة',
          photoUrl: firebaseUser.photoURL || ''
        } as any;
        
        await setDoc(userRef, newUser);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const mockUser: User = {
      id: 'mock_user_id',
      firstName: 'إسكندر',
      lastName: 'محمد',
      email: email,
      role: 'ADMIN',
      welcomeName: 'الأستاذ إسكندر',
      officeName: 'مكتب سند للمحاماة'
    };
    setUser(mockUser);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeSetup = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      setIsInitialSetup(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, logout, isInitialSetup, completeSetup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

