import Message from "./Message";

const PRIORITIES = ["Low", "Medium", "High"];

export default function StudentComplaintSection({
  complaintForm,
  complaintMessage,
  categories,
  onComplaintChange,
  onComplaintSubmit,
}) {
  return (
    <section className="view active">
      <article className="panel" style={{ padding: 18 }}>
        <h3>Submit New Complaint</h3>
        <p className="muted">
          Describe the issue clearly so the correct department can respond
          quickly.
        </p>
        <form className="form-grid" onSubmit={onComplaintSubmit} noValidate>
          <div>
            <Message message={complaintMessage} />
          </div>

          <div className="field">
            <label htmlFor="title">Issue Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={complaintForm.title}
              onChange={onComplaintChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={complaintForm.category}
              onChange={onComplaintChange}
              required
            >
              {categories.map((category) => (
                <option value={category.name} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="Dorm Block C, Lab 3, etc."
              value={complaintForm.location}
              onChange={onComplaintChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={complaintForm.priority}
              onChange={onComplaintChange}
              required
            >
              {PRIORITIES.map((priority) => (
                <option value={priority} key={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={complaintForm.description}
              onChange={onComplaintChange}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Submit Complaint
          </button>
        </form>
      </article>
    </section>
  );
}
