import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EchoStack from '../components/EchoStack';
import { ArrowRight, Layers, Target, Zap, Users, BarChart3, Shield } from 'lucide-react';

export default function Landing() {
  return (
    <>
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="hero fade-in" id="hero">
        <EchoStack text="TASK FORGE" />
        <p className="hero__sub">
          Precision project management for teams that move fast. Organize,
          collaborate, and deliver — with clarity.
        </p>
        <div className="hero__actions">
          <Link to="/signup" className="btn-primary">Start Free</Link>
          <a href="#philosophy" className="btn-outline">Learn More</a>
        </div>
      </section>

      <div className="divider"></div>

      {/* ─── PHILOSOPHY ─── */}
      <section className="philosophy" id="philosophy">
        <h2 className="philosophy__quote slide-up">
          Built for teams who believe <em>great work</em> deserves great tools.
        </h2>
        <div className="philosophy__grid">
          <div className="philosophy__col">
            <h3>Clarity First</h3>
            <p>
              Every project, task, and deadline is visible at a glance. No
              clutter, no confusion — just the information you need, when you
              need it.
            </p>
          </div>
          <div className="philosophy__col">
            <h3>Team Synergy</h3>
            <p>
              Assign, track, and collaborate in real time. Role-based access
              ensures everyone sees exactly what matters to them.
            </p>
          </div>
          <div className="philosophy__col">
            <h3>Relentless Focus</h3>
            <p>
              Kanban boards, priority tags, and smart dashboards keep your team
              aligned and shipping without distraction.
            </p>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* ─── SHOWCASE GRID ─── */}
      <section className="showcase" id="showcase">
        <div className="showcase__grid">
          <div className="showcase__card showcase__card--large">
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'linear-gradient(135deg, #e0e0e0, #c8c8c8)',
              fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.04em'
            }}>
              Dashboard Analytics
            </div>
          </div>
          <div className="showcase__card showcase__card--pill">
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'linear-gradient(180deg, #d4d4d4, #b8b8b8)',
              fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700,
              color: 'var(--text)', letterSpacing: '-0.03em', writingMode: 'vertical-lr'
            }}>
              KANBAN
            </div>
            <div className="pill-overlay">View</div>
          </div>
          <div className="showcase__card showcase__card--circle">
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'linear-gradient(135deg, #ccc, #aaa)',
              fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700,
              color: 'var(--text)', letterSpacing: '-0.03em'
            }}>
              TEAM
            </div>
          </div>
          <div className="showcase__card showcase__card--wide">
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'linear-gradient(135deg, #d9d9d9, #bfbfbf)',
              fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,40px)',
              fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.04em'
            }}>
              Project Timelines
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* ─── SERVICES ─── */}
      <section className="services" id="services">
        <h2 className="services__heading">What Task Forge Delivers</h2>
        <div className="services__grid">
          {[
            { icon: <Layers size={24} />, title: 'Project Management', desc: 'Create, organize, and track projects with deadlines and team assignments. Full lifecycle management from inception to completion.' },
            { icon: <Target size={24} />, title: 'Task Tracking', desc: 'Break projects into actionable tasks. Assign priorities, set due dates, and move items through your custom workflow.' },
            { icon: <Users size={24} />, title: 'Team Collaboration', desc: 'Role-based access for admins and members. Add team members to projects and assign tasks with precision.' },
            { icon: <BarChart3 size={24} />, title: 'Smart Dashboard', desc: 'Real-time analytics and insights. See project health, task distribution, and team performance at a glance.' },
            { icon: <Zap size={24} />, title: 'Kanban Boards', desc: 'Visualize your workflow with drag-and-drop Kanban boards. Move tasks between todo, in-progress, and completed.' },
            { icon: <Shield size={24} />, title: 'Secure & Reliable', desc: 'JWT authentication, role-based authorization, and encrypted data. Your work is protected at every level.' },
          ].map((s, i) => (
            <div className="service-card" key={i}>
              <div className="service-card__icon">{s.icon}</div>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__text">{s.desc}</p>
              <span className="service-card__cta">
                Learn More <ArrowRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
