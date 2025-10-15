import React, { useState, useEffect } from 'react';

export default function UrbanStandDashboard() {
  // Estados para los filtros
  const [selectedLocation, setSelectedLocation] = useState('Todas');
  const [selectedGender, setSelectedGender] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Activos');
  const [selectedDate, setSelectedDate] = useState('');

  // Datos de ejemplo
  const statsData = {
    activos: 12345,
    inactivos: 1875,
    crecimiento: 12
  };

  const tableData = [
    { localidad: 'Localidad 1', genero: 'Mujeres', activos: 85, inactivos: 300, total: 385 },
    { localidad: 'Localidad 2', genero: 'Hombres', activos: 85, inactivos: 120, total: 260 },
    { localidad: 'Localidad 3', genero: 'Mujeres', activos: 30, inactivos: 380, total: 500 },
    { localidad: 'Localidad 4', genero: 'Otros', activos: 20, inactivos: 580, total: 420 },
    { localidad: 'Localidad 5', genero: 'Hombres', activos: 30, inactivos: 290, total: 300 }
  ];

  // Variable para cambiar la gráfica según el género seleccionado
  const getChartData = () => {
    if (selectedGender === 'Mujeres') {
      return 'conic-gradient(#ea580c 0deg 180deg, #f97316 180deg 360deg)'; // 50% mujeres, 50% otros
    } else if (selectedGender === 'Hombres') {
      return 'conic-gradient(#ea580c 0deg 240deg, #f97316 240deg 300deg, #6b7280 300deg 360deg)'; // 67% hombres, 17% mujeres, 16% otros
    } else if (selectedGender === 'Otros') {
      return 'conic-gradient(#ea580c 0deg 60deg, #f97316 60deg 120deg, #6b7280 120deg 360deg)'; // Otros predominante
    } else {
      return 'conic-gradient(#ea580c 0deg 120deg, #f97316 120deg 240deg, #6b7280 240deg 360deg)'; // Distribución normal
    }
  };

  // Variable para cambiar las barras según la localidad seleccionada
  const getBarData = () => {
    if (selectedLocation === 'Localidad 1') {
      return [100, 20, 10, 15, 25]; // Localidad 1 tiene más vendedores
    } else if (selectedLocation === 'Localidad 2') {
      return [30, 100, 40, 20, 35]; // Localidad 2 tiene más vendedores
    } else if (selectedLocation === 'Localidad 3') {
      return [15, 25, 100, 30, 20]; // Localidad 3 tiene más vendedores
    } else {
      return [80, 60, 50, 90, 70]; // Distribución normal para "Todas"
    }
  };

  // Crear estilos CSS igual que en el módulo de registro
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .dashboard-container {
        width: 100vw;
        background: #faf3e0;
        font-family: system-ui, -apple-system, sans-serif;
        overflow-x: hidden;
        margin: 0;
        padding: 0 10rem;
        min-height: 100vh;
      }

      .dashboard-nav {
        background: white;
        padding: 1rem 2rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
      }

      .dashboard-logo {
        color: #9a1e22;
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
      }

      .dashboard-nav-links {
        display: flex;
        gap: 2rem;
        align-items: center;
      }

      .dashboard-nav-button {
        background: none;
        border: none;
        color: #9a1e22;
        cursor: pointer;
        font-size: 1rem;
        transition: color 0.2s ease;
      }

      .dashboard-nav-button:hover {
        color: #ea580c;
      }

      .dashboard-logout-button {
        background: #ea580c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
      }

      .dashboard-logout-button:hover {
        background: #9a1e22;
      }

      .dashboard-content {
        padding: 2rem;
      }

      .dashboard-hero {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .dashboard-hero-title {
        color: #9a1e22;
        font-size: 2.5rem;
        font-weight: bold;
        margin: 0 0 0.5rem 0;
        line-height: 1.2;
      }

      .dashboard-hero-icon {
        width: 200px;
        height: 120px;
        background: #ea580c;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 3rem;
        opacity: 0.8;
      }

      .dashboard-filters {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .dashboard-filter-group {
        display: flex;
        flex-direction: column;
      }

      .dashboard-filter-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
        font-size: 0.9rem;
      }

      .dashboard-filter-select {
        border: 2px solid #ea580c;
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.2s ease;
        outline: none;
        box-sizing: border-box;
        background: white;
      }

      .dashboard-filter-select:focus {
        border-color: #9a1e22;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }

      .dashboard-filter-select:hover {
        border-color: #9a1e22;
      }

      .dashboard-filter-input {
        border: 2px solid #ea580c;
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 0.2s ease;
        outline: none;
        box-sizing: border-box;
      }

      .dashboard-filter-input:focus {
        border-color: #9a1e22;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }

      .dashboard-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .dashboard-stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transition: transform 0.2s ease;
      }

      .dashboard-stat-card:hover {
        transform: translateY(-2px);
      }

      .dashboard-stat-number {
        font-size: 2.5rem;
        font-weight: bold;
        color: #9a1e22;
        margin-bottom: 0.5rem;
        line-height: 1;
      }

      .dashboard-stat-label {
        color: #6b7280;
        font-size: 1.1rem;
        margin: 0;
      }

      .dashboard-charts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .dashboard-chart-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .dashboard-chart-title {
        color: #9a1e22;
        margin-bottom: 1rem;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .dashboard-bar-chart {
        display: flex;
        align-items: flex-end;
        gap: 1rem;
        height: 200px;
        padding: 1rem 0;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        background: #fafafa;
      }

      .dashboard-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        height: 100%;
      }

      .dashboard-bar-fill {
        width: 100%;
        background: #ea580c;
        border-radius: 0.25rem 0.25rem 0 0;
        margin-bottom: 0.5rem;
        transition: background 0.2s ease;
        min-height: 2px;
      }

      .dashboard-bar-fill:hover {
        background: #9a1e22;
      }

      .dashboard-bar-label {
        font-size: 0.8rem;
        color: #6b7280;
      }

      .dashboard-pie-chart {
        text-align: center;
      }

      .dashboard-pie-circle {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: 1rem auto;
        border: 4px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .dashboard-pie-legend {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .dashboard-legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .dashboard-legend-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .dashboard-legend-label {
        font-size: 0.9rem;
        color: #6b7280;
      }

      .dashboard-table-container {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        overflow-x: auto;
        margin-bottom: 2rem;
      }

      .dashboard-table {
        width: 100%;
        border-collapse: collapse;
      }

      .dashboard-table th {
        text-align: left;
        padding: 1rem;
        color: #9a1e22;
        font-weight: 600;
        border-bottom: 2px solid #ea580c;
      }

      .dashboard-table td {
        padding: 1rem;
        color: #6b7280;
        border-bottom: 1px solid #f3f4f6;
      }

      .dashboard-table tr:hover {
        background-color: #faf3e0;
      }

      .dashboard-table-number {
        color: #9a1e22;
        font-weight: 600;
      }

      .dashboard-download-container {
        text-align: center;
        margin-top: 2rem;
      }

      .dashboard-download-button {
        border: 2px solid #ea580c;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        background: #ea580c;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.2s ease;
        color: white;
      }

      .dashboard-download-button:hover {
        background: transparent;
        color: #ea580c;
        border-color: #f97316;
      }

      @media (max-width: 768px) {
        .dashboard-content {
          padding: 1rem;
        }
        
        .dashboard-hero {
          padding: 1.5rem;
          flex-direction: column;
          text-align: center;
          gap: 1rem;
        }

        
  
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="dashboard-container">
    

      {/* Contenido principal */}
      <div className="dashboard-content">
        
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div>
            <h2 className="dashboard-hero-title">
              Entidad: Monitoreo de vendedores informales en la ciudad.
            </h2>
          </div>
<img className="dashboard-hero-icon" src="/img/img-VistaEnt.jpeg" alt="Imagen vendedor" />
        </div>

        {/* Filtros */}
        <div className="dashboard-filters">
          <div className="dashboard-filter-group">
            <label className="dashboard-filter-label">Localidad</label>
            <select 
              className="dashboard-filter-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option>Todas</option>
              <option>Usaquén</option>
              <option>Chapinero</option>
              <option>Santa Fe</option>
              <option>San Cristóbal</option>
              <option>Usme</option>
              <option>Tunjuelito</option>
              <option>Bosa</option>
              <option>Kennedy</option>
              <option>Fontibón</option>
              <option>Engativá</option>
              <option>Suba</option>
              <option>Barrios Unidos</option>
              <option>Teusaquillo</option>
              <option>Los Mártires</option>
              <option>Antonio Nariño</option>
              <option>Puente Aranda</option>
              <option>La Candelaria</option>
              <option>Rafael Uribe Uribe</option>
              <option>Ciudad Bolívar</option>
              <option>Sumapaz</option>
            </select>
          </div>

          <div className="dashboard-filter-group">
            <label className="dashboard-filter-label">Género</label>
            <select 
              className="dashboard-filter-select"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option>Todos</option>
              <option>Hombres</option>
              <option>Mujeres</option>
              <option>Otros</option>
            </select>
          </div>

          <div className="dashboard-filter-group">
            <label className="dashboard-filter-label">Estado</label>
            <select 
              className="dashboard-filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option>Activos</option>
              <option>Inactivos</option>
            </select>
          </div>

          <div className="dashboard-filter-group">
            <label className="dashboard-filter-label">Fecha</label>
            <input 
              type="date"
              className="dashboard-filter-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="DD/MM/AAAA"
            />
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">
              {statsData.activos.toLocaleString()}
            </div>
            <p className="dashboard-stat-label">Activos</p>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">
              {statsData.inactivos.toLocaleString()}
            </div>
            <p className="dashboard-stat-label">Inactivos</p>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-number">
              {statsData.crecimiento}%
            </div>
            <p className="dashboard-stat-label">Crecimiento</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="dashboard-charts-grid">
          
          {/* Gráfico de barras */}
          <div className="dashboard-chart-card">
            <h3 className="dashboard-chart-title">Vendedores por localidad</h3>
            <div className="dashboard-bar-chart">
              {getBarData().map((height, index) => (
                <div key={index} className="dashboard-bar">
                  <div 
                    className="dashboard-bar-fill"
                    style={{ height: `${height}%` }}
                  />
                  <span className="dashboard-bar-label">Loc. {index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico circular */}
          <div className="dashboard-chart-card">
            <h3 className="dashboard-chart-title">Distribución por género</h3>
            <div className="dashboard-pie-chart">
              <div className="dashboard-pie-circle" style={{ background: getChartData() }} />
              <div className="dashboard-pie-legend">
                <div className="dashboard-legend-item">
                  <div className="dashboard-legend-color" style={{ backgroundColor: '#ea580c' }} />
                  <span className="dashboard-legend-label">Hombres</span>
                </div>
                <div className="dashboard-legend-item">
                  <div className="dashboard-legend-color" style={{ backgroundColor: '#f97316' }} />
                  <span className="dashboard-legend-label">Mujeres</span>
                </div>
                <div className="dashboard-legend-item">
                  <div className="dashboard-legend-color" style={{ backgroundColor: '#6b7280' }} />
                  <span className="dashboard-legend-label">Otro</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de datos */}
        <div className="dashboard-table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Localidad</th>
                <th>Género</th>
                <th>Activos</th>
                <th>Inactivos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.localidad}</td>
                  <td>{row.genero}</td>
                  <td className="dashboard-table-number">{row.activos}</td>
                  <td>{row.inactivos}</td>
                  <td className="dashboard-table-number">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón de descarga */}
        <div className="dashboard-download-container">
          <button className="dashboard-download-button">
            Descargar reporte
          </button>
        </div>
      </div>
    </div>
  );
}