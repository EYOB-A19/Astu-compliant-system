import { statusTagClass } from "../lib/storage";

const TICKET_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];

export default function TicketsSection({
  isStudent,
  isStaff,
  session,
  visibleTickets,
  allowTicketActions,
  ticketDrafts,
  onTicketDraftChange,
  onSaveTicket,
}) {
  return (
    <section className="view active">
      <article className="panel" style={{ padding: 16 }}>
        <h3>
          {isStudent
            ? "My Complaint History"
            : isStaff
              ? `Assigned Department Tickets (${session.department})`
              : "All Campus Tickets"}
        </h3>
        <p className="muted">
          {isStudent
            ? "All complaints you submitted and their latest status."
            : isStaff
              ? "Tickets assigned to your department."
              : "Centralized view across every department."}
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Department</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleTickets.length ? (
                [...visibleTickets]
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map((ticket) => {
                    const latestRemark = ticket.remarks?.length
                      ? ticket.remarks[ticket.remarks.length - 1].text
                      : "-";
                    const draft = ticketDrafts[ticket.id] || {
                      status: ticket.status,
                      remark: "",
                    };
                    return (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.category}</td>
                        <td>{ticket.department}</td>
                        <td>
                          <span className={statusTagClass(ticket.status)}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>{ticket.priority}</td>
                        <td>{latestRemark}</td>
                        <td>
                          {allowTicketActions ? (
                            <div className="form-grid">
                              <select
                                value={draft.status}
                                onChange={(event) =>
                                  onTicketDraftChange(
                                    ticket.id,
                                    "status",
                                    event.target.value,
                                  )
                                }
                              >
                                {TICKET_STATUSES.map((status) => (
                                  <option value={status} key={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="text"
                                placeholder="Add remark"
                                value={draft.remark}
                                onChange={(event) =>
                                  onTicketDraftChange(
                                    ticket.id,
                                    "remark",
                                    event.target.value,
                                  )
                                }
                              />
                              <button
                                className="btn btn-outline"
                                type="button"
                                onClick={() => onSaveTicket(ticket.id)}
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={8} className="muted">
                    No ticket records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
