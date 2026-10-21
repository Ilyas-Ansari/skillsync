import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import SkillProfileForm from './components/SkillProfileForm';
import ProjectRecommendations from './components/ProjectRecommendations';
import TeamCard from './components/TeamCard';
import MentorshipMatrix from './components/MentorshipMatrix';
import MentorView from './components/MentorView';
import AdminView from './components/AdminView';
import StudentRoster from './components/StudentRoster';
import { loginUser, registerUser, getUserById, getMyTeam } from './api/client';
import { 
  Sparkles, 
  Layers, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Code2, 
  LayoutGrid 
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [myTeamData, setMyTeamData] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(false);

  // Initialize with student Rahul Verma or stored session
  useEffect(() => {
    const savedUserId = localStorage.getItem('skillsync_user_id');
    if (savedUserId) {
      getUserById(Number(savedUserId))
        .then((user) => {
          setCurrentUser(user);
          setDefaultTabForRole(user.role);
        })
        .catch(() => autoLoginDefault());
    } else {
      autoLoginDefault();
    }
  }, []);

  const autoLoginDefault = async () => {
    try {
      // Default to Rahul Verma for immediate out-of-the-box demo
      const res = await loginUser('rahul@student.edu', 'student123');
      setCurrentUser(res.user);
      localStorage.setItem('skillsync_user_id', res.user.id);
      setDefaultTabForRole(res.user.role);
    } catch (err) {
      console.log('Auto login notice:', err.message);
    }
  };

  const setDefaultTabForRole = (role) => {
    if (role === 'STUDENT') setActiveTab('recommendations');
    else if (role === 'MENTOR') setActiveTab('mentor-teams');
    else if (role === 'ADMIN') setActiveTab('admin-dashboard');
  };

  useEffect(() => {
    if (currentUser?.role === 'STUDENT' && activeTab === 'myteam') {
      loadMyTeam();
    }
  }, [currentUser, activeTab]);

  const loadMyTeam = async () => {
    if (!currentUser) return;
    setLoadingTeam(true);
    try {
      const team = await getMyTeam(currentUser.id);
      setMyTeamData(team);
    } catch (err) {
      console.error('Failed to load my team:', err);
    } finally {
      setLoadingTeam(false);
    }
  };

  const handleLogin = async (email, password) => {
    const res = await loginUser(email, password);
    setCurrentUser(res.user);
    localStorage.setItem('skillsync_user_id', res.user.id);
    setDefaultTabForRole(res.user.role);
  };

  const handleRegister = async (userData) => {
    const res = await registerUser(userData);
    setCurrentUser(res.user);
    localStorage.setItem('skillsync_user_id', res.user.id);
    setDefaultTabForRole(res.user.role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('skillsync_user_id');
    setActiveTab('default');
  };

  const handleQuickSwitch = async (email) => {
    let pass = 'student123';
    if (email.includes('admin')) pass = 'admin123';
    else if (email.includes('mentor') || email.includes('chen') || email.includes('alex')) pass = 'mentor123';

    try {
      const res = await loginUser(email, pass);
      setCurrentUser(res.user);
      localStorage.setItem('skillsync_user_id', res.user.id);
      setDefaultTabForRole(res.user.role);
    } catch (err) {
      console.error('Quick switch error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onQuickSwitchUser={handleQuickSwitch}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '60px' }}>
        {/* If user is not logged in, show Hero */}
        {!currentUser && (
          <div style={{ textAlign: 'center', padding: '60px 0', maxWidth: '800px', margin: '0 auto' }}>
            <span className="badge badge-student" style={{ marginBottom: '16px' }}>
              Full Stack Java Programming Micro Project
            </span>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
              Intelligent Capstone Team & Mentorship Matching System
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
              Built with Spring Boot 3.3 REST APIs and a modern React client. Uses plain Java multi-factor weighted scoring for student-project matching, greedy team synthesis, and the signature Mentorship Matrix heatmap.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <button className="btn btn-primary" onClick={() => setAuthModalOpen(true)}>
                Sign In or Demo <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Student Views */}
        {currentUser && currentUser.role === 'STUDENT' && (
          <>
            {activeTab === 'recommendations' && (
              <ProjectRecommendations currentUser={currentUser} />
            )}
            {activeTab === 'profile' && (
              <SkillProfileForm
                currentUser={currentUser}
                onProfileUpdated={(updated) => setCurrentUser(updated)}
              />
            )}
            {activeTab === 'myteam' && (
              loadingTeam ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  Loading your assigned team...
                </div>
              ) : (
                <TeamCard team={myTeamData} currentUser={currentUser} />
              )
            )}
          </>
        )}

        {/* Mentor Views */}
        {currentUser && currentUser.role === 'MENTOR' && (
          <>
            {activeTab === 'mentor-teams' && (
              <MentorView currentUser={currentUser} />
            )}
            {activeTab === 'matrix' && (
              <MentorshipMatrix />
            )}
          </>
        )}

        {/* Admin Views */}
        {currentUser && currentUser.role === 'ADMIN' && (
          <>
            {activeTab === 'admin-dashboard' && (
              <AdminView
                currentUser={currentUser}
                onOpenMatrix={() => setActiveTab('matrix')}
              />
            )}
            {activeTab === 'matrix' && (
              <MentorshipMatrix />
            )}
            {activeTab === 'roster' && (
              <StudentRoster />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px 0',
        background: 'rgba(11, 15, 25, 0.95)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>SkillSync Platform</strong> • Full Stack Java Micro Project
          </div>
          <div>
            Backend: Spring Boot 3.3.4 (JPA + H2) • Frontend: React + Vite • No external ML dependencies
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
