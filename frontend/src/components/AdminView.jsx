import React, { useState, useEffect } from 'react';
import { 
  getAdminStats, 
  getAllTeams, 
  getAllProjects, 
  generateTeams 
} from '../api/client';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  Award, 
  Play, 
  Plus, 
  CheckCircle, 
  RefreshCw, 
  Clock, 
  Zap,
  ArrowRight
} from 'lucide-react';
import TeamCard from './TeamCard';
import CreateProjectModal from './CreateProjectModal';

export default function AdminView({ currentUser, onOpenMatrix }) {
  const [stats, setStats] = useState(null);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('teams');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, teamsData, projectsData] = await Promise.all([
        getAdminStats(),
        getAllTeams(),
        getAllProjects(),
      ]);
      setStats(statsData);
      setTeams(teamsData);
      setProjects(projectsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunMatchingEngine = async () => {
    setGenerating(true);
    setGenerationResult('');
    try {
      const generated = await generateTeams();
      setTeams(generated);
      const updatedStats = await getAdminStats();
      setStats(updatedStats);
      setGenerationResult(`Success! Algorithmic matching formed ${generated.length} teams and assigned optimal mentors.`);
      setTimeout(() => setGenerationResult(''), 6000);
    } catch (err) {
      alert('Team generation error: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Admin KPI Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Students</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {stats?.totalStudents || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>
            {stats?.matchedStudents || 0} Placed in Teams
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Faculty Mentors</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
            {stats?.totalMentors || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Available for Guidance
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Active Projects</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {stats?.totalProjects || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across 5 Domains
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Formed Teams</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            {stats?.totalTeams || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '4px' }}>
            Mentors Paired
          </div>
        </div>
      </div>

      {/* Algorithm Execution Engine Card */}
      <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-emerald">
                <Zap size={14} /> Full Stack Java Matching Engine
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              Greedy Team Generation & Mentorship Optimization
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#c7d2fe', lineHeight: 1.5 }}>
              Executes the Java multi-factor matching formula: groups unassigned students by highest project fit score, conducts team skill gap analysis, and pairs optimal faculty mentors respecting capacity constraints.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '1rem' }}
              onClick={handleRunMatchingEngine}
              disabled={generating}
            >
              <Play size={18} fill="currentColor" /> {generating ? 'Running Engine in Java...' : 'Generate Teams Now'}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenMatrix}
            >
              Inspect Mentorship Matrix <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {generationResult && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            color: '#34d399',
            marginTop: '18px',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}>
            <CheckCircle size={18} /> {generationResult}
          </div>
        )}
      </div>

      {/* Projects & Teams Management Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeSubTab === 'teams' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('teams')}
          >
            <Users size={16} /> Formed Teams ({teams.length})
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('projects')}
          >
            <Layers size={16} /> Capstone Projects ({projects.length})
          </button>
        </div>

        <button
          className="btn btn-success btn-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={16} /> Create New Project
        </button>
      </div>

      {/* Subtab Content: Teams */}
      {activeSubTab === 'teams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {teams.length === 0 ? (
            <div className="glass-card" style={{ padding: '36px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>
                No teams have been formed yet. Click "Generate Teams Now" to run the matching engine!
              </p>
            </div>
          ) : (
            teams.map((team) => (
              <TeamCard key={team.id} team={team} currentUser={currentUser} />
            ))
          )}
        </div>
      )}

      {/* Subtab Content: Projects */}
      {activeSubTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>
                    {proj.domain}
                  </span>
                  <span className={`badge ${proj.status === 'MATCHED' ? 'badge-emerald' : 'badge-student'}`}>
                    {proj.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{proj.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {proj.description}
                </p>

                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Required Skills:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {proj.requiredSkills && proj.requiredSkills.map((ps) => (
                    <span key={ps.skillId} className="badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#f1f5f9' }}>
                      {ps.skillName} (Lvl {ps.requiredLevel})
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                <span>Difficulty: <strong style={{ color: '#fff' }}>{proj.difficulty}</strong></span>
                <span>Team Size: <strong style={{ color: '#fff' }}>{proj.teamSize} members</strong></span>
                <span>Hours: <strong style={{ color: '#fff' }}>{proj.hoursNeeded} hrs/wk</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={(newProj) => {
          setProjects([...projects, newProj]);
          getAdminStats().then(setStats);
        }}
      />
    </div>
  );
}
