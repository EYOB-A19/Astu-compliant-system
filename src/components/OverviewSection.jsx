import { formatDate, statusTagClass } from "../lib/storage";

export default function OverviewSection({
  recentTickets,
  categoryDistribution,
}) {
  return (
    <section className="view active">
      <div className="split">
        <article className="panel" style={{ padding: 16 }}>
          <h3>Recent Tickets</h3>
          <p className="muted">
            Latest complaints and current progress at a glance.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.length ? (
                  recentTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.id}</td>
                      <td>{ticket.title}</td>
                      <td>{ticket.category}</td>
                      <td>
                        <span className={statusTagClass(ticket.status)}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>{formatDate(ticket.updatedAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="muted">
                      No tickets yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel" style={{ padding: 16 }}>
          <h3>Category Distribution</h3>
          <p className="muted">Issue volume by category.</p>
          {categoryDistribution.entries.length ? (
            <div className="bar-list">
              {categoryDistribution.entries.map(([category, count]) => {
                const width = Math.max(
                  10,
                  Math.round((count / (categoryDistribution.max || 1)) * 100),
                );
                return (
                  <div className="bar-item" key={category}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <strong>{category}</strong>
                      <span className="muted">{count}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty">No category data yet.</div>
          )}
        </article>
      </div>
    </section>
  );
}
