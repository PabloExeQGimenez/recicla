import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>No autorizado (403)</h2>
      <p>No tenés permisos para ver esta sección.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}
