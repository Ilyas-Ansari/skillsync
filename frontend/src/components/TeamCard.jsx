import React from 'react';
import { 
  Users, 
  Award, 
  Briefcase, 
  ShieldCheck, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FolderGit2
} from 'lucide-react';

export default function TeamCard({ team, currentUser }) {
  if (!team) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <Users size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
          No Team Assigned Yet
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 20px' }}>
          Teams are formed when the academic administrator triggers the matching engine. You can also view recommended projects and rate your skills.
        </p>
      </div>
    );
  }

  const { name, projectTitle, projectDomain, mentor, members, coveredSkills, missingSkills, status } = team;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Card */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald">
                <CheckCircle size={13} /> {status}
              </span>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#c7d2fe' }}>
                {projectDomain}
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '4px' }}>
              {name}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#c7d2fe' }}>
              Assigned Capstone Project: <strong style={{ color: '#ffffff' }}>{projectTitle}</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Team Roster Size
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
              {members.length} Members
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left Teammates + Right Assigned Mentor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Left: Teammates */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Users color="#818cf8" size={20} /> Team Members & Skill Strengths
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {members.map((member) => {
              const isMe = currentUser && member.id === currentUser.id;
              return (
                <div
                  key={member.id}
                  style={{
                    background: isMe ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isMe ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isMe ? '#c7d2fe' : '#ffffff' }}>
                        {member.name} {isMe && '(You)'}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.email}</div>
                    </div>
                    <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                      <Clock size={12} /> {member.hoursPerWeek} hrs/wk
                    </span>
                  </div>

                  {/* Skills badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {member.skills && member.skills.map((s) => (
                      <span
                        key={s.skillId}
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: '#e2e8f0',
                        }}
                      >
                        {s.skillName} <strong style={{ color: '#fbbf24' }}>Lvl {s.level}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Assigned Mentor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #a855f7' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShieldCheck color="#c084fc" size={20} /> Assigned Project Mentor
            </h3>

            {mentor ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                  }}>
                    {mentor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{mentor.name}</h4>
                    <span className="badge badge-mentor" style={{ fontSize: '0.7rem' }}>
                      {mentor.interests || 'Faculty Mentor'}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {mentor.bio || 'Experienced faculty mentor offering architecture guidance and code reviews.'}
                </p>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} /> {mentor.email}
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c084fc', fontWeight: 700, marginBottom: '8px' }}>
                    Mentor Expertise Endorsements:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {mentor.skills && mentor.skills.map((s) => (
                      <span
                        key={s.skillId}
                        style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(168, 85, 247, 0.15)',
                          color: '#d8b4fe',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                        }}
                      >
                        {s.skillName} (Lvl {s.level})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No mentor assigned yet. Run the matching engine to pair a mentor with this team.
              </p>
            )}
          </div>

          {/* Skill Gap Analysis */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award color="#10b981" size={18} /> Team Skill Gap Coverage
            </h4>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, marginBottom: '4px' }}>
                ✓ Team Mastered Competencies:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {coveredSkills && coveredSkills.length > 0 ? (
                  coveredSkills.map((c, i) => (
                    <span key={i} className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem' }}>
                      {c}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</span>
                )}
              </div>
            </div>

            {missingSkills && missingSkills.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600, marginBottom: '4px' }}>
                  ⚡ Gaps Covered by Assigned Mentor:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {missingSkills.map((m, i) => (
                    <span key={i} className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.75rem' }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
