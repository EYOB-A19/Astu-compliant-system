export default function Message({ message }) {
  if (!message?.text) return null;
  return (
    <p className={message.type === "error" ? "error" : "success"}>
      {message.text}
    </p>
  );
}
