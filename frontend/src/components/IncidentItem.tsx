'use client';

import { Incident } from '@/types';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
  incident: Incident;
  user: any;
  onUpdated: () => void;
}

export default function IncidentItem({ incident, user, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [type, setType] = useState(incident.type);
  const [description, setDescription] = useState(incident.description);

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

  const handleUpdate = async () => {
    setLoading(true);
    const idToken = await user.getIdToken();

    const res = await fetch(`http://localhost:4000/incidents/${incident.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ type, description }),
    });

    setLoading(false);
    if (res.ok) {
      setEditMode(false);
      onUpdated();
    } else {
      alert('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this incident?')) return;

    const idToken = await user.getIdToken();
    const res = await fetch(`http://localhost:4000/incidents/${incident.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (res.ok) {
      onUpdated();
    } else {
      alert('Failed to delete');
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white space-y-2 shadow-lg relative">
      {/* Top-right edit/delete buttons */}
      {!editMode && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={() => setEditMode(true)}
            className="text-cyan-900 hover:text-yellow-700"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {editMode ? (
        <>
          <div>
            <label className="block text-sm font-medium">Type</label>
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
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full border px-2 py-1 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p><strong>Type:</strong> {incident.type}</p>
          <p><strong>Description:</strong> {incident.description}</p>
          <p><strong>Summary:</strong> {incident.summary || 'Not summarized yet.'}</p>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-950"
            >
              {loading ? 'Summarizing...' : 'Generate Summary'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
