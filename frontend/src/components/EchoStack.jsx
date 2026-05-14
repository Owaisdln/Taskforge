export default function EchoStack({ text, fontSize = 'clamp(64px, 11vw, 180px)' }) {
  return (
    <div className="echo-stack" style={{ fontSize }}>
      <span className="echo-stack__layer echo-stack__layer--4">{text}</span>
      <span className="echo-stack__layer echo-stack__layer--3">{text}</span>
      <span className="echo-stack__layer echo-stack__layer--2">{text}</span>
      <span className="echo-stack__layer echo-stack__layer--1">{text}</span>
      <span className="echo-stack__front">{text}</span>
    </div>
  );
}
