import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, getUsers, setSession } from "../lib/storage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (getSession()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const roleFilter = form.role;

    if (!email || !password) {
      setMessage({ type: "error", text: "Email and password are required." });
      return;
    }

    const users = getUsers();
    const match = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (!match) {
      setMessage({ type: "error", text: "Invalid credentials." });
      return;
    }

    if (roleFilter && match.role !== roleFilter) {
      setMessage({ type: "error", text: "Role does not match this account." });
      return;
    }

    setSession({
      userId: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      department: match.department,
    });

    setMessage({
      type: "success",
      text: "Signed in successfully. Redirecting...",
    });
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 500);
  }

  return (
    <div className="auth-wrap">
      <div className="panel auth-card">
        <Link className="brand" to="/">
          <span className="brand-badge">AS</span>
          <span>ASTU Smart Complaint System</span>
        </Link>
        <h1>Welcome Back</h1>
        <p>Sign in to continue to your complaint management dashboard.</p>

        <form className="form-grid" onSubmit={onSubmit} noValidate>
          <div>
            {message.text ? (
              <p className={message.type === "error" ? "error" : "success"}>
                {message.text}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@astu.edu.et"
              required
              value={form.email}
              onChange={onChange}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
              value={form.password}
              onChange={onChange}
            />
          </div>

          <div className="field">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={onChange}>
              <option value="">Auto detect from account</option>
              <option value="student">Student</option>
              <option value="staff">Department Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit">
            Sign In
          </button>
        </form>

        <p className="muted">
          Demo accounts: <code>student@astu.edu / 123456</code>,{" "}
          <code>staff@astu.edu / 123456</code>,
          <code> admin@astu.edu / 123456</code>
        </p>
        <p className="muted">
          No account?{" "}
          <Link className="text-link" to="/signup">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
