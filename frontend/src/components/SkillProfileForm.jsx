import React, { useState, useEffect } from 'react';
import { 
  getAllSkills, 
  getStudentSkills, 
  updateStudentSkills, 
  updateStudentProfile 
} from '../api/client';
import { Award, Clock, Heart, Save, CheckCircle, Star } from 'lucide-react';

export default function SkillProfileForm({ currentUser, onProfileUpdated }) {
  const [allSkills, setAllSkills] = useState([]);
  const [skillRatings, setSkillRatings] = useState({}); // { [skillId]: level }
  const [hoursPerWeek, setHoursPerWeek] = useState(currentUser.hoursPerWeek || 15);
  const [interests, setInterests] = useState(currentUser.interests || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const commonInterests = [
    'Enterprise Java',
    'Full Stack Web',
    'Cloud & DevOps',
    'AI / Machine Learning',
    'Data Science',
    'Mobile App Dev',
  ];

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      const skillsData = await getAllSkills();
      setAllSkills(skillsData);

      const studentSkillsData = await getStudentSkills(currentUser.id);
      const ratingsMap = {};
      studentSkillsData.forEach((us) => {
        ratingsMap[us.skillId] = us.level;
      });
      setSkillRatings(ratingsMap);
    } catch (err) {
      console.error('Failed to load skills:', err);
    }
  };

  const handleRatingChange = (skillId, level) => {
    setSkillRatings((prev) => ({
      ...prev,
      [skillId]: level,
    }));
  };

  const handleInterestToggle = (interest) => {
    let list = interests ? interests.split(',').map((s) => s.trim()).filter(Boolean) : [];
    if (list.includes(interest)) {
      list = list.filter((i) => i !== interest);
    } else {
      list.push(interest);
    }
    setInterests(list.join(', '));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    try {
      // 1. Update skills
      const skillsArray = Object.entries(skillRatings).map(([sId, lvl]) => ({
        skillId: Number(sId),
        level: Number(lvl),
      }));
      await updateStudentSkills(currentUser.id, skillsArray);

      // 2. Update profile
      const updatedUser = await updateStudentProfile(currentUser.id, {
        hoursPerWeek: Number(hoursPerWeek),
        interests,
        bio,
      });

      setSuccessMessage('Profile and skill ratings successfully updated!');
      if (onProfileUpdated) onProfileUpdated(updatedUser);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Error updating profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const categories = ['ALL', ...new Set(allSkills.map((s) => s.category))];

  const filteredSkills = selectedCategory === 'ALL'
    ? allSkills
    : allSkills.filter((s) => s.category === selectedCategory);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      {/* Left Column: Skill Matrix Slider Ratings */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award color="#818cf8" size={24} /> Skill Proficiency Matrix
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Rate your technical competency from Level 1 (Beginner) to Level 5 (Expert).
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredSkills.map((skill) => {
            const currentLevel = skillRatings[skill.id] || 0;
            return (
              <div
                key={skill.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{skill.name}</span>
                  <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', fontSize: '0.7rem' }}>
                    {skill.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleRatingChange(skill.id, lvl)}
                        style={{
                          background: 'transparent',
                          color: lvl <= currentLevel ? '#fbbf24' : 'rgba(255, 255, 255, 0.15)',
                          padding: '2px',
                          transition: 'transform 0.1s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <Star size={18} fill={lvl <= currentLevel ? '#fbbf24' : 'transparent'} />
                      </button>
                    ))}
                  </div>

                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: currentLevel > 0 ? '#fbbf24' : 'var(--text-muted)' }}>
                    {currentLevel > 0 ? `Lvl ${currentLevel} / 5` : 'Not Rated'}
                  </span>
                </div>

                {/* Level Slider Bar */}
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={currentLevel}
                  onChange={(e) => handleRatingChange(skill.id, Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#fbbf24' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Preferences, Availability & Save */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock color="#38bdf8" size={20} /> Availability & Interests
          </h3>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Weekly Dedication</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>{hoursPerWeek} hrs/week</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8' }}
            />
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Heart color="#f43f5e" size={16} /> Domain Preferences
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {commonInterests.map((item) => {
                const isSelected = interests.toLowerCase().includes(item.toLowerCase());
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleInterestToggle(item)}
                    className="badge"
                    style={{
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? '#f43f5e' : 'var(--border-color)',
                      background: isSelected ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#fda4af' : 'var(--text-secondary)',
                      padding: '5px 10px',
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="Or custom: Cloud, IoT, Web3"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Professional Bio</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="Tell teammates and mentors about your passions..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {successMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#34d399',
              fontSize: '0.825rem',
              marginBottom: '14px',
            }}>
              <CheckCircle size={16} /> {successMessage}
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Skill Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
