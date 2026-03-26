import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell
} from 'recharts';
import { 
  LayoutDashboard, BookOpen, GraduationCap, TrendingUp, AlertCircle, 
  Search, Bell, User, Calculator, Download, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const SUBJECT_DATA = [
  { id: 1, name: 'Mathematics', score: 88, attendance: 92, credits: 4, history: [75, 80, 82, 85, 88] },
  { id: 2, name: 'Physics', score: 76, attendance: 85, credits: 4, history: [70, 72, 75, 78, 76] },
  { id: 3, name: 'Computer Science', score: 94, attendance: 98, credits: 3, history: [88, 90, 92, 93, 94] },
  { id: 4, name: 'English Literature', score: 82, attendance: 90, credits: 2, history: [80, 81, 82, 82, 82] },
  { id: 5, name: 'History', score: 65, attendance: 78, credits: 2, history: [60, 62, 65, 68, 65] },
  { id: 6, name: 'Chemistry', score: 45, attendance: 60, credits: 3, history: [50, 48, 46, 47, 45] },
];

const OVERALL_PROGRESS = [
  { month: 'Jan', gpa: 3.2 },
  { month: 'Feb', gpa: 3.4 },
  { month: 'Mar', gpa: 3.3 },
  { month: 'Apr', gpa: 3.6 },
  { month: 'May', gpa: 3.7 },
  { month: 'Jun', gpa: 3.8 },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showGPAProjector, setShowGPAProjector] = useState(false);

  // Logic: Calculate Overall GPA
  const calculateGPA = (subjects) => {
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const weightedSum = subjects.reduce((sum, s) => {
      // Conversion: 90+=4.0, 80+=3.5, 70+=3.0, 60+=2.5, 50+=2.0, <50=0
      let point = 0;
      if (s.score >= 90) point = 4.0;
      else if (s.score >= 80) point = 3.5;
      else if (s.score >= 70) point = 3.0;
      else if (s.score >= 60) point = 2.5;
      else if (s.score >= 50) point = 2.0;
      return sum + (point * s.credits);
    }, 0);
    return (weightedSum / totalCredits).toFixed(2);
  };

  const gpa = useMemo(() => calculateGPA(SUBJECT_DATA), []);
  const averageAttendance = useMemo(() => {
    const total = SUBJECT_DATA.reduce((sum, s) => sum + s.attendance, 0);
    return Math.round(total / SUBJECT_DATA.length);
  }, []);

  const weakSubjects = useMemo(() => 
    SUBJECT_DATA.filter(s => s.score < 60), []
  );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <GraduationCap size={32} />
          <span>EduFlow</span>
        </div>
        <nav>
          <ul className="nav-links">
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </li>
            <li className={`nav-item ${activeTab === 'subjects' ? 'active' : ''}`} onClick={() => setActiveTab('subjects')}>
              <BookOpen size={20} />
              <span>Subjects</span>
            </li>
            <li className={`nav-item ${activeTab === 'gpa' ? 'active' : ''}`} onClick={() => setActiveTab('gpa')}>
              <Calculator size={20} />
              <span>GPA Calculator</span>
            </li>
            <li className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>
              <TrendingUp size={20} />
              <span>Progress</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Welcome Back, Alex</h1>
              <p>Here's your academic performance at a glance.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={18} color="var(--text-secondary)" />
                <input type="text" placeholder="Search subjects..." style={{ background: 'none', border: 'none', color: 'white', outline: 'none' }} />
              </div>
              <div className="glass-card" style={{ padding: '0.75rem', borderRadius: '12px' }}>
                <Bell size={20} />
              </div>
              <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '12px' }}>
                <User size={20} />
                <span>Alex Johnson</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card">
            <div className="stat-item">
              <span className="stat-label">Current GPA</span>
              <span className="stat-value">{gpa} / 4.0</span>
              <span className="stat-trend trend-up"><TrendingUp size={14} /> +0.2 this semester</span>
            </div>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card">
            <div className="stat-item">
              <span className="stat-label">Attendance</span>
              <span className="stat-value">{averageAttendance}%</span>
              <span className="stat-trend trend-up"><TrendingUp size={14} /> Steady progress</span>
            </div>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card">
            <div className="stat-item">
              <span className="stat-label">Weak Subjects</span>
              <span className="stat-value" style={{ color: weakSubjects.length > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {weakSubjects.length} Found
              </span>
              <span className="stat-trend">{weakSubjects.length > 0 ? 'Requires attention' : 'All clear!'}</span>
            </div>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card">
            <div className="stat-item">
              <span className="stat-label">Credits Earned</span>
              <span className="stat-value">18 / 24</span>
              <span className="stat-trend">75% of semester goal</span>
            </div>
          </motion.div>
        </section>

        {/* Charts Section */}
        <section className="charts-grid">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card">
            <div className="chart-header">
              <h3 className="chart-title">Subject Performance</h3>
              <div className="glass-card" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer' }}>
                Current Semester
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBJECT_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Bar dataKey="score" radius={[10, 10, 0, 0]}>
                    {SUBJECT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score < 60 ? 'var(--accent-red)' : 'var(--accent-blue)'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card">
            <div className="chart-header">
              <h3 className="chart-title">GPA Progress</h3>
              <TrendingUp size={18} color="var(--accent-green)" />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={OVERALL_PROGRESS}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 4]} stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                  />
                  <Area type="monotone" dataKey="gpa" stroke="var(--accent-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>

        {/* Subject Listings */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.7 }}
          className="glass-card"
        >
          <div className="chart-header">
            <h3 className="chart-title">Detailed Subject Overview</h3>
            <button className="glass-card" style={{ padding: '0.4rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontWeight: 500, border: '1px solid var(--accent-blue)' }}>
              <Download size={16} /> Export CSV
            </button>
          </div>
          <div className="subject-list">
            <div className="list-header">
              <span>Subject Name</span>
              <span>Credits</span>
              <span>Attendance</span>
              <span>Current Score</span>
            </div>
            {SUBJECT_DATA.map((subject) => (
              <div key={subject.id} className="subject-row">
                <div className="subject-name">
                  {subject.score < 60 ? <AlertCircle size={18} style={{ color: 'var(--accent-red)' }} /> : <BookOpen size={18} color="var(--accent-blue)" />}
                  {subject.name}
                </div>
                <span>{subject.credits} Credits</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${subject.attendance}%`, height: '100%', background: subject.attendance > 80 ? 'var(--accent-green)' : 'var(--accent-blue)' }} />
                   </div>
                   <span>{subject.attendance}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${subject.score >= 80 ? 'badge-high' : subject.score >= 60 ? 'badge-medium' : 'badge-low'}`}>
                    {subject.score}%
                  </span>
                  <ChevronRight size={16} color="var(--text-secondary)" />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* GPA Calculator Section (Mini) */}
        {weakSubjects.length > 0 && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card"
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '320px', border: '1px solid var(--accent-red)', zIndex: 1000 }}
          >
            <div style={{ display: 'flex', gap: '1rem' }}>
              <AlertCircle color="var(--accent-red)" size={24} />
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Alert: Improvement Needed</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  You are tracking below 60% in {weakSubjects.length} subject(s).
                </p>
                <button style={{ marginTop: '0.75rem', background: 'var(--accent-red)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
                  View Study Plan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default App;
