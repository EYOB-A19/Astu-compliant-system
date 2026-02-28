import { DEPARTMENTS, mapRoleLabel } from "../lib/storage";
import Message from "./Message";

export default function AdminUsersSection({
  users,
  addUserForm,
  addUserMessage,
  onAddUserChange,
  onAddUserSubmit,
}) {
  return (
    <section className="view active">
      <article className="panel" style={{ padding: 16, marginBottom: 14 }}>
        <h3>User Management</h3>
        <p className="muted">Manage students, staff, and admin profiles.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{mapRoleLabel(user.role)}</td>
                    <td>{user.department || "General"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel" style={{ padding: 16 }}>
        <h3>Add User</h3>
        <form className="form-grid" onSubmit={onAddUserSubmit} noValidate>
          <div>
            <Message message={addUserMessage} />
          </div>

          <div className="field">
            <label htmlFor="newUserName">Name</label>
            <input
              id="newUserName"
              name="name"
              type="text"
              value={addUserForm.name}
              onChange={onAddUserChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="newUserEmail">Email</label>
            <input
              id="newUserEmail"
              name="email"
              type="email"
              value={addUserForm.email}
              onChange={onAddUserChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="newUserRole">Role</label>
            <select
              id="newUserRole"
              name="role"
              value={addUserForm.role}
              onChange={onAddUserChange}
            >
              <option value="student">Student</option>
              <option value="staff">Department Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="newUserDepartment">Department</label>
            <select
              id="newUserDepartment"
              name="department"
              value={addUserForm.department}
              onChange={onAddUserChange}
              disabled={addUserForm.role === "student"}
            >
              {DEPARTMENTS.map((department) => (
                <option value={department} key={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="newUserPassword">Temporary Password</label>
            <input
              id="newUserPassword"
              name="password"
              type="password"
              value={addUserForm.password}
              onChange={onAddUserChange}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Add User
          </button>
        </form>
      </article>
    </section>
  );
}
