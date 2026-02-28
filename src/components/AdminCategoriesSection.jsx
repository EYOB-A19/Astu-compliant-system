import { DEPARTMENTS } from "../lib/storage";
import Message from "./Message";

export default function AdminCategoriesSection({
  categories,
  addCategoryForm,
  addCategoryMessage,
  onAddCategoryChange,
  onAddCategorySubmit,
}) {
  return (
    <section className="view active">
      <article className="panel" style={{ padding: 16, marginBottom: 14 }}>
        <h3>Category Management</h3>
        <p className="muted">Maintain issue categories and department assignments.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Assigned Department</th>
              </tr>
            </thead>
            <tbody>
              {categories.length ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.department}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="muted">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel" style={{ padding: 16 }}>
        <h3>Add Category</h3>
        <form className="form-grid" onSubmit={onAddCategorySubmit} noValidate>
          <div>
            <Message message={addCategoryMessage} />
          </div>

          <div className="field">
            <label htmlFor="newCategory">Category Name</label>
            <input
              id="newCategory"
              name="name"
              type="text"
              value={addCategoryForm.name}
              onChange={onAddCategoryChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="newCategoryDepartment">Department</label>
            <select
              id="newCategoryDepartment"
              name="department"
              value={addCategoryForm.department}
              onChange={onAddCategoryChange}
            >
              {DEPARTMENTS.map((department) => (
                <option value={department} key={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" type="submit">
            Add Category
          </button>
        </form>
      </article>
    </section>
  );
}
