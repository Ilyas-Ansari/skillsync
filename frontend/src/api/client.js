import axios from 'axios';

// In development, Vite proxies '/api' to 'http://localhost:8080/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const loginUser = (email, password) =>
  api.post('/api/auth/login', { email, password }).then((res) => res.data);

export const registerUser = (userData) =>
  api.post('/api/auth/register', userData).then((res) => res.data);

export const getUserById = (id) =>
  api.get(`/api/auth/users/${id}`).then((res) => res.data);

// Skills APIs
export const getAllSkills = () =>
  api.get('/api/skills').then((res) => res.data);

// Student APIs
export const getStudentProfile = (id) =>
  api.get(`/api/students/${id}/profile`).then((res) => res.data);

export const updateStudentProfile = (id, profileData) =>
  api.put(`/api/students/${id}/profile`, profileData).then((res) => res.data);

export const getStudentSkills = (id) =>
  api.get(`/api/students/${id}/skills`).then((res) => res.data);

export const updateStudentSkills = (id, skillsList) =>
  api.put(`/api/students/${id}/skills`, { skills: skillsList }).then((res) => res.data);

export const getRecommendedProjects = (studentId) =>
  api.get(`/api/projects/recommended/${studentId}`).then((res) => res.data);

// Projects APIs
export const getAllProjects = () =>
  api.get('/api/projects').then((res) => res.data);

export const getProjectById = (id) =>
  api.get(`/api/projects/${id}`).then((res) => res.data);

export const createProject = (projectData) =>
  api.post('/api/projects', projectData).then((res) => res.data);

// Teams APIs
export const getAllTeams = () =>
  api.get('/api/teams').then((res) => res.data);

export const generateTeams = () =>
  api.post('/api/teams/generate').then((res) => res.data);

export const getMyTeam = (studentId) =>
  api.get(`/api/teams/my-team/${studentId}`).then((res) => res.data);

// Mentor APIs
export const getAllMentors = () =>
  api.get('/api/mentors').then((res) => res.data);

export const getMentorshipMatrix = () =>
  api.get('/api/mentors/matrix').then((res) => res.data);

export const getMentorTeams = (mentorId) =>
  api.get(`/api/mentors/${mentorId}/teams`).then((res) => res.data);

// Admin APIs
export const getAdminStats = () =>
  api.get('/api/admin/stats').then((res) => res.data);

export const getAllUsers = () =>
  api.get('/api/admin/users').then((res) => res.data);
