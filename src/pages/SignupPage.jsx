import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DEPARTMENTS,
  getSession,
  getUsers,
  saveUsers,
  setSession,
  uid,
} from "../lib/storage";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
    department: "General",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (getSession()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const showDepartment = useMemo(() => form.role !== "student", [form.role]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "role" && value === "student") {
        next.department = "General";
      }
      return next;
    });
  }

  function onSubmit(event) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      department: form.role === "student" ? "General" : form.department,
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    if (!payload.name || !payload.email || !payload.role || !payload.password) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    if (payload.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      setMessage({
        type: "error",
        text: "Password confirmation does not match.",
      });
      return;
    }

    const users = getUsers();
    const exists = users.some((user) => user.email === payload.email);
    if (exists) {
      setMessage({
        type: "error",
        text: "An account with this email already exists.",
      });
      return;
    }

    const newUser = {
      id: uid("usr"),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      department: payload.department,
      password: payload.password,
    };

    users.push(newUser);
    saveUsers(users);

    setSession({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
    });

    setMessage({
      type: "success",
      text: "Account created. Redirecting to dashboard...",
    });
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 650);
  }

  return (
    <div className="auth-wrap">
      <div className="panel auth-card">
        <Link className="brand" to="/">
          <span className="brand-badge">AS</span>
          <span>ASTU Smart Complaint System</span>
        </Link>
        <h1>Create Account</h1>
        <p>Join the complaint tracking platform and access role-based tools.</p>

        <form className="form-grid" onSubmit={onSubmit} noValidate>
          <div>
            {message.text ? (
              <p className={message.type === "error" ? "error" : "success"}>
                {message.text}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={onChange}
            />
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
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={onChange}
              required
            >
              <option value="student">Student</option>
              <option value="staff">Department Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {showDepartment ? (
            <div className="field">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={onChange}
              >
                {DEPARTMENTS.map((department) => (
                  <option value={department} key={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              required
              value={form.password}
              onChange={onChange}
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={onChange}
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Create Account
          </button>
        </form>

        <p className="muted">
          Already have an account?{" "}
          <Link className="text-link" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
