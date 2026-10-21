import React, { useState, useEffect } from 'react';
import { getMentorTeams } from '../api/client';
import { Users, ShieldCheck, Award, Mail, Clock, CheckCircle } from 'lucide-react';
import TeamCard from './TeamCard';

export default function MentorView({ currentUser }) {
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      loadTeams();
    }
  }, [currentUser]);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const teams = await getMentorTeams(currentUser.id);
      setAssignedTeams(teams);
    } catch (err) {
      console.error('Failed to load mentor teams:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Mentor Profile Overview Card */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800,
            }}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-mentor">Faculty Mentor</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.email}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentUser.name}</h2>
              <p style={{ fontSize: '0.875rem', color: '#c7d2fe' }}>{currentUser.bio || currentUser.interests}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Assigned Load</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                {assignedTeams.length} / {currentUser.capacity || 2} Teams
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Skills Row */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c084fc', fontWeight: 700, marginBottom: '8px' }}>
            Your Verified Technical Competencies:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {currentUser.skills && currentUser.skills.map((s) => (
              <span
                key={s.skillId}
                className="badge"
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#d8b4fe',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                }}
              >
                {s.skillName} — <strong style={{ color: '#fbbf24' }}>Level {s.level} / 5</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Assigned Teams Section */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Users color="#818cf8" size={22} /> Your Assigned Student Teams ({assignedTeams.length})
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Loading assigned teams...
          </div>
        ) : assignedTeams.length === 0 ? (
          <div className="glass-card" style={{ padding: '36px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              You currently have no teams assigned. Once the administrator runs team generation, teams will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {assignedTeams.map((team) => (
              <TeamCard key={team.id} team={team} currentUser={currentUser} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
