import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Services/Api';
import '../../styles/StationForm.css';

export default function StationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    location: {
      latitude: '',
      longitude: '',
      address: '',
    },
    powerOutput: '',
    connectorType: 'Type1',
    status: 'Available',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const connectorTypes = ['Type1', 'Type2', 'CCS', 'CHAdeMO'];
  const statuses = ['Available', 'Occupied', 'Out of Service'];

  useEffect(() => {
    if (id) {
      api.get(`/stations/${id}`)
        .then(res => {
          setForm(res.data.data);
        })
        .catch(err => {
          alert('Failed to load station data');
        });
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (['latitude', 'longitude', 'address'].includes(name)) {
      setForm(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const payload = {
      ...form,
      location: {
        ...form.location,
        latitude: parseFloat(form.location.latitude),
        longitude: parseFloat(form.location.longitude),
      },
      powerOutput: parseFloat(form.powerOutput),
    };

    try {
      const response = id ?
        await api.put(`/stations/${id}`, payload)
        : await api.post('/stations', payload);

      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data.errors) {
        const newErrors = {};
        err.response.data.errors.forEach(error => {
          if (typeof error === 'string') {
            newErrors.general = error;
          } else if (error.path) {
            newErrors[error.path] = error.message;
          } else if (error.param) {
            newErrors[error.param] = error.msg;
          }
        });
        setErrors(newErrors);
      } else {
        alert('Error submitting form');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="station-form-green">
      <header className="form-header-green">
        
        <h1>
          <span className="logo-green">⚡</span> {id ? 'Edit Station' : 'Add Station'}
        </h1>
      </header>
      <form className="form-green" onSubmit={handleSubmit}>
        <div className="form-row-green">
          <label>Name</label>
          <input
            name="name"
            placeholder="Station Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="error-green">{errors.name}</div>}
        </div>
        <div className="form-row-green">
          <label>Latitude</label>
          <input
            name="latitude"
            placeholder="e.g., 40.7128"
            type="number"
            step="any"
            value={form.location.latitude}
            onChange={handleChange}
            required
          />
          {errors['location.latitude'] && (
            <div className="error-green">{errors['location.latitude']}</div>
          )}
        </div>
        <div className="form-row-green">
          <label>Longitude</label>
          <input
            name="longitude"
            placeholder="e.g., -74.0060"
            type="number"
            step="any"
            value={form.location.longitude}
            onChange={handleChange}
            required
          />
          {errors['location.longitude'] && (
            <div className="error-green">{errors['location.longitude']}</div>
          )}
        </div>
        <div className="form-row-green">
          <label>Address</label>
          <input
            name="address"
            placeholder="Full Address"
            value={form.location.address}
            onChange={handleChange}
            required
          />
          {errors['location.address'] && (
            <div className="error-green">{errors['location.address']}</div>
          )}
        </div>
        <div className="form-row-green">
          <label>Power Output (kW)</label>
          <input
            name="powerOutput"
            placeholder="e.g., 50"
            type="number"
            step="0.1"
            min="0"
            value={form.powerOutput}
            onChange={handleChange}
            required
          />
          {errors.powerOutput && <div className="error-green">{errors.powerOutput}</div>}
        </div>
        <div className="form-row-green">
          <label>Connector Type</label>
          <select
            name="connectorType"
            value={form.connectorType}
            onChange={handleChange}
            required
          >
            {connectorTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.connectorType && <div className="error-green">{errors.connectorType}</div>}
        </div>
        <div className="form-row-green">
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.status && <div className="error-green">{errors.status}</div>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-btn-green"
        >
          {isSubmitting ? 'Processing...' : (id ? 'Update' : 'Create')} Station
        </button>
      </form>
    </div>
  );
}