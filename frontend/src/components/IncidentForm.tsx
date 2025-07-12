'use client';

import { useState } from 'react';

interface Props {
  user: any;
  onCreated: () => void;
}

export default function IncidentForm({ user, onCreated }: Props) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const idToken = await user.getIdToken();

    const res = await fetch('http://localhost:4000/incidents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ type, description }),
    });

    setLoading(false);

    if (res.ok) {
      setType('');
      setDescription('');
      onCreated();
    } else {
      alert('Failed to create incident');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Log New Incident</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Select type</option>
        <option value="fall">Fall</option>
        <option value="behaviour">Behaviour</option>
        <option value="medication">Medication</option>
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Incident description"
        required
        className="w-full border p-2 rounded"
        rows={4}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-950"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
