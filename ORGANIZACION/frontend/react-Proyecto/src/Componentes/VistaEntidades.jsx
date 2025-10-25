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

  // Datos para gráfica de barras con Recharts
  const getBarChartData = () => {
    const baseData = [
      { localidad: 'Usaquén', vendedores: 80 },
      { localidad: 'Chapinero', vendedores: 65 },
      { localidad: 'Santa Fe', vendedores: 50 },
      { localidad: 'San Cristóbal', vendedores: 90 },
      { localidad: 'Usme', vendedores: 70 },
      { localidad: 'Tunjuelito', vendedores: 85 },
      { localidad: 'Bosa', vendedores:  25},
      { localidad: 'Kennedy', vendedores: 55 },
      { localidad: 'Fontibón', vendedores: 45 },
      { localidad: 'Engativá', vendedores: 75 },
      { localidad: 'Suba', vendedores: 50 },
      { localidad: 'Barrios Unidos', vendedores: 65 },
      { localidad: 'Teusaquillo', vendedores: 45 },
      { localidad: 'Los Mártires', vendedores: 85 },
      { localidad: 'Antonio Nariño', vendedores: 80 },
      { localidad: 'Puente Aranda', vendedores: 35 },
      { localidad: 'La Candelaria', vendedores: 50 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 90 },
      { localidad: 'Ciudad Bolívar', vendedores: 95 },
      { localidad: 'Sumapaz', vendedores: 70 }
    ];

    if (selectedLocation === 'Usaquén') {
      return [
      { localidad: 'Usaquén', vendedores: 80 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    } else if (selectedLocation === 'Chapinero') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 65 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    } else if (selectedLocation === 'Santa Fe') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 50 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'San Cristóbal') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 90 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Usme') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 70 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Tunjuelito') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 85 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Bosa') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  25 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Kennedy') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 55 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Fontibón') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 45 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Engativá') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 75 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Suba') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 50 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Barrios Unidos') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 65 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Teusaquillo') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 45 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Los Mártires') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 85 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Antonio Nariño') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 85 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Puente Aranda') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 35 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'La Candelaria') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 50 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Rafael Uribe Uribe') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 90 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Ciudad Bolívar') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 95 },
      { localidad: 'Sumapaz', vendedores: 10 }
      ];
    }else if (selectedLocation === 'Sumapaz') {
      return [
        { localidad: 'Usaquén', vendedores: 10 },
      { localidad: 'Chapinero', vendedores: 10 },
      { localidad: 'Santa Fe', vendedores: 10 },
      { localidad: 'San Cristóbal', vendedores: 10 },
      { localidad: 'Usme', vendedores: 10 },
      { localidad: 'Tunjuelito', vendedores: 10 },
      { localidad: 'Bosa', vendedores:  10 },
      { localidad: 'Kennedy', vendedores: 10 },
      { localidad: 'Fontibón', vendedores: 10 },
      { localidad: 'Engativá', vendedores: 10 },
      { localidad: 'Suba', vendedores: 10 },
      { localidad: 'Barrios Unidos', vendedores: 10 },
      { localidad: 'Teusaquillo', vendedores: 10 },
      { localidad: 'Los Mártires', vendedores: 10 },
      { localidad: 'Antonio Nariño', vendedores: 10 },
      { localidad: 'Puente Aranda', vendedores: 10 },
      { localidad: 'La Candelaria', vendedores: 10 },
      { localidad: 'Rafael Uribe Uribe', vendedores: 10 },
      { localidad: 'Ciudad Bolívar', vendedores: 10 },
      { localidad: 'Sumapaz', vendedores: 70 }
      ];
    }

    return baseData;
  };

  // Datos para gráfica circular con Recharts
  const getPieChartData = () => {
    if (selectedGender === 'Mujeres') {
      return [
        { name: 'Mujeres', value: 60, color: '#f97316' },
        { name: 'Hombres', value: 30, color: '#ea580c' },
        { name: 'Otros', value: 10, color: '#6b7280' }
      ];
    } else if (selectedGender === 'Hombres') {
      return [
        { name: 'Hombres', value: 65, color: '#ea580c' },
        { name: 'Mujeres', value: 25, color: '#f97316' },
        { name: 'Otros', value: 10, color: '#6b7280' }
      ];
    } else if (selectedGender === 'Otros') {
      return [
        { name: 'Otros', value: 50, color: '#6b7280' },
        { name: 'Mujeres', value: 30, color: '#f97316' },
        { name: 'Hombres', value: 20, color: '#ea580c' }
      ];
    }

    return [
      { name: 'Hombres', value: 45, color: '#ea580c' },
      { name: 'Mujeres', value: 40, color: '#f97316' },
      { name: 'Otros', value: 15, color: '#6b7280' }
    ];
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

  // Función para descargar todas las gráficas


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

      @media (max-width: 768px) {
        .dashboard-container {
          padding: 0 1rem;
        }

        .dashboard-content {
          padding: 1rem;
        }
        
        .dashboard-hero {
          padding: 1.5rem;
          flex-direction: column;
          text-align: center;
          gap: 1rem;
        }

        .dashboard-hero-title {
          font-size: 1.5rem;
        }

        .dashboard-charts-grid {
          grid-template-columns: 1fr;
        }

        .dashboard-download-container {
          flex-direction: column;
          align-items: stretch;
        }

        .dashboard-download-button {
          width: 100%;
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
              <BarChart data={getBarChartData()}>
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
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPieChartData().map((entry, index) => (
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