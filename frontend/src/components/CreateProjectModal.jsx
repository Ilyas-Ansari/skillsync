import React, { useState, useEffect } from 'react';
import { getAllSkills, createProject } from '../api/client';
import { X, Plus, Trash2, Layers, AlertCircle } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Full Stack Web');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [teamSize, setTeamSize] = useState(3);
  const [hoursNeeded, setHoursNeeded] = useState(15);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]); // [ { skillId, level } ]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSkills();
    }
  }, [isOpen]);

  const loadSkills = async () => {
    try {
      const skills = await getAllSkills();
      setAllSkills(skills);
      if (skills.length > 0 && selectedSkills.length === 0) {
        setSelectedSkills([
          { skillId: skills[0].id, level: 3 },
          { skillId: skills[1]?.id || skills[0].id, level: 3 },
        ]);
      }
    } catch (err) {
      console.error('Failed to load skills:', err);
    }
  };

  if (!isOpen) return null;

  const handleAddSkillRow = () => {
    if (allSkills.length === 0) return;
    setSelectedSkills([...selectedSkills, { skillId: allSkills[0].id, level: 3 }]);
  };

  const handleRemoveSkillRow = (index) => {
    setSelectedSkills(selectedSkills.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, field, value) => {
    const updated = [...selectedSkills];
    updated[index][field] = Number(value);
    setSelectedSkills(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        domain,
        difficulty,
        teamSize: Number(teamSize),
        hoursNeeded: Number(hoursNeeded),
        requiredSkills: selectedSkills,
      };

      const newProj = await createProject(payload);
      if (onProjectCreated) onProjectCreated(newProj);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={22} color="#818cf8" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add New Capstone Project</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              fontSize: '0.875rem'
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Project Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Distributed Sensor Telemetry Platform"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Project Description</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="Outline objectives, tech stack, and deliverable expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Domain Area</label>
              <select
                className="form-select"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                <option value="Enterprise Java">Enterprise Java</option>
                <option value="Full Stack Web">Full Stack Web</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="Mobile App Dev">Mobile App Dev</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Difficulty Tier</label>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Team Size ({teamSize} students)</label>
              <input
                type="number"
                min="2"
                max="6"
                className="form-input"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Weekly Hours Needed ({hoursNeeded} hrs)</label>
              <input
                type="number"
                min="5"
                max="40"
                step="5"
                className="form-input"
                value={hoursNeeded}
                onChange={(e) => setHoursNeeded(e.target.value)}
              />
            </div>
          </div>

          {/* Dynamic Required Skills */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>Required Technical Skills & Minimum Level</label>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddSkillRow}
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              >
                <Plus size={14} /> Add Skill
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedSkills.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    className="form-select"
                    style={{ flex: 2 }}
                    value={item.skillId}
                    onChange={(e) => handleSkillChange(idx, 'skillId', e.target.value)}
                  >
                    {allSkills.map((sk) => (
                      <option key={sk.id} value={sk.id}>{sk.name} ({sk.category})</option>
                    ))}
                  </select>

                  <select
                    className="form-select"
                    style={{ flex: 1 }}
                    value={item.level}
                    onChange={(e) => handleSkillChange(idx, 'level', e.target.value)}
                  >
                    <option value="1">Lvl 1 (Beginner)</option>
                    <option value="2">Lvl 2 (Elementary)</option>
                    <option value="3">Lvl 3 (Intermediate)</option>
                    <option value="4">Lvl 4 (Proficient)</option>
                    <option value="5">Lvl 5 (Expert)</option>
                  </select>

                  {selectedSkills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillRow(idx)}
                      style={{ background: 'transparent', color: '#f87171', padding: '6px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
