export const STORAGE_KEYS = {
  users: "astu_users",
  tickets: "astu_tickets",
  categories: "astu_categories",
  session: "astu_session",
};

export const DEPARTMENTS = [
  "General",
  "Housing Office",
  "ICT Support",
  "Lab Management",
  "Facility Office",
];

export function parseJSON(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function nowISO() {
  return new Date().toISOString();
}

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export function mapRoleLabel(role) {
  if (role === "student") return "Student";
  if (role === "staff") return "Department Staff";
  return "Admin";
}

export function statusTagClass(status) {
  if (status === "Open") return "tag tag-open";
  if (status === "In Progress") return "tag tag-progress";
  if (status === "Resolved") return "tag tag-resolved";
  if (status === "Closed") return "tag tag-closed";
  return "tag";
}

export function getUsers() {
  return parseJSON(localStorage.getItem(STORAGE_KEYS.users), []);
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export function getTickets() {
  return parseJSON(localStorage.getItem(STORAGE_KEYS.tickets), []);
}

export function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(tickets));
}

export function getCategories() {
  return parseJSON(localStorage.getItem(STORAGE_KEYS.categories), []);
}

export function saveCategories(categories) {
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
}

export function getSession() {
  return parseJSON(localStorage.getItem(STORAGE_KEYS.session), null);
}

export function setSession(session) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export function getVisibleTickets(tickets, session) {
  if (!session) return [];
  if (session.role === "admin") return tickets;
  if (session.role === "staff") {
    return tickets.filter((ticket) => ticket.department === session.department);
  }
  return tickets.filter((ticket) => ticket.studentId === session.userId);
}

export function generateTicketId(tickets) {
  const values = tickets
    .map((ticket) => {
      const match = String(ticket.id).match(/^TKT-(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .filter(Boolean);
  const max = values.length ? Math.max(...values) : 1000;
  return `TKT-${max + 1}`;
}

export function initializeData() {
  const categories = getCategories();
  if (!categories.length) {
    saveCategories([
      {
        id: uid("cat"),
        name: "Dormitory Maintenance",
        department: "Housing Office",
      },
      {
        id: uid("cat"),
        name: "Laboratory Equipment",
        department: "Lab Management",
      },
      {
        id: uid("cat"),
        name: "Internet Connectivity",
        department: "ICT Support",
      },
      {
        id: uid("cat"),
        name: "Classroom Facility Damage",
        department: "Facility Office",
      },
    ]);
  }

  const users = getUsers();
  if (!users.length) {
    saveUsers([
      {
        id: uid("usr"),
        name: "Student Demo",
        email: "student@astu.edu",
        role: "student",
        department: "General",
        password: "123456",
      },
      {
        id: uid("usr"),
        name: "Staff Demo",
        email: "staff@astu.edu",
        role: "staff",
        department: "ICT Support",
        password: "123456",
      },
      {
        id: uid("usr"),
        name: "Admin Demo",
        email: "admin@astu.edu",
        role: "admin",
        department: "General",
        password: "123456",
      },
    ]);
  }

  const tickets = getTickets();
  if (!tickets.length) {
    const seededUsers = getUsers();
    const student = seededUsers.find((user) => user.role === "student");
    const seededCategories = getCategories();
    const internetCategory = seededCategories.find(
      (cat) => cat.name === "Internet Connectivity",
    );
    const dormCategory = seededCategories.find(
      (cat) => cat.name === "Dormitory Maintenance",
    );

    saveTickets([
      {
        id: "TKT-1001",
        title: "Dorm shower leakage",
        category: dormCategory?.name || "Dormitory Maintenance",
        department: dormCategory?.department || "Housing Office",
        location: "Dorm Block B",
        priority: "High",
        description: "Continuous leak in shared shower area.",
        status: "In Progress",
        studentId: student?.id || "",
        studentName: student?.name || "Student",
        remarks: [
          {
            by: "Housing Office",
            text: "Maintenance team assigned.",
            at: nowISO(),
          },
        ],
        createdAt: nowISO(),
        updatedAt: nowISO(),
      },
      {
        id: "TKT-1002",
        title: "Unstable Wi-Fi in library",
        category: internetCategory?.name || "Internet Connectivity",
        department: internetCategory?.department || "ICT Support",
        location: "Main Library",
        priority: "Medium",
        description: "Connection drops every few minutes.",
        status: "Open",
        studentId: student?.id || "",
        studentName: student?.name || "Student",
        remarks: [],
        createdAt: nowISO(),
        updatedAt: nowISO(),
      },
    ]);
  }
}
