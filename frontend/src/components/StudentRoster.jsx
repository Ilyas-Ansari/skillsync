import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllTeams } from '../api/client';
import { GraduationCap, Search, Clock, Award, CheckCircle } from 'lucide-react';

export default function StudentRoster() {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allUsers, allTeams] = await Promise.all([
        getAllUsers(),
        getAllTeams(),
      ]);
      setStudents(allUsers.filter((u) => u.role === 'STUDENT'));
      setTeams(allTeams);
    } catch (err) {
      console.error('Failed to load roster:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStudentTeamName = (studentId) => {
    for (const team of teams) {
      if (team.members && team.members.some((m) => m.id === studentId)) {
        return team.name;
      }
    }
    return null;
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.interests && s.interests.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap color="#818cf8" size={24} /> Enrolled Student Roster ({students.length})
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Verified skill self-evaluations, availability commitments, and project team placements.
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search student or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Loading student roster...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 14px' }}>Student</th>
                  <th style={{ padding: '12px 14px' }}>Weekly Availability</th>
                  <th style={{ padding: '12px 14px' }}>Domain Interests</th>
                  <th style={{ padding: '12px 14px' }}>Top Skills</th>
                  <th style={{ padding: '12px 14px' }}>Assigned Team</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => {
                  const teamName = getStudentTeamName(student.id);
                  return (
                    <tr
                      key={student.id}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                          <Clock size={12} /> {student.hoursPerWeek} hrs/wk
                        </span>
                      </td>

                      <td style={{ padding: '14px', maxWidth: '240px' }}>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                          {student.interests || 'None specified'}
                        </div>
                      </td>

                      <td style={{ padding: '14px', maxWidth: '320px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {student.skills && student.skills.slice(0, 4).map((s) => (
                            <span
                              key={s.skillId}
                              style={{
                                fontSize: '0.72rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: 'rgba(255, 255, 255, 0.06)',
                                color: '#e2e8f0',
                              }}
                            >
                              {s.skillName} <strong style={{ color: '#fbbf24' }}>L{s.level}</strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        {teamName ? (
                          <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                            <CheckCircle size={12} /> {teamName}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Unassigned
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
