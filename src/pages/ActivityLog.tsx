import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

type Log = {
  _id: string;
  action: string;
  taskTitle: string;
  details: string;
  createdAt: string;
};

export default function ActivityLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/activity")
      .then((res) => setLogs(res.data.logs))
      .catch((err) => console.error("Error al cargar historial", err))
      .finally(() => setLoading(false));
  }, []);

  const getBadgeColor = (action: string) => {
    switch (action) {
      case "CREADA": return "#238636"; // Verde
      case "EDITADA": return "#d29922"; // Amarillo
      case "COMPLETADA": return "#8957e5"; // Morado
      case "ELIMINADA": return "#da3633"; // Rojo
      case "SINCRONIZADA": return "#2f81f7"; // Azul
      default: return "#6e7681"; // Gris
    }
  };

  return (
    <div className="wrap">
      <header className="topbar">
        <h1>Historial de Actividad</h1>
        <div className="spacer" />
        <Link to="/dashboard" className="btn">⬅ Volver al Dashboard</Link>
      </header>

      <main>
        {loading ? (
          <p>Cargando historial...</p>
        ) : logs.length === 0 ? (
          <p className="empty">Aún no hay actividad registrada.</p>
        ) : (
          <ul className="list">
            {logs.map((log) => (
              <li key={log._id} className="item" style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span 
                    className="badge" 
                    style={{ background: getBadgeColor(log.action), fontWeight: "bold" }}
                  >
                    {log.action}
                  </span>
                  <span className="muted" style={{ fontSize: "0.85rem" }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="content" style={{ marginTop: "4px" }}>
                  <span className="title">{log.taskTitle}</span>
                  <p className="desc">{log.details}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}