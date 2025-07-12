'use client';

import { Incident } from '@/types';
import { useState } from 'react';

interface Props {
  incident: Incident;
  user: any;
  onUpdated: () => void;
}

export default function IncidentItem({ incident, user, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);

    const idToken = await user.getIdToken();

    const res = await fetch(`http://localhost:4000/incidents/${incident.id}/summarize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    setLoading(false);

    if (res.ok) {
      onUpdated();
    } else {
      alert('Failed to summarize');
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white space-y-2 shadow-lg">
      <p><strong>Type:</strong> {incident.type}</p>
      <p><strong>Description:</strong> {incident.description}</p>
      <p><strong>Summary:</strong> {incident.summary || 'Not summarized yet.'}</p>
      {!incident.summary && (
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="bg-cyan-900 text-white px-3 py-1 rounded hover:bg-cyan-950"
        >
          {loading ? 'Summarizing...' : 'Generate Summary'}
        </button>
      )}
    </div>
  );
}
