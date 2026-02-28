export default function StudentChatSection({
  chatMessages,
  chatInput,
  setChatInput,
  onChatSubmit,
}) {
  return (
    <section className="view active">
      <article className="panel" style={{ padding: 16 }}>
        <h3>AI Help Assistant</h3>
        <p className="muted">
          Ask how to report issues, track status, or escalate unresolved
          tickets.
        </p>
        <div className="chat-wrap">
          <div className="chat-box">
            {chatMessages.map((message, index) => (
              <div
                className={`chat-msg ${message.kind}`}
                key={`${message.kind}-${index}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <form className="form-grid" onSubmit={onChatSubmit} noValidate>
            <div className="field">
              <label htmlFor="chatInput">Your Message</label>
              <input
                id="chatInput"
                name="chatInput"
                type="text"
                placeholder="How can I report internet issues?"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Send
            </button>
          </form>
        </div>
      </article>
    </section>
  );
}
