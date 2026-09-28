export default function AreaCard({ area }) {
  return (
    <div className="card area-card">
      <span className="area-badge">{area.type}</span>
      <h3>{area.name}</h3>
    </div>
  )
}
