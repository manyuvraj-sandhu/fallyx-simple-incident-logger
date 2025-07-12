'use client';

import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Particles } from '@/components/particles';
import Image from 'next/image';
import IncidentForm from '@/components/IncidentForm';
import IncidentList from '@/components/IncidentList';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
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

      {user && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="bg-cyan-900 hover:bg-cyan-950 text-white text-sm px-4 py-2 rounded-md shadow-md transition-all"
          >
            Logout
          </button>
        </div>
      )}

      {!user ? (
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full h-full px-6 py-12 space-y-12 md:space-y-0">
          <div className="w-full md:w-1/2 lg:w-[55%] flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800 leading-tight">
              Welcome to <span className="text-cyan-900">Incident Logger</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700">
              Seamlessly log, manage, and summarize incidents with AI-assisted support.
            </p>
            <button
              onClick={handleLogin}
              className="bg-cyan-900 hover:bg-cyan-950 active:bg-black text-white text-2xl px-10 py-5 rounded-xl transition-all shadow-md"
            >
              Sign in with Google
            </button>
          </div>

          <div className="w-full md:w-1/2 lg:w-[40%] flex justify-center items-center">
            <div className="relative w-full max-w-[500px] h-auto">
              <Image
                src="/hero.png"
                alt="Hero"
                width={500}
                height={500}
                className="w-full h-auto object-contain rounded-xl"
                priority
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="z-10 w-full flex flex-col items-center px-4 py-6 space-y-6 text-center">
          <p className="text-sm sm:text-base md:text-lg text-gray-700 mt-4">
            Seamlessly log, manage, and summarize incidents with AI-assisted support.
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Hello, {user.displayName}
          </h2>

          <>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="bg-cyan-900 hover:bg-cyan-950 text-white text-base px-6 py-2 rounded-md shadow-md transition-all"
            >
              {showForm ? 'Hide Form' : 'Report a New Incident'}
            </button>

            {showForm && (
              <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                <IncidentForm
                  user={user}
                  onCreated={() => {
                    setRefreshKey((k) => k + 1);
                    setShowForm(false);
                  }}
                />
              </div>
            )}

            <div className="w-full sm:w-11/12 mt-6">
              <IncidentList key={refreshKey} user={user} />
            </div>
          </>
        </div>
      )}
    </main>
  );
}
