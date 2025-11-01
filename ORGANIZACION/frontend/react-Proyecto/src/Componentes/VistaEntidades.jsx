import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function UrbanStandDashboard() {
  // Referencias para las gráficas
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  // Estados para los filtros
  const [selectedLocation, setSelectedLocation] = useState('Todas');
  const [selectedGender, setSelectedGender] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Activos');
  const [selectedDate, setSelectedDate] = useState('');

  // Estados para datos dinámicos
  const [statsData, setStatsData] = useState({ activos: 0, inactivos: 0, crecimiento: 0 });
  const [tableData, setTableData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar localidades al montar el componente
  useEffect(() => {
    fetch('http://localhost:3005/api/dashboard/localidades')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLocalidades(data.data);
        }
      })
      .catch(error => console.error('Error cargando localidades:', error));
  }, []);

  // Cargar estadísticas cuando cambien los filtros
  useEffect(() => {
    if (localidades.length > 0) {
      cargarEstadisticas();
    }
  }, [selectedLocation, selectedGender, selectedStatus, selectedDate, localidades]);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros solo si no son valores por defecto
      if (selectedLocation !== 'Todas') {
        // Buscar el ID de la localidad por nombre
        const localidadEncontrada = localidades.find(loc => loc.nombre === selectedLocation);
        if (localidadEncontrada) {
          params.append('localidad', localidadEncontrada._id);
        }
      }
      
      if (selectedGender !== 'Todos') {
        params.append('genero', selectedGender);
      }
      
      if (selectedStatus) {
        params.append('estado', selectedStatus);
      }
      
      if (selectedDate) {
        params.append('fechaInicio', selectedDate);
      }

      const response = await fetch(`http://localhost:3005/api/dashboard/estadisticas?${params}`);
      const result = await response.json();

      if (result.success) {
        const { conteos, distribucionGenero, vendedoresPorLocalidad, tablaDetallada } = result.data;
        
        // Actualizar estadísticas principales
        setStatsData({
          activos: conteos.activos,
          inactivos: conteos.inactivos,
          crecimiento: conteos.crecimiento
        });
        
        // Actualizar gráfica de barras
        setBarChartData(vendedoresPorLocalidad);
        
        // Actualizar gráfica de pastel con colores
        const pieData = distribucionGenero.map(item => ({
          name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
          value: item.value,
          color: item.name === 'masculino' ? '#ea580c' : 
                 item.name === 'femenino' ? '#f97316' : '#6b7280'
        }));
        setPieChartData(pieData);
        
        // Actualizar tabla
        setTableData(tablaDetallada);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para descargar gráfica específica
  const downloadChart = async (chartRef, filename) => {
    if (!chartRef.current || !window.html2canvas) {
      alert('Espera un momento mientras cargamos los recursos necesarios...');
      return;
    }

    try {
      const canvas = await window.html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Hubo un error al descargar la gráfica');
    }
  };

  // Crear estilos CSS
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.async = true;
    document.body.appendChild(script);

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
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
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

      .dashboard-loading {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 1rem;
        margin-bottom: 2rem;
      }

      .dashboard-loading-text {
        color: #9a1e22;
        font-size: 1.2rem;
      }

      .dashboard-no-data {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 1rem;
        margin-bottom: 2rem;
      }

      .dashboard-no-data-text {
        color: #6b7280;
        font-size: 1.1rem;
      }

    @media (max-width: 768px) {
        .dashboard-container {
          padding: 0 0.5rem;
          width: 100%;
        }

        .dashboard-content {
          padding: 0.5rem;
        }
        
        .dashboard-hero {
          padding: 1rem;
          flex-direction: column;
          text-align: center;
          gap: 0.5rem;
        }

        .dashboard-hero-title {
          font-size: 1.2rem;
          margin: 0.25rem 0;
        }

        .dashboard-filters {
          padding: 1rem;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .dashboard-filter-label {
          font-size: 0.85rem;
        }

        .dashboard-filter-select,
        .dashboard-filter-input {
          padding: 0.6rem;
          font-size: 0.9rem;
        }

        .dashboard-stats-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .dashboard-stat-card {
          padding: 1rem;
        }

        .dashboard-stat-number {
          font-size: 2rem;
        }

        .dashboard-stat-label {
          font-size: 0.95rem;
        }

        .dashboard-charts-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .dashboard-chart-card {
          padding: 1rem;
        }

        .dashboard-chart-title {
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }

        .dashboard-table-container {
          padding: 0.5rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .dashboard-table {
          font-size: 0.8rem;
          min-width: 500px;
        }

        .dashboard-table th,
        .dashboard-table td {
          padding: 0.5rem;
        }

        .dashboard-download-container {
          flex-direction: column;
          align-items: stretch;
          padding: 0 0.5rem;
        }

        .dashboard-download-button {
          width: 100%;
          padding: 0.75rem;
          font-size: 0.9rem;
        }

        .dashboard-loading,
        .dashboard-no-data {
          padding: 1rem;
          margin: 1rem 0;
        }

        .dashboard-loading-text,
        .dashboard-no-data-text {
          font-size: 0.95rem;
        }

        /* Mejoras para gráficas en móvil */
        .recharts-wrapper {
          font-size: 0.75rem !important;
        }

        .recharts-legend-wrapper {
          font-size: 0.7rem !important;
        }
      }

      /* Tablets y pantallas medianas */
      @media (min-width: 769px) and (max-width: 1024px) {
        .dashboard-container {
          padding: 0 2rem;
        }

        .dashboard-content {
          padding: 1.5rem;
        }

        .dashboard-hero-title {
          font-size: 2rem;
        }

        .dashboard-charts-grid {
          grid-template-columns: 1fr;
        }

        .dashboard-stats-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-hero">
          <div>
            <h2 className="dashboard-hero-title">
              Entidades: 
            </h2>
            <h2 className="dashboard-hero-title">
                 Monitoreo de vendedores informales en la ciudad.
            </h2>
          </div>
        </div>

        <div className="dashboard-filters">
          <div className="dashboard-filter-group">
            <label className="dashboard-filter-label">Localidad</label>
            <select 
              className="dashboard-filter-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="Todas">Todas</option>
              {localidades.map((loc) => (
                <option key={loc._id} value={loc.nombre}>
                  {loc.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="dashboard-filter-group">
            <label className="dashboard-filter-label">Género</label>
            <select 
              className="dashboard-filter-select"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="dashboard-filter-group">
            <label className="dashboard-filter-label">Estado</label>
            <select 
              className="dashboard-filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="Activos">Activos</option>
              <option value="Inactivos">Inactivos</option>
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

        {loading && (
          <div className="dashboard-loading">
            <p className="dashboard-loading-text">
              Cargando estadísticas...
            </p>
          </div>
        )}

        {!loading && barChartData.length === 0 && (
          <div className="dashboard-no-data">
            <p className="dashboard-no-data-text">
              No hay datos disponibles con los filtros seleccionados
            </p>
          </div>
        )}

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

        <div className="dashboard-charts-grid">
          {/* Gráfica de barras con Recharts */}
          <div className="dashboard-chart-card" ref={barChartRef}>
            <h3 className="dashboard-chart-title">Vendedores por localidad</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="localidad" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #ea580c',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="vendedores" fill="#ea580c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica circular con Recharts */}
          <div className="dashboard-chart-card" ref={pieChartRef}>
            <h3 className="dashboard-chart-title">Distribución por género</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #ea580c',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

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

        <div className="dashboard-download-container">
          <button 
            className="dashboard-download-button"
            onClick={() => downloadChart(barChartRef, 'vendedores-por-localidad')}
          >
            Descargar gráfica de barras
          </button>
          <button 
            className="dashboard-download-button"
            onClick={() => downloadChart(pieChartRef, 'distribucion-por-genero')}
          >
            Descargar gráfica circular
          </button>
        </div>
      </div>
    </div>
  );
}