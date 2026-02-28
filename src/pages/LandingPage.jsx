import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <Link className="brand" to="/">
            <span className="brand-badge">AS</span>
            <span>ASTU Smart Complaint System</span>
          </Link>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <Link to="/login">Sign In</Link>
            <Link className="btn btn-primary" to="/signup">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="kicker">Frontend Prototype (React)</span>
              <h1>
                Track campus complaints with visibility, speed, and
                accountability.
              </h1>
              <p className="lead">
                ASTU Smart Complaint and Issue Tracking System helps students
                submit issues, departments resolve them through ticket
                workflows, and administrators monitor outcomes using role-based
                dashboards.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/signup">
                  Create Account
                </Link>
                <Link className="btn btn-outline" to="/login">
                  Sign In to Dashboard
                </Link>
              </div>
            </div>
            <div className="panel hero-card">
              <h3>Common Campus Issues</h3>
              <p className="muted">
                Typical categories students report in one unified system.
              </p>
              <ul className="stats-list">
                <li className="stat-item">
                  <span>Dormitory Maintenance</span>
                  <strong>Housing</strong>
                </li>
                <li className="stat-item">
                  <span>Laboratory Equipment</span>
                  <strong>Academic Lab</strong>
                </li>
                <li className="stat-item">
                  <span>Internet Connectivity</span>
                  <strong>ICT Support</strong>
                </li>
                <li className="stat-item">
                  <span>Classroom Facility Damage</span>
                  <strong>Facility Office</strong>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="container">
            <h2>Core Features</h2>
            <p className="lead">
              Everything needed for a full complaint lifecycle, frontend only.
            </p>
            <div className="grid-3">
              <article className="panel feature">
                <h3>Ticket Submission</h3>
                <p>
                  Students submit complaints with category, location, priority,
                  and full detail.
                </p>
              </article>
              <article className="panel feature">
                <h3>Status Workflow</h3>
                <p>
                  Departments move tickets from Open to In Progress, Resolved,
                  and Closed.
                </p>
              </article>
              <article className="panel feature">
                <h3>Analytics and Monitoring</h3>
                <p>
                  Admins get overview cards, category trends, and department
                  performance insights.
                </p>
              </article>
              <article className="panel feature">
                <h3>Role-Based Dashboards</h3>
                <p>
                  Students, staff, and admins each see interfaces matched to
                  responsibilities.
                </p>
              </article>
              <article className="panel feature">
                <h3>Complaint History</h3>
                <p>
                  Searchable tables show previous tickets, latest remarks, and
                  timestamps.
                </p>
              </article>
              <article className="panel feature">
                <h3>AI Chatbot Help</h3>
                <p>
                  A built-in assistant provides quick guidance before and after
                  submission.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="roles" className="section">
          <div className="container">
            <h2>System Roles</h2>
            <p className="lead">
              Clear accountability and transparency across every department.
            </p>
            <div className="role-row">
              <article className="panel role-card">
                <h3 className="role-title">Student</h3>
                <ul>
                  <li>Submit campus complaints in minutes</li>
                  <li>Track current ticket status live</li>
                  <li>Review complete complaint history</li>
                  <li>Ask the AI chatbot for help</li>
                </ul>
              </article>
              <article className="panel role-card">
                <h3 className="role-title">Department Staff</h3>
                <ul>
                  <li>View assigned complaint queue</li>
                  <li>Update status and processing notes</li>
                  <li>Add remarks for transparency</li>
                  <li>Prioritize high-impact issues</li>
                </ul>
              </article>
              <article className="panel role-card">
                <h3 className="role-title">Admin</h3>
                <ul>
                  <li>Oversee all complaints campus-wide</li>
                  <li>Manage users and issue categories</li>
                  <li>Monitor dashboard analytics</li>
                  <li>Track department resolution health</li>
                </ul>
              </article>
            </div>

            <div className="panel cta">
              <div>
                <h3>Ready to launch ASTU issue tracking?</h3>
                <p className="muted">
                  Use the frontend prototype to demo full workflows immediately.
                </p>
              </div>
              <Link className="btn btn-secondary" to="/signup">
                Open Prototype
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          ASTU Smart Complaint and Issue Tracking System - React Frontend
        </div>
      </footer>
    </>
  );
}
