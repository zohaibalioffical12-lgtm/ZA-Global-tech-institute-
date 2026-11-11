import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { User, UserRole } from '../types/index.ts';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginAsDemoUser: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user with backend
  const syncWithBackend = async (fbUser: FirebaseUser) => {
    try {
      const idToken = await fbUser.getIdToken();
      setToken(idToken);

      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: fbUser.uid,
          email: fbUser.email,
          fullName: fbUser.displayName || 'Student User',
          profileImage: fbUser.photoURL || null,
        }),
      });

      if (res.ok) {
        const userData: User = await res.json();
        setCurrentUser(userData);
      }
    } catch (err) {
      console.error('Failed to sync auth with backend:', err);
    }
  };

  useEffect(() => {
    // Check if demo user is stored in session
    const savedDemo = sessionStorage.getItem('za_demo_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setCurrentUser(parsed);
        setLoading(false);
        return;
      } catch (e) {
        sessionStorage.removeItem('za_demo_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await syncWithBackend(user);
      } else if (!sessionStorage.getItem('za_demo_user')) {
        setCurrentUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      sessionStorage.removeItem('za_demo_user');
      const result = await signInWithPopup(auth, googleAuthProvider);
      setFirebaseUser(result.user);
      await syncWithBackend(result.user);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      alert('Sign In Error: ' + (error.message || 'Popup closed or blocked.'));
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo Switcher for fast evaluation across roles
  const loginAsDemoUser = async (role: UserRole) => {
    setLoading(true);
    let demoData: Partial<User> = {};

    if (role === 'super_admin') {
      demoData = {
        id: 1,
        uid: 'owner_zohaib_ali_founder',
        email: 'zohaibalioffical12@gmail.com',
        fullName: 'Zohaib Ali (Founder & Owner)',
        role: 'super_admin',
        country: 'Pakistan',
        status: 'active',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Founder and Owner of ZA Global Tech Institute.',
      };
    } else if (role === 'teacher') {
      demoData = {
        id: 2,
        uid: 'teacher_dr_ahmed_khan',
        email: 'ahmed.ai@zaglobaltech.com',
        fullName: 'Dr. Ahmed Khan',
        role: 'teacher',
        country: 'Pakistan',
        status: 'active',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior AI Faculty Lead & Machine Learning Engineer.',
      };
    } else {
      demoData = {
        id: 5,
        uid: 'demo_student_ali',
        email: 'student.demo@zaglobaltech.com',
        fullName: 'Ali Raza',
        role: 'student',
        country: 'Pakistan',
        status: 'active',
        profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        bio: 'Enrolled student exploring Artificial Intelligence and Full Stack Development.',
      };
    }

    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoData),
      });
      if (res.ok) {
        const synced = await res.json();
        setCurrentUser(synced);
        sessionStorage.setItem('za_demo_user', JSON.stringify(synced));
      } else {
        setCurrentUser(demoData as User);
        sessionStorage.setItem('za_demo_user', JSON.stringify(demoData));
      }
    } catch {
      setCurrentUser(demoData as User);
      sessionStorage.setItem('za_demo_user', JSON.stringify(demoData));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // Ignore if not signed into Firebase
    }
    sessionStorage.removeItem('za_demo_user');
    setCurrentUser(null);
    setFirebaseUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      await syncWithBackend(firebaseUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        token,
        loading,
        signInWithGoogle,
        loginAsDemoUser,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
