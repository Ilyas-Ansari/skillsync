import React from 'react';
import { 
  Sparkles, 
  User, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  GraduationCap, 
  Users, 
  LayoutGrid, 
  FileCode2,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onOpenAuth, 
  onLogout, 
  onQuickSwitchUser 
}) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const demoAccounts = [
    { name: 'Rahul Verma', email: 'rahul@student.edu', role: 'STUDENT', desc: 'Enterprise Java Student' },
    { name: 'Ananya Patel', email: 'ananya@student.edu', role: 'STUDENT', desc: 'React/UI Student' },
    { name: 'Dr. Sarah Chen', email: 'sarah.chen@skillsync.edu', role: 'MENTOR', desc: 'Cloud Architect Mentor' },
    { name: 'Alex Rivera', email: 'alex.rivera@skillsync.edu', role: 'MENTOR', desc: 'Full Stack Mentor' },
    { name: 'Academic Coordinator', email: 'admin@skillsync.edu', role: 'ADMIN', desc: 'Admin Coordinator' },
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '14px',
        paddingBottom: '14px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setActiveTab('default')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SkillSync
              </span>
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', fontWeight: 600 }}>
                SPRING BOOT + REACT
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Team Formation & Mentorship Matrix Engine
            </p>
          </div>
        </div>

        {/* Center Navigation Pills */}
        {currentUser && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {currentUser.role === 'STUDENT' && (
              <>
                <button
                  className={`btn btn-sm ${activeTab === 'recommendations' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('recommendations')}
                >
                  <Sparkles size={16} /> Recommended Projects
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={16} /> My Skill Profile
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'myteam' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('myteam')}
                >
                  <Users size={16} /> My Team & Mentor
                </button>
              </>
            )}

            {currentUser.role === 'MENTOR' && (
              <>
                <button
                  className={`btn btn-sm ${activeTab === 'mentor-teams' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('mentor-teams')}
                >
                  <Users size={16} /> Assigned Teams
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('matrix')}
                >
                  <LayoutGrid size={16} /> Mentorship Matrix Heatmap
                </button>
              </>
            )}

            {currentUser.role === 'ADMIN' && (
              <>
                <button
                  className={`btn btn-sm ${activeTab === 'admin-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('admin-dashboard')}
                >
                  <ShieldCheck size={16} /> Control Center
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('matrix')}
                >
                  <LayoutGrid size={16} /> Mentorship Matrix
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'roster' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('roster')}
                >
                  <GraduationCap size={16} /> Student Roster
                </button>
              </>
            )}
          </nav>
        )}

        {/* Right side: Quick Persona Switcher & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Demo Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ background: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#c7d2fe' }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FileCode2 size={15} /> Demo Switcher <ChevronDown size={14} />
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '280px',
                  background: '#161f36',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.6)',
                  zIndex: 200
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '6px 8px' }}>
                  Quick 1-Click Demo Login
                </div>
                {demoAccounts.map((acc) => (
                  <div
                    key={acc.email}
                    onClick={() => {
                      onQuickSwitchUser(acc.email, 'student123');
                      setDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>{acc.name}</span>
                      <span className={`badge ${acc.role === 'ADMIN' ? 'badge-admin' : acc.role === 'MENTOR' ? 'badge-mentor' : 'badge-student'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                        {acc.role}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{acc.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{currentUser.name}</div>
                <span className={`badge ${currentUser.role === 'ADMIN' ? 'badge-admin' : currentUser.role === 'MENTOR' ? 'badge-mentor' : 'badge-student'}`}>
                  {currentUser.role}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                title="Log out"
                onClick={onLogout}
                style={{ padding: '8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
