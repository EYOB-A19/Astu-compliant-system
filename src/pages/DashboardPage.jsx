import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  clearSession,
  generateTicketId,
  getCategories,
  getSession,
  getTickets,
  getUsers,
  getVisibleTickets,
  mapRoleLabel,
  nowISO,
  saveCategories,
  saveTickets,
  saveUsers,
  uid,
} from "../lib/storage";
import OverviewSection from "../components/OverviewSection";
import TicketsSection from "../components/TicketsSection";
import StudentComplaintSection from "../components/StudentComplaintSection";
import StudentChatSection from "../components/StudentChatSection";
import AdminUsersSection from "../components/AdminUsersSection";
import AdminCategoriesSection from "../components/AdminCategoriesSection";

function statusCounts(tickets) {
  return {
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === "Open").length,
    progress: tickets.filter((ticket) => ticket.status === "In Progress")
      .length,
    resolved: tickets.filter((ticket) => ticket.status === "Resolved").length,
    closed: tickets.filter((ticket) => ticket.status === "Closed").length,
  };
}

function botReply(input) {
  const lower = input.toLowerCase();
  if (lower.includes("internet") || lower.includes("wifi")) {
    return "Choose Internet Connectivity, include building and location details, and set priority based on impact.";
  }
  if (lower.includes("track") || lower.includes("status")) {
    return "Open the Tickets menu to see your complaint status and any remarks from department staff.";
  }
  if (lower.includes("urgent") || lower.includes("high")) {
    return "For urgent issues, select High priority and describe safety or service impact in the complaint.";
  }
  if (lower.includes("dorm") || lower.includes("maintenance")) {
    return "Dormitory complaints are routed to the Housing Office. Include block and room identifiers.";
  }
  return "Share the issue type, exact location, and urgency. I can help you pick category and priority.";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [session, setSessionState] = useState(() => getSession());
  const [tickets, setTickets] = useState(() => getTickets());
  const [users, setUsers] = useState(() => getUsers());
  const [categories, setCategories] = useState(() => getCategories());
  const [activeView, setActiveView] = useState("overview");
  const [ticketDrafts, setTicketDrafts] = useState({});

  const [complaintForm, setComplaintForm] = useState({
    title: "",
    category: "",
    location: "",
    priority: "Low",
    description: "",
  });
  const [complaintMessage, setComplaintMessage] = useState({
    type: "",
    text: "",
  });
  const [addUserForm, setAddUserForm] = useState({
    name: "",
    email: "",
    role: "student",
    department: "General",
    password: "",
  });
  const [addUserMessage, setAddUserMessage] = useState({ type: "", text: "" });
  const [addCategoryForm, setAddCategoryForm] = useState({
    name: "",
    department: "General",
  });
  const [addCategoryMessage, setAddCategoryMessage] = useState({
    type: "",
    text: "",
  });
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      kind: "bot",
      text: "Hello. I can guide you on complaint submission, tracking, and escalation.",
    },
  ]);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      navigate("/login", { replace: true });
      return;
    }
    setSessionState(current);
  }, [navigate]);

  useEffect(() => {
    setComplaintForm((prev) => ({
      ...prev,
      category: categories[0]?.name || "",
    }));
  }, [categories]);

  const visibleTickets = useMemo(
    () => getVisibleTickets(tickets, session),
    [tickets, session],
  );

  useEffect(() => {
    const draftMap = {};
    visibleTickets.forEach((ticket) => {
      draftMap[ticket.id] = { status: ticket.status, remark: "" };
    });
    setTicketDrafts(draftMap);
  }, [visibleTickets]);

  const counts = useMemo(() => statusCounts(visibleTickets), [visibleTickets]);
  const recentTickets = useMemo(
    () =>
      [...visibleTickets]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
    [visibleTickets],
  );
  const categoryDistribution = useMemo(() => {
    const map = {};
    visibleTickets.forEach((ticket) => {
      map[ticket.category] = (map[ticket.category] || 0) + 1;
    });
    const entries = Object.entries(map);
    const max = entries.length
      ? Math.max(...entries.map((entry) => entry[1]))
      : 0;
    return { entries, max };
  }, [visibleTickets]);

  const metrics = useMemo(() => {
    if (!session) return [];
    if (session.role === "student") {
      return [
        { label: "Submitted", value: counts.total },
        { label: "Open", value: counts.open },
        { label: "In Progress", value: counts.progress },
        { label: "Resolved", value: counts.resolved + counts.closed },
      ];
    }
    if (session.role === "staff") {
      return [
        { label: "Assigned", value: counts.total },
        { label: "Open", value: counts.open },
        { label: "In Progress", value: counts.progress },
        { label: "Resolved", value: counts.resolved + counts.closed },
      ];
    }
    return [
      { label: "Total Tickets", value: counts.total },
      { label: "Open", value: counts.open },
      { label: "Resolved", value: counts.resolved + counts.closed },
      { label: "Total Users", value: users.length },
    ];
  }, [counts, users.length, session]);

  if (!session) return null;

  const isStudent = session.role === "student";
  const isStaff = session.role === "staff";
  const isAdmin = session.role === "admin";
  const allowTicketActions = isStaff || isAdmin;

  function persistTickets(next) {
    setTickets(next);
    saveTickets(next);
  }

  function onLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  function onTicketDraftChange(ticketId, field, value) {
    setTicketDrafts((prev) => ({
      ...prev,
      [ticketId]: { ...(prev[ticketId] || {}), [field]: value },
    }));
  }

  function onSaveTicket(ticketId) {
    const draft = ticketDrafts[ticketId] || {};
    const next = tickets.map((ticket) => {
      if (ticket.id !== ticketId) return ticket;
      const remarks = [...(ticket.remarks || [])];
      const remarkText = (draft.remark || "").trim();
      if (remarkText) {
        remarks.push({
          by: isAdmin ? "Admin" : session.department,
          text: remarkText,
          at: nowISO(),
        });
      }
      return {
        ...ticket,
        status: draft.status || ticket.status,
        remarks,
        updatedAt: nowISO(),
      };
    });
    persistTickets(next);
  }

  function onComplaintChange(event) {
    const { name, value } = event.target;
    setComplaintForm((prev) => ({ ...prev, [name]: value }));
  }

  function onComplaintSubmit(event) {
    event.preventDefault();
    const payload = {
      title: complaintForm.title.trim(),
      category: complaintForm.category,
      location: complaintForm.location.trim(),
      priority: complaintForm.priority,
      description: complaintForm.description.trim(),
    };
    if (
      !payload.title ||
      !payload.category ||
      !payload.location ||
      !payload.priority ||
      !payload.description
    ) {
      setComplaintMessage({
        type: "error",
        text: "Please complete all complaint fields.",
      });
      return;
    }
    const category = categories.find(
      (entry) => entry.name === payload.category,
    );
    const nextTicket = {
      id: generateTicketId(tickets),
      title: payload.title,
      category: payload.category,
      department: category?.department || "General",
      location: payload.location,
      priority: payload.priority,
      description: payload.description,
      status: "Open",
      studentId: session.userId,
      studentName: session.name,
      remarks: [],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    persistTickets([...tickets, nextTicket]);
    setComplaintForm({
      title: "",
      category: categories[0]?.name || "",
      location: "",
      priority: "Low",
      description: "",
    });
    setComplaintMessage({
      type: "success",
      text: "Complaint submitted successfully.",
    });
    setActiveView("tickets");
  }

  function onAddUserChange(event) {
    const { name, value } = event.target;
    setAddUserForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "role" && value === "student") next.department = "General";
      return next;
    });
  }

  function onAddUserSubmit(event) {
    event.preventDefault();
    const payload = {
      name: addUserForm.name.trim(),
      email: addUserForm.email.trim().toLowerCase(),
      role: addUserForm.role,
      department:
        addUserForm.role === "student" ? "General" : addUserForm.department,
      password: addUserForm.password,
    };
    if (!payload.name || !payload.email || !payload.role || !payload.password) {
      setAddUserMessage({ type: "error", text: "Fill all user fields." });
      return;
    }
    if (users.some((user) => user.email === payload.email)) {
      setAddUserMessage({
        type: "error",
        text: "User with this email already exists.",
      });
      return;
    }
    const nextUsers = [...users, { id: uid("usr"), ...payload }];
    setUsers(nextUsers);
    saveUsers(nextUsers);
    setAddUserForm({
      name: "",
      email: "",
      role: "student",
      department: "General",
      password: "",
    });
    setAddUserMessage({ type: "success", text: "User added successfully." });
  }

  function onAddCategoryChange(event) {
    const { name, value } = event.target;
    setAddCategoryForm((prev) => ({ ...prev, [name]: value }));
  }

  function onAddCategorySubmit(event) {
    event.preventDefault();
    const payload = {
      name: addCategoryForm.name.trim(),
      department: addCategoryForm.department,
    };
    if (!payload.name || !payload.department) {
      setAddCategoryMessage({
        type: "error",
        text: "Category and department are required.",
      });
      return;
    }
    if (
      categories.some(
        (category) =>
          category.name.toLowerCase() === payload.name.toLowerCase(),
      )
    ) {
      setAddCategoryMessage({
        type: "error",
        text: "Category already exists.",
      });
      return;
    }
    const nextCategories = [...categories, { id: uid("cat"), ...payload }];
    setCategories(nextCategories);
    saveCategories(nextCategories);
    setAddCategoryForm({ name: "", department: "General" });
    setAddCategoryMessage({
      type: "success",
      text: "Category added successfully.",
    });
  }

  function onChatSubmit(event) {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((prev) => [...prev, { kind: "user", text }]);
    setChatInput("");
    setTimeout(
      () =>
        setChatMessages((prev) => [
          ...prev,
          { kind: "bot", text: botReply(text) },
        ]),
      220,
    );
  }

  const welcomeMap = {
    student: "Submit complaints, track updates, and get AI assistance.",
    staff: "Manage assigned tickets and provide transparent progress updates.",
    admin: "Monitor all tickets, users, categories, and system performance.",
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-badge">AS</span>
          <span>ASTU System</span>
        </Link>
        <div className="user-pill">
          <strong>{session.name}</strong>
          <br />
          <small>{mapRoleLabel(session.role)}</small>
        </div>
        <nav className="menu">
          <button
            className={activeView === "overview" ? "active" : ""}
            onClick={() => setActiveView("overview")}
          >
            Overview
          </button>
          <button
            className={activeView === "tickets" ? "active" : ""}
            onClick={() => setActiveView("tickets")}
          >
            Tickets
          </button>
          {isStudent ? (
            <button
              className={activeView === "create-ticket" ? "active" : ""}
              onClick={() => setActiveView("create-ticket")}
            >
              Create Complaint
            </button>
          ) : null}
          {isStudent ? (
            <button
              className={activeView === "chatbot" ? "active" : ""}
              onClick={() => setActiveView("chatbot")}
            >
              AI Chatbot
            </button>
          ) : null}
          {isAdmin ? (
            <button
              className={activeView === "users" ? "active" : ""}
              onClick={() => setActiveView("users")}
            >
              Users
            </button>
          ) : null}
          {isAdmin ? (
            <button
              className={activeView === "categories" ? "active" : ""}
              onClick={() => setActiveView("categories")}
            >
              Categories
            </button>
          ) : null}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{mapRoleLabel(session.role)} Dashboard</h1>
            <p className="muted">{welcomeMap[session.role]}</p>
          </div>
          <div>
            <Link className="btn btn-outline" to="/">
              Home
            </Link>{" "}
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onLogout}
            >
              Log Out
            </button>
          </div>
        </header>

        <section className="card-grid">
          {metrics.map((metric) => (
            <article className="panel metric" key={metric.label}>
              <h3>{metric.label}</h3>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        {activeView === "overview" ? (
          <OverviewSection
            recentTickets={recentTickets}
            categoryDistribution={categoryDistribution}
          />
        ) : null}
        {activeView === "tickets" ? (
          <TicketsSection
            isStudent={isStudent}
            isStaff={isStaff}
            session={session}
            visibleTickets={visibleTickets}
            allowTicketActions={allowTicketActions}
            ticketDrafts={ticketDrafts}
            onTicketDraftChange={onTicketDraftChange}
            onSaveTicket={onSaveTicket}
          />
        ) : null}
        {isStudent && activeView === "create-ticket" ? (
          <StudentComplaintSection
            complaintForm={complaintForm}
            complaintMessage={complaintMessage}
            categories={categories}
            onComplaintChange={onComplaintChange}
            onComplaintSubmit={onComplaintSubmit}
          />
        ) : null}
        {isStudent && activeView === "chatbot" ? (
          <StudentChatSection
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            onChatSubmit={onChatSubmit}
          />
        ) : null}
        {isAdmin && activeView === "users" ? (
          <AdminUsersSection
            users={users}
            addUserForm={addUserForm}
            addUserMessage={addUserMessage}
            onAddUserChange={onAddUserChange}
            onAddUserSubmit={onAddUserSubmit}
          />
        ) : null}
        {isAdmin && activeView === "categories" ? (
          <AdminCategoriesSection
            categories={categories}
            addCategoryForm={addCategoryForm}
            addCategoryMessage={addCategoryMessage}
            onAddCategoryChange={onAddCategoryChange}
            onAddCategorySubmit={onAddCategorySubmit}
          />
        ) : null}
      </main>
    </div>
  );
}
