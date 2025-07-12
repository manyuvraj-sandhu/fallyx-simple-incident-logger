'use client';

import { useEffect, useState } from 'react';
import { Incident } from '@/types';
import IncidentItem from './IncidentItem';

interface Props {
  user: any;
}

export default function IncidentList({ user }: Props) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      const idToken = await user.getIdToken();

      const res = await fetch('http://localhost:4000/incidents', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Status: ${res.status}`);
      }

      const data = await res.json();
      setIncidents(data);
    } catch (err: any) {
      console.error('Error fetching incidents:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [user]);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-lg font-semibold">Your Incidents</h2>
      {error && <p className="text-red-600">{error}</p>}
      {incidents.length === 0 ? (
        <p>No incidents found.</p>
      ) : (
        incidents.map((incident) => (
          <IncidentItem
            key={incident.id}
            incident={incident}
            user={user}
            onUpdated={fetchIncidents}
          />
        ))
      )}
    </div>
  );
}
