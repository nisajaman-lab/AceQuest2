import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import {
  Shield,
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Trash2,
  Plus,
  RefreshCw,
  Pencil,
  Layers3,
  Award,
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function AdminDashboardPage({ view = 'overview' }) {
  const { getAuthHeader } = useGameStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(view === 'subjects' ? 'content' : view);
  const [loading, setLoading] = useState(true);

  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [logs, setLogs] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedChId, setSelectedChId] = useState('');

  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('multiple_choice');
  const [difficulty, setDifficulty] = useState('medium');
  const [hint, setHint] = useState('');
  const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [shortAnswers, setShortAnswers] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role_id: '1' });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    realm_name: '',
    description: '',
    icon_url: '',
    is_active: true,
  });
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [chapterForm, setChapterForm] = useState({
    subject_id: '',
    chapter_number: '',
    title: '',
    description: '',
    map_tileset_key: '',
    is_active: true,
  });
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [badgeForm, setBadgeForm] = useState({
    name: '',
    description: '',
    icon_url: '',
    badge_type: '',
    condition_key: '',
  });
  const [editingBadgeId, setEditingBadgeId] = useState(null);

  useEffect(() => {
    const mappedView = view === 'subjects' ? 'content' : view;
    setActiveTab(mappedView);
  }, [view]);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  useEffect(() => {
    if (!selectedSubId) {
      setChapters([]);
      return;
    }
    const fetchChapters = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/game/subjects/${selectedSubId}/chapters`, {
          headers: getAuthHeader(),
        });
        setChapters(res.data);
      } catch (err) {
        console.error('Failed to load chapters for admin', err);
      }
    };
    fetchChapters();
  }, [selectedSubId, getAuthHeader]);

  useEffect(() => {
    if (!selectedChId) {
      setQuestions([]);
      return;
    }
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/questions?chapter_id=${selectedChId}`, {
          headers: getAuthHeader(),
        });
        setQuestions(res.data);
      } catch (err) {
        console.error('Failed to load questions list', err);
      }
    };
    fetchQuestions();
  }, [selectedChId, getAuthHeader]);

  useEffect(() => {
    if (activeTab === 'content') {
      loadContent();
    }
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview' || activeTab === 'analytics') {
        const res = await axios.get(`${API_BASE}/api/admin/analytics/overview`, {
          headers: getAuthHeader(),
        });
        setOverview(res.data);
      } else if (activeTab === 'users') {
        const res = await axios.get(`${API_BASE}/api/admin/users`, {
          headers: getAuthHeader(),
        });
        setUsers(res.data);
      } else if (activeTab === 'questions') {
        const subRes = await axios.get(`${API_BASE}/api/game/subjects`);
        setSubjects(subRes.data);
      } else if (activeTab === 'logs') {
        const res = await axios.get(`${API_BASE}/api/admin/logs`, {
          headers: getAuthHeader(),
        });
        setLogs(res.data);
      } else if (activeTab === 'badges') {
        const res = await axios.get(`${API_BASE}/api/admin/badges`, {
          headers: getAuthHeader(),
        });
        setBadges(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin dashboard details', err);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    try {
      const [subjectRes, chapterRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/subjects`, { headers: getAuthHeader() }),
        axios.get(`${API_BASE}/api/admin/chapters`, { headers: getAuthHeader() }),
      ]);
      setSubjects(subjectRes.data);
      setChapters(chapterRes.data);
      if (subjectRes.data.length) {
        setSelectedSubId(String(subjectRes.data[0].id));
      }
    } catch (err) {
      console.error('Failed to load content management data', err);
    }
  };

  const handleUpdateRole = async (userId, roleId) => {
    try {
      await axios.put(
        `${API_BASE}/api/admin/users/${userId}`,
        { role_id: parseInt(roleId, 10) },
        { headers: getAuthHeader() }
      );
      alert('Role updated successfully!');
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Error updating user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this agent? This action is irreversible.')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/users/${userId}`, { headers: getAuthHeader() });
      alert('User deleted!');
      fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Error deleting user.');
    }
  };

  const handleAddQuestion = async (event) => {
    event.preventDefault();
    if (!selectedChId || !qText.trim()) return;

    const body = {
      chapter_id: parseInt(selectedChId, 10),
      question_text: qText,
      question_type: qType,
      difficulty,
      hint: hint.trim() || null,
    };

    if (['multiple_choice', 'true_false'].includes(qType)) {
      body.options = qType === 'true_false' ? ['True', 'False'] : mcqOptions.filter((option) => option.trim());
      body.correct_option_index = qType === 'true_false' ? correctOptionIdx : parseInt(correctOptionIdx, 10);
    } else {
      body.accepted_answers = shortAnswers
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }

    try {
      if (editingQuestionId) {
        await axios.put(`${API_BASE}/api/admin/questions/${editingQuestionId}`, body, { headers: getAuthHeader() });
      } else {
        await axios.post(`${API_BASE}/api/admin/questions`, body, { headers: getAuthHeader() });
      }
      resetQuestionForm();
      alert(editingQuestionId ? 'Question updated successfully!' : 'Question created successfully!');
      const res = await axios.get(`${API_BASE}/api/admin/questions?chapter_id=${selectedChId}`, {
        headers: getAuthHeader(),
      });
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      alert('Error creating question.');
    }
  };

  const resetQuestionForm = () => {
    setEditingQuestionId(null);
    setQText('');
    setQType('multiple_choice');
    setDifficulty('medium');
    setHint('');
    setMcqOptions(['', '', '', '']);
    setCorrectOptionIdx(0);
    setShortAnswers('');
  };

  const handleQuestionEdit = async (question) => {
    setEditingQuestionId(question.id);
    setQText(question.question_text);
    setQType(question.question_type);
    setDifficulty(question.difficulty);
    setHint(question.hint || '');
    if (['multiple_choice', 'true_false'].includes(question.question_type)) {
      const options = question.options.map((option) => option.option_text);
      setMcqOptions(question.question_type === 'multiple_choice' ? [...options, ...Array(Math.max(0, 4 - options.length)).fill('')] : ['', '', '', '']);
      const correctIndex = question.options.findIndex((option) => option.is_correct);
      setCorrectOptionIdx(correctIndex >= 0 ? correctIndex : 0);
    } else {
      setShortAnswers(question.accepted_answers.map((answer) => answer.answer_text).join(', '));
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/questions/${qId}`, { headers: getAuthHeader() });
      alert('Question deleted!');
      const res = await axios.get(`${API_BASE}/api/admin/questions?chapter_id=${selectedChId}`, {
        headers: getAuthHeader(),
      });
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/admin/users`, { ...newUser, role_id: Number(newUser.role_id) }, { headers: getAuthHeader() });
      setNewUser({ username: '', email: '', password: '', role_id: '1' });
      fetchAdminData();
      alert('User created successfully.');
    } catch (err) {
      alert(err.response?.data?.detail || 'Unable to create user.');
    }
  };

  const resetSubjectForm = () => {
    setSubjectForm({ name: '', realm_name: '', description: '', icon_url: '', is_active: true });
    setEditingSubjectId(null);
  };

  const resetChapterForm = () => {
    setChapterForm({ subject_id: selectedSubId || '', chapter_number: '', title: '', description: '', map_tileset_key: '', is_active: true });
    setEditingChapterId(null);
  };

  const resetBadgeForm = () => {
    setBadgeForm({ name: '', description: '', icon_url: '', badge_type: '', condition_key: '' });
    setEditingBadgeId(null);
  };

  const handleTabChange = (tab, route) => {
    setActiveTab(tab);
    if (route) navigate(route);
  };

  const handleSubjectSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingSubjectId) {
        await axios.put(`${API_BASE}/api/admin/subjects/${editingSubjectId}`, subjectForm, {
          headers: getAuthHeader(),
        });
      } else {
        await axios.post(`${API_BASE}/api/admin/subjects`, subjectForm, {
          headers: getAuthHeader(),
        });
      }
      resetSubjectForm();
      loadContent();
      alert(editingSubjectId ? 'Subject updated.' : 'Subject created.');
    } catch (err) {
      console.error(err);
      alert('Unable to save subject.');
    }
  };

  const handleSubjectEdit = (subject) => {
    setEditingSubjectId(subject.id);
    setSubjectForm({
      name: subject.name,
      realm_name: subject.realm_name || '',
      description: subject.description || '',
      icon_url: subject.icon_url || '',
      is_active: subject.is_active,
    });
  };

  const handleSubjectDelete = async (subjectId) => {
    if (!window.confirm('Delete this subject and every linked chapter?')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/subjects/${subjectId}`, { headers: getAuthHeader() });
      loadContent();
    } catch (err) {
      console.error(err);
      alert('Unable to delete subject.');
    }
  };

  const handleChapterSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingChapterId) {
        await axios.put(`${API_BASE}/api/admin/chapters/${editingChapterId}`, chapterForm, {
          headers: getAuthHeader(),
        });
      } else {
        await axios.post(`${API_BASE}/api/admin/chapters`, chapterForm, {
          headers: getAuthHeader(),
        });
      }
      resetChapterForm();
      loadContent();
      alert(editingChapterId ? 'Chapter updated.' : 'Chapter created.');
    } catch (err) {
      console.error(err);
      alert('Unable to save chapter.');
    }
  };

  const handleChapterEdit = (chapter) => {
    setEditingChapterId(chapter.id);
    setChapterForm({
      subject_id: chapter.subject_id,
      chapter_number: chapter.chapter_number,
      title: chapter.title,
      description: chapter.description || '',
      map_tileset_key: chapter.map_tileset_key || '',
      is_active: chapter.is_active,
    });
  };

  const handleChapterDelete = async (chapterId) => {
    if (!window.confirm('Delete this chapter and all linked questions?')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/chapters/${chapterId}`, { headers: getAuthHeader() });
      loadContent();
    } catch (err) {
      console.error(err);
      alert('Unable to delete chapter.');
    }
  };

  const handleBadgeSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingBadgeId) {
        await axios.put(`${API_BASE}/api/admin/badges/${editingBadgeId}`, badgeForm, {
          headers: getAuthHeader(),
        });
      } else {
        await axios.post(`${API_BASE}/api/admin/badges`, badgeForm, {
          headers: getAuthHeader(),
        });
      }
      resetBadgeForm();
      const res = await axios.get(`${API_BASE}/api/admin/badges`, { headers: getAuthHeader() });
      setBadges(res.data);
      alert(editingBadgeId ? 'Badge updated.' : 'Badge created.');
    } catch (err) {
      console.error(err);
      alert('Unable to save badge.');
    }
  };

  const handleBadgeEdit = (badge) => {
    setEditingBadgeId(badge.id);
    setBadgeForm({
      name: badge.name,
      description: badge.description || '',
      icon_url: badge.icon_url || '',
      badge_type: badge.badge_type || '',
      condition_key: badge.condition_key || '',
    });
  };

  const handleBadgeDelete = async (badgeId) => {
    if (!window.confirm('Delete this badge?')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/badges/${badgeId}`, { headers: getAuthHeader() });
      const res = await axios.get(`${API_BASE}/api/admin/badges`, { headers: getAuthHeader() });
      setBadges(res.data);
    } catch (err) {
      console.error(err);
      alert('Unable to delete badge.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative">
      <div className="absolute inset-0 digital-grid opacity-10 pointer-events-none"></div>

      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 glow-teal animate-float">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide uppercase">ADMIN COMMAND CENTER</h2>
            <p className="text-sm text-slate-400 mt-1">Manage users, curriculum, questions, and audit activity from one control panel.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap border-b border-slate-800">
        <button onClick={() => handleTabChange('overview', '/admin')} className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'overview' ? 'border-teal text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <BarChart3 className="w-4 h-4" /> Overview
        </button>
        <button onClick={() => handleTabChange('users', '/admin/users')} className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'users' ? 'border-teal text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <Users className="w-4 h-4" /> User Base
        </button>
        <button onClick={() => handleTabChange('questions', '/admin/questions')} className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'questions' ? 'border-teal text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <BookOpen className="w-4 h-4" /> Question Bank
        </button>
        <button onClick={() => handleTabChange('content', '/admin/subjects')} className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'content' ? 'border-teal text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <Layers3 className="w-4 h-4" /> Content Control
        </button>
        <button onClick={() => handleTabChange('analytics', '/admin/analytics')} className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'analytics' ? 'border-teal text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <BarChart3 className="w-4 h-4" /> Analytics
        </button>
        <button onClick={() => handleTabChange('badges', '/admin/badges')} className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'badges' ? 'border-teal text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <Award className="w-4 h-4" /> Badges
        </button>
        <button onClick={() => handleTabChange('logs', '/admin/logs')} className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'logs' ? 'border-teal text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
          <FileText className="w-4 h-4" /> Audit Logs
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm text-slate-500">Syncing admin database files...</div>
      ) : (
        <div className="space-y-8">
          {activeTab === 'overview' && overview && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 uppercase font-extrabold tracking-wider">Total Agents</div>
                  <div className="text-3xl font-black text-white mt-1">{overview.total_users}</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 uppercase font-extrabold tracking-wider">Total Questions</div>
                  <div className="text-3xl font-black text-white mt-1">{overview.total_questions}</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 uppercase font-extrabold tracking-wider">Decryption Attempts</div>
                  <div className="text-3xl font-black text-white mt-1">{overview.total_attempts}</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 uppercase font-extrabold tracking-wider">Overall Accuracy</div>
                  <div className="text-3xl font-black text-teal-light glow-text-teal mt-1">{overview.overall_accuracy}%</div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Realm Accuracy Index</h3>
                <div className="space-y-4">
                  {overview.subjects.map((sub) => (
                    <div key={sub.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-white">{sub.name} ({sub.realm})</span>
                        <span className="text-teal-light">{sub.accuracy}% ({sub.attempts} attempts)</span>
                      </div>
                      <div className="w-full h-2.5 bg-navy rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-teal transition-all duration-500 rounded-full glow-teal" style={{ width: `${sub.accuracy}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <form onSubmit={handleCreateUser} className="glass-panel p-5 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                <input required value={newUser.username} onChange={(event) => setNewUser({ ...newUser, username: event.target.value })} placeholder="Username" className="bg-navy rounded-xl px-3 py-2.5 border border-slate-800 text-white text-sm" />
                <input required type="email" value={newUser.email} onChange={(event) => setNewUser({ ...newUser, email: event.target.value })} placeholder="Email" className="bg-navy rounded-xl px-3 py-2.5 border border-slate-800 text-white text-sm" />
                <input required type="password" minLength="6" value={newUser.password} onChange={(event) => setNewUser({ ...newUser, password: event.target.value })} placeholder="Temporary password" className="bg-navy rounded-xl px-3 py-2.5 border border-slate-800 text-white text-sm" />
                <select value={newUser.role_id} onChange={(event) => setNewUser({ ...newUser, role_id: event.target.value })} className="bg-navy rounded-xl px-3 py-2.5 border border-slate-800 text-white text-sm"><option value="1">Student</option><option value="2">Teacher</option></select>
                <button type="submit" className="py-2.5 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl text-sm">ADD USER</button>
              </form>
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-850 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <th className="py-4 px-6">Username</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Auth Role</th>
                    <th className="py-4 px-6 text-center">Level (EXP)</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-850/40 text-sm">
                      <td className="py-4 px-6 font-bold text-white">{user.username}</td>
                      <td className="py-4 px-6 font-mono text-slate-400 text-xs">{user.email}</td>
                      <td className="py-4 px-6">
                        <select value={user.role_id} onChange={(event) => handleUpdateRole(user.id, event.target.value)} className="bg-navy rounded px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-teal text-xs font-semibold text-slate-300">
                          <option value="1">Student</option>
                          <option value="2">Teacher</option>
                          <option value="3">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-mono text-xs font-bold">LVL {user.profile?.level || 1} ({user.profile?.total_exp || 0})</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 rounded hover:bg-crimson/10 text-slate-400 hover:text-crimson transition-colors" title="Delete User">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4.5 h-4.5 text-teal" /> Compile Question File
                </h3>
                <form onSubmit={handleAddQuestion} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Target Subject</label>
                    <select value={selectedSubId} onChange={(event) => { setSelectedSubId(event.target.value); setSelectedChId(''); }} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white shadow-inner" required>
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Target Chapter</label>
                    <select value={selectedChId} onChange={(event) => setSelectedChId(event.target.value)} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white shadow-inner" disabled={!selectedSubId} required>
                      <option value="">Select Chapter</option>
                      {chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>Ch {chapter.chapter_number}: {chapter.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Question Text</label>
                    <textarea placeholder="Type the question content here..." value={qText} onChange={(event) => setQText(event.target.value)} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white font-medium shadow-inner h-20" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase tracking-wider">Format</label>
                      <select value={qType} onChange={(event) => setQType(event.target.value)} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white shadow-inner">
                        <option value="multiple_choice">MCQ</option>
                        <option value="true_false">True / False</option>
                        <option value="short_answer">Short Answer</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase tracking-wider">Difficulty</label>
                      <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white shadow-inner">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Hint Clue (Optional)</label>
                    <input type="text" placeholder="Optional question clue" value={hint} onChange={(event) => setHint(event.target.value)} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white font-medium shadow-inner" />
                  </div>
                  {qType === 'multiple_choice' && (
                    <div className="space-y-3 pt-2 border-t border-slate-800/60">
                      <label className="text-slate-400 uppercase tracking-wider block">MCQ Options (Mark correct radio)</label>
                      {mcqOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input type="radio" name="correct_option" checked={correctOptionIdx === index} onChange={() => setCorrectOptionIdx(index)} className="text-teal focus:ring-0 focus:outline-none bg-navy" />
                          <input type="text" placeholder={`Option ${index + 1}`} value={option} onChange={(event) => { const copy = [...mcqOptions]; copy[index] = event.target.value; setMcqOptions(copy); }} className="w-full bg-navy rounded-lg px-3 py-2 border border-slate-800 focus:outline-none focus:border-teal text-white text-xs font-semibold" required />
                        </div>
                      ))}
                    </div>
                  )}
                  {qType === 'true_false' && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                      <label className="text-slate-400 uppercase tracking-wider block">Correct Statement Value</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs text-white"><input type="radio" name="tf_correct" checked={correctOptionIdx === 0} onChange={() => setCorrectOptionIdx(0)} /> True</label>
                        <label className="flex items-center gap-1.5 text-xs text-white"><input type="radio" name="tf_correct" checked={correctOptionIdx === 1} onChange={() => setCorrectOptionIdx(1)} /> False</label>
                      </div>
                    </div>
                  )}
                  {qType === 'short_answer' && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                      <label className="text-slate-400 uppercase tracking-wider">Accepted Keys (Comma separated)</label>
                      <input type="text" placeholder="e.g. 5, x=5, x = 5" value={shortAnswers} onChange={(event) => setShortAnswers(event.target.value)} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white font-medium shadow-inner" required />
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 py-3 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 glow-teal">{editingQuestionId ? 'UPDATE QUESTION' : 'COMPILE QUESTION'}</button>
                    {editingQuestionId && <button type="button" onClick={resetQuestionForm} className="px-4 py-3 border border-slate-700 text-slate-300 rounded-xl font-bold">CANCEL</button>}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Compiled Questions Registry</h3>
                <p className="text-xs text-slate-400">Select a subject and chapter to view compiled questions list.</p>
                <div className="space-y-4 pt-2">
                  {questions.map((question) => (
                    <div key={question.id} className="p-4 rounded-xl border border-slate-855 bg-slate-900/10 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-850 text-slate-400 font-bold uppercase">{question.question_type.replace('_', ' ')}</span>
                          <span className="text-[10px] text-slate-500 font-bold">Difficulty: {question.difficulty}</span>
                        </div>
                        <p className="text-xs font-bold text-white leading-relaxed">{question.question_text}</p>
                        {question.hint && <p className="text-[10px] text-gold-light italic">Hint: {question.hint}</p>}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => handleQuestionEdit(question)} className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-light transition-colors" title="Edit Question"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteQuestion(question.id)} className="p-1.5 rounded hover:bg-crimson/15 text-slate-500 hover:text-crimson transition-colors" title="Delete Question"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && <div className="text-center text-xs text-slate-500 py-10">Select subject & chapter parameters or compile new questions.</div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && overview && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Player performance analytics</h3>
                <p className="text-sm text-slate-400 mt-2">Accuracy and participation by subject, based on every recorded question attempt.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800"><div className="text-xs text-slate-500 uppercase font-bold">Students</div><div className="text-3xl font-black text-white mt-1">{overview.total_students}</div><div className="text-xs text-slate-500 mt-1">{overview.total_teachers} teachers</div></div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800"><div className="text-xs text-slate-500 uppercase font-bold">Total attempts</div><div className="text-3xl font-black text-white mt-1">{overview.total_attempts}</div></div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-800"><div className="text-xs text-slate-500 uppercase font-bold">Accuracy</div><div className="text-3xl font-black text-teal-light mt-1">{overview.overall_accuracy}%</div></div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                {overview.subjects.map((sub) => <div key={sub.id} className="grid grid-cols-[minmax(0,1fr)_70px_100px] gap-4 items-center text-sm"><span className="font-semibold text-white">{sub.name}</span><span className="text-slate-400 text-right">{sub.attempts} attempts</span><span className="text-teal-light text-right font-bold">{sub.accuracy}%</span></div>)}
                {overview.subjects.length === 0 && <p className="text-slate-500 text-sm">No subject data is available yet.</p>}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-bold text-white uppercase tracking-wider">Subject Control</h3>
                  <button onClick={resetSubjectForm} className="text-xs text-teal-light">Reset</button>
                </div>
                <form onSubmit={handleSubjectSubmit} className="space-y-4 text-xs font-semibold text-slate-300">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Subject Name</label>
                    <input value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Realm</label>
                    <input value={subjectForm.realm_name} onChange={(event) => setSubjectForm({ ...subjectForm, realm_name: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea value={subjectForm.description} onChange={(event) => setSubjectForm({ ...subjectForm, description: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white h-24" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Icon URL</label>
                    <input value={subjectForm.icon_url} onChange={(event) => setSubjectForm({ ...subjectForm, icon_url: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={subjectForm.is_active} onChange={(event) => setSubjectForm({ ...subjectForm, is_active: event.target.checked })} /> Active
                  </label>
                  <button type="submit" className="w-full py-3 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 glow-teal">{editingSubjectId ? 'UPDATE SUBJECT' : 'CREATE SUBJECT'}</button>
                </form>
                <div className="space-y-3 pt-3 border-t border-slate-800/60">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{subject.name}</div>
                        <div className="text-[11px] text-slate-500">{subject.realm_name || 'No realm'}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleSubjectEdit(subject)} className="p-2 rounded hover:bg-slate-800 text-slate-400"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleSubjectDelete(subject.id)} className="p-2 rounded hover:bg-crimson/10 text-slate-400 hover:text-crimson"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-bold text-white uppercase tracking-wider">Chapter Control</h3>
                  <button onClick={resetChapterForm} className="text-xs text-teal-light">Reset</button>
                </div>
                <form onSubmit={handleChapterSubmit} className="space-y-4 text-xs font-semibold text-slate-300">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Subject</label>
                    <select value={chapterForm.subject_id} onChange={(event) => setChapterForm({ ...chapterForm, subject_id: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" required>
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Chapter Number</label>
                    <input type="number" value={chapterForm.chapter_number} onChange={(event) => setChapterForm({ ...chapterForm, chapter_number: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Title</label>
                    <input value={chapterForm.title} onChange={(event) => setChapterForm({ ...chapterForm, title: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea value={chapterForm.description} onChange={(event) => setChapterForm({ ...chapterForm, description: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white h-24" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Tileset Key</label>
                    <input value={chapterForm.map_tileset_key} onChange={(event) => setChapterForm({ ...chapterForm, map_tileset_key: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={chapterForm.is_active} onChange={(event) => setChapterForm({ ...chapterForm, is_active: event.target.checked })} /> Active
                  </label>
                  <button type="submit" className="w-full py-3 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 glow-teal">{editingChapterId ? 'UPDATE CHAPTER' : 'CREATE CHAPTER'}</button>
                </form>
                <div className="space-y-3 pt-3 border-t border-slate-800/60">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">Ch {chapter.chapter_number}: {chapter.title}</div>
                        <div className="text-[11px] text-slate-500">{chapter.description || 'No description'}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleChapterEdit(chapter)} className="p-2 rounded hover:bg-slate-800 text-slate-400"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleChapterDelete(chapter.id)} className="p-2 rounded hover:bg-crimson/10 text-slate-400 hover:text-crimson"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-bold text-white uppercase tracking-wider">Badge Control</h3>
                  <button onClick={resetBadgeForm} className="text-xs text-teal-light">Reset</button>
                </div>
                <form onSubmit={handleBadgeSubmit} className="space-y-4 text-xs font-semibold text-slate-300">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Badge Name</label>
                    <input value={badgeForm.name} onChange={(event) => setBadgeForm({ ...badgeForm, name: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea value={badgeForm.description} onChange={(event) => setBadgeForm({ ...badgeForm, description: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white h-24" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Icon URL</label>
                    <input value={badgeForm.icon_url} onChange={(event) => setBadgeForm({ ...badgeForm, icon_url: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Badge Type</label>
                    <input value={badgeForm.badge_type} onChange={(event) => setBadgeForm({ ...badgeForm, badge_type: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" placeholder="chapter, subject, achievement" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider">Condition Key</label>
                    <input value={badgeForm.condition_key} onChange={(event) => setBadgeForm({ ...badgeForm, condition_key: event.target.value })} className="w-full bg-navy rounded-xl px-4 py-3 border border-slate-800 focus:outline-none focus:border-teal text-white" placeholder="complete_chapter_1" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 glow-teal">{editingBadgeId ? 'UPDATE BADGE' : 'CREATE BADGE'}</button>
                </form>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Badge Registry</h3>
                <div className="space-y-3">
                  {badges.map((badge) => (
                    <div key={badge.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{badge.name}</div>
                        <div className="text-[11px] text-slate-500">{badge.badge_type || 'badge'} · {badge.condition_key || 'no condition'}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleBadgeEdit(badge)} className="p-2 rounded hover:bg-slate-800 text-slate-400"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleBadgeDelete(badge.id)} className="p-2 rounded hover:bg-crimson/10 text-slate-400 hover:text-crimson"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {badges.length === 0 && <div className="text-center text-xs text-slate-500 py-10">No badges created yet.</div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Admin action history logs</h3>
                <button onClick={fetchAdminData} className="p-2 rounded bg-navy hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Refresh Audit logs">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 font-mono text-xs">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 rounded-lg bg-navy/30 border border-slate-850 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-teal font-bold">{log.admin_username}</span>
                        <span className="text-slate-500">({log.action})</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">Table: <span className="text-slate-400">{log.target_table}</span> | ID: <span className="text-slate-400">{log.target_id}</span></div>
                      {log.details && <pre className="text-[10px] text-slate-500 mt-1 bg-slate-950 p-2 rounded max-w-xl overflow-x-auto">{JSON.stringify(log.details)}</pre>}
                    </div>
                    <div className="text-[10px] text-slate-500 text-right flex-shrink-0">{new Date(log.performed_at).toLocaleString()}</div>
                  </div>
                ))}
                {logs.length === 0 && <div className="text-center text-xs text-slate-500 py-10">No administrator actions logged.</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
