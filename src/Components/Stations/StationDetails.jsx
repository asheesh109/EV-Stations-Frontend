import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../Services/Api';
import '../../styles/StationDetails.css';

export default function StationDetails() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStation() {
      try {
        const res = await api.get(`/stations/${id}`);
        setStation(res.data.data);
      } catch (error) {
        setStation(null);
      }
      setLoading(false);
    }
    fetchStation();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await api.delete(`/stations/${id}`);
        navigate('/dashboard');
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="station-details-green">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading station details...</div>
        </div>
      </div>
    );
  }
  if (!station) {
    return (
      <div className="station-details-green">
        <div className="empty-green">
          <div className="empty-icon">⚠️</div>
          <h3>Station Not Found</h3>
          <p>The requested station could not be found or may have been deleted.</p>
          <button className="view-btn-green" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="station-details-green">
      <header className="details-header-green">
        <button className="back-btn-green" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h1>
          <span className="logo-green">⚡</span> {station.name || 'Unnamed Station'}
        </h1>
        <span className={`status-badge-green ${station.status?.replace(/\s/g, '').toLowerCase()}`}>
          {station.status}
        </span>
      </header>

      <section className="details-section-green">
        <div className="details-row-green">
          <div>
            <div className="details-label-green">Power Output</div>
            <div className="details-value-green">{station.powerOutput ? `${station.powerOutput} kW` : 'N/A'}</div>
          </div>
          <div>
            <div className="details-label-green">Connector Type</div>
            <div className="details-value-green">{station.connectorType || 'N/A'}</div>
          </div>
        </div>
        <div className="details-row-green">
          <div>
            <div className="details-label-green">Address</div>
            <div className="details-value-green">{station.location?.address || 'N/A'}</div>
          </div>
          <div>
            <div className="details-label-green">Coordinates</div>
            <div className="details-value-green">
              {station.location?.latitude}, {station.location?.longitude}
            </div>
          </div>
        </div>
        <div className="details-row-green">
          <div>
            <div className="details-label-green">Created By</div>
            <div className="details-value-green">
              {station.createdBy
                ? `${station.createdBy.name} (${station.createdBy.email})`
                : 'Unknown'}
            </div>
          </div>
          <div>
            <div className="details-label-green">Created</div>
            <div className="details-value-green">
              {station.createdAt && new Date(station.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </section>

      <div className="details-actions-green">
        <Link to={`/dashboard/station/${id}/edit`} className="edit-btn-green">
          Edit Station
        </Link>
        <button className="delete-btn-green" onClick={handleDelete}>
          Delete Station
        </button>
      </div>
    </div>
  );
}