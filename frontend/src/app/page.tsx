'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Particles } from '@/components/particles';
import AuthButtons from '@/components/AuthButtons';
import HeroSection from '@/components/HeroSection';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-white via-white to-cyan-300 overflow-hidden">
      {!user && (
        <Particles
          className="absolute inset-0 z-0 pointer-events-none"
          color="#94a3b8"
          quantity={500}
          size={0.8}
        />
      )}

      {user && <AuthButtons onLogout={handleLogout} />}

      {!user ? (
        <HeroSection onLogin={handleLogin} />
      ) : (
        <Dashboard
          user={user}
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}
    </main>
  );
}
