import React, { useEffect, useState } from 'react';
import api from '../../Services/Api';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/StationList.css';

export default function StationList() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStations() {
      try {
        const res = await api.get('/stations');
        setStations(res.data.data);
      } catch (error) {
        console.error('Failed to fetch stations:', error);
      }
      setLoading(false);
    }
    fetchStations();
  }, []);

  const filteredStations = stations
    .filter(station => {
      const matchesSearch = station.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || station.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const stats = {
    total: stations.length,
    available: stations.filter(s => s.status === 'Available').length,
    occupied: stations.filter(s => s.status === 'Occupied').length,
    outOfService: stations.filter(s => s.status === 'Out of Service').length
  };

  const getStatusColor = (status) => {
    if (status === 'Available') return 'available';
    if (status === 'Occupied') return 'occupied';
    if (status === 'Out of Service') return 'outofservice';
    return '';
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  if (loading) {
    return (
      <div className="station-list-green">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading charging stations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="station-list-green">
      <header className="station-list-header">
        <div>
          <h1>
            <span className="logo-green">⚡</span> EV Charging Stations
          </h1>
          <p id="sec">Monitor, manage, and add new stations to your green network.</p>
        </div>
      </header>

      <section className="station-list-stats">
        <div className="stat-card-green">
          <div className="stat-label">Total</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card-green available">
          <div className="stat-label">Available</div>
          <div className="stat-value">{stats.available}</div>
        </div>
        <div className="stat-card-green occupied">
          <div className="stat-label">Occupied</div>
          <div className="stat-value">{stats.occupied}</div>
        </div>
        <div className="stat-card-green outofservice">
          <div className="stat-label">Out of Service</div>
          <div className="stat-value">{stats.outOfService}</div>
        </div>
      </section>

      <section className="station-list-controls">
        <div className="search-container">
          <input
            className="search-green"
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={clearSearch} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
        <select
          className="filter-green"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Out of Service">Out of Service</option>
        </select>
        {(searchTerm || statusFilter !== 'All') && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </section>

      {filteredStations.length === 0 ? (
        <div className="empty-green">
          <div className="empty-icon">🔌</div>
          <h3>No stations found</h3>
          <p>
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filters.' 
              : 'No charging stations available at the moment.'}
          </p>
          {(searchTerm || statusFilter !== 'All') && (
            <button className="clear-filters-btn-empty" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="station-cards-green">
          {filteredStations.map(station => (
            <div className="station-card-green" key={station._id}>
              <div className="station-card-header">
                <div>
                  <h2 className="station-card-title">{station.name || 'Unnamed Station'}</h2>
                  <div className="station-card-address">
                    <span role="img" aria-label="location">📍</span>
                    {station.location?.address || 'No address'}
                  </div>
                </div>
                <span className={`status-badge-green ${getStatusColor(station.status)}`}>
                  {station.status}
                </span>
              </div>
              <div className="station-card-details">
                <div>
                  <span className="detail-label">Power:</span>
                  <span>{station.powerOutput ? `${station.powerOutput} kW` : 'N/A'}</span>
                </div>
                <div>
                  <span className="detail-label">Connector:</span>
                  <span>{station.connectorType || 'N/A'}</span>
                </div>
              </div>
              <div className="station-card-footer">
                <Link to={`/dashboard/station/${station._id}`} className="view-btn-green">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}