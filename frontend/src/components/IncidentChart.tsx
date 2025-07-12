'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { Incident } from '@/types';

interface Props {
  user: any;
}

export default function IncidentChart({ user }: Props) {
  const [chartData, setChartData] = useState([
    { type: 'Fall', count: 0 },
    { type: 'Behaviour', count: 0 },
    { type: 'Medication', count: 0 },
  ]);

  useEffect(() => {
    const fetchIncidents = async () => {
      const idToken = await user.getIdToken();
      const res = await fetch('http://localhost:4000/incidents', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const incidents: Incident[] = await res.json();

      const counts = {
        Fall: 0,
        Behaviour: 0,
        Medication: 0,
      };

      for (const i of incidents) {
        const key = i.type.toLowerCase();
        if (key === 'fall') counts.Fall += 1;
        else if (key === 'behaviour') counts.Behaviour += 1;
        else if (key === 'medication') counts.Medication += 1;
      }

      setChartData([
        { type: 'Fall', count: counts.Fall },
        { type: 'Behaviour', count: counts.Behaviour },
        { type: 'Medication', count: counts.Medication },
      ]);
    };

    fetchIncidents();
  }, [user]);

  return (
    <div className="w-full h-80 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-left text-gray-800">Incident Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Incidents">
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={['#22d3ee', '#06b6d4', '#0891b2'][index % 3]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
