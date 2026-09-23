export default function Toggle({ label, on, onLabel, offLabel, onClick }) {
  return (
    <button type="button" className="toggle" onClick={onClick}>
      {label}: <b>{on ? onLabel : offLabel}</b>
    </button>
  );
}
