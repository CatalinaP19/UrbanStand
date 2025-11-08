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
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const [selectedLocation, setSelectedLocation] = useState('Todas');
  const [selectedGender, setSelectedGender] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedDate, setSelectedDate] = useState('');

  const [statsData, setStatsData] = useState({ activos: 0, inactivos: 0, crecimiento: 0 });
  const [tableData, setTableData] = useState([]);
  const [tableDataOriginal, setTableDataOriginal] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetch('http://localhost:3005/api/dashboard/localidades')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLocalidades(data.data);
          
          const datosTabla = [];
          const generos = ['Masculino', 'Femenino', 'Otro'];
          const estados = ['Activo', 'Inactivo'];
          
          for (let i = 0; i < 50; i++) {
            const activos = Math.floor(Math.random() * 50) + 10;
            const inactivos = Math.floor(Math.random() * 20) + 5;
            datosTabla.push({
              localidad: data.data[i % data.data.length].nombre,
              genero: generos[i % generos.length],
              estado: estados[i % estados.length],
              activos: activos,
              inactivos: inactivos,
              total: activos + inactivos
            });
          }
          
          setTableDataOriginal(datosTabla);
          setTableData(datosTabla);
          calcularEstadisticas(datosTabla);
        }
      })
      .catch(error => console.error('Error cargando localidades:', error));
  }, []);

  useEffect(() => {
    filtrarDatos();
  }, [selectedLocation, selectedGender, selectedStatus, tableDataOriginal]);

  const filtrarDatos = () => {
    let datosFiltrados = [...tableDataOriginal];

    if (selectedLocation !== 'Todas') {
      datosFiltrados = datosFiltrados.filter(item => item.localidad === selectedLocation);
    }

    if (selectedGender !== 'Todos') {
      const generoCapitalizado = selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1);
      datosFiltrados = datosFiltrados.filter(item => item.genero === generoCapitalizado);
    }

    if (selectedStatus !== 'Todos') {
      datosFiltrados = datosFiltrados.filter(item => item.estado === selectedStatus);
    }

    setTableData(datosFiltrados);
    setCurrentPage(1);
    calcularEstadisticas(datosFiltrados);
  };

  const calcularEstadisticas = (datos) => {
    const totalActivos = datos.reduce((sum, item) => sum + item.activos, 0);
    const totalInactivos = datos.reduce((sum, item) => sum + item.inactivos, 0);
    
    const crecimiento = totalActivos > 0 
      ? Math.round(((totalActivos - totalInactivos) / totalActivos) * 100) 
      : 0;

    setStatsData({
      activos: totalActivos,
      inactivos: totalInactivos,
      crecimiento: crecimiento
    });

    const vendedoresPorLocalidad = {};
    datos.forEach(item => {
      if (!vendedoresPorLocalidad[item.localidad]) {
        vendedoresPorLocalidad[item.localidad] = 0;
      }
      vendedoresPorLocalidad[item.localidad] += item.activos;
    });

    const barData = Object.keys(vendedoresPorLocalidad).map(localidad => ({
      localidad: localidad,
      vendedores: vendedoresPorLocalidad[localidad]
    }));
    setBarChartData(barData);

    const generoCounts = {};
    datos.forEach(item => {
      if (!generoCounts[item.genero]) {
        generoCounts[item.genero] = 0;
      }
      generoCounts[item.genero] += item.activos;
    });

    const colores = {
      'Masculino': '#ea580c',
      'Femenino': '#f97316',
      'Otro': '#6b7280'
    };

    const pieData = Object.keys(generoCounts).map(genero => ({
      name: genero,
      value: generoCounts[genero],
      color: colores[genero]
    }));
    setPieChartData(pieData);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pageNumbers;
  };

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

      .pagination-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 2px solid #f3f4f6;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .pagination-info {
        color: #6b7280;
        font-size: 0.95rem;
      }

      .pagination-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .pagination-button {
        padding: 0.5rem 1rem;
        border: 2px solid #ea580c;
        background: white;
        color: #ea580c;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
        font-size: 0.9rem;
      }

      .pagination-button:hover:not(:disabled) {
        background: #ea580c;
        color: white;
      }

      .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        border-color: #d1d5db;
        color: #9ca3af;
      }

      .pagination-button.active {
        background: #ea580c;
        color: white;
      }

      .pagination-ellipsis {
        padding: 0.5rem;
        color: #6b7280;
      }

      .items-per-page {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .items-per-page-label {
        color: #6b7280;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .items-per-page-select {
        border: 2px solid #ea580c;
        padding: 0.4rem 0.8rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        outline: none;
        cursor: pointer;
        background: white;
        color: #374151;
        font-weight: 500;
      }

      .items-per-page-select:focus {
        border-color: #9a1e22;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
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

        .dashboard-stats-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .dashboard-charts-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .pagination-container {
          flex-direction: column;
          align-items: stretch;
        }

        .pagination-controls {
          justify-content: center;
        }

        .pagination-button {
          padding: 0.4rem 0.7rem;
          font-size: 0.85rem;
        }

        .items-per-page {
          justify-content: center;
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
              <option value="Todos">Todos</option>
              <option value="Activo">Activos</option>
              <option value="Inactivo">Inactivos</option>
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

        {tableData.length === 0 && !loading && (
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
              {currentItems.map((row, index) => (
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

          <div className="pagination-container">
            <div className="pagination-info">
              Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, tableData.length)} de {tableData.length} registros
            </div>

            <div className="pagination-controls">
              <button 
                className="pagination-button"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>

              {getPageNumbers().map((number, index) => (
                number === '...' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={number}
                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                    onClick={() => goToPage(number)}
                  >
                    {number}
                  </button>
                )
              ))}

              <button 
                className="pagination-button"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>

            <div className="items-per-page">
              <label className="items-per-page-label">Mostrar:</label>
              <select 
                className="items-per-page-select"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
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