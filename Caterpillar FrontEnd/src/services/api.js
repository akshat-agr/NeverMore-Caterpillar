const API_BASE_URL = 'http://10.146.31.250:8000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isOnline = false;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      this.isOnline = true;
      return data;
    } catch (error) {
      this.isOnline = false;
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Backend server is not running. Please start the backend server first.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Check if it\'s running on port 5000.');
      } else if (error.message.includes('CORS')) {
        throw new Error('CORS error. Backend server may not be configured properly.');
      }
      
      throw error;
    }
  }

  // Health check with better error handling
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const data = await response.json();
      this.isOnline = true;
      return data;
    } catch (error) {
      this.isOnline = false;
      throw error;
    }
  }

  // Equipment endpoints
  async getEquipment() {
    return this.request('/equipment/');
  }

  async getEquipmentById(id) {
    return this.request(`/equipment/${id}`);
  }

  async createEquipment(equipmentData) {
    return this.request('/equipment/', {
      method: 'POST',
      body: JSON.stringify(equipmentData),
    });
  }

  async updateEquipment(id, equipmentData) {
    return this.request(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipmentData),
    });
  }

  async deleteEquipment(id) {
    return this.request(`/equipment/${id}`, {
      method: 'DELETE',
    });
  }

  // Site endpoints - FIXED: changed from /site/ to /sites/
  async getSites() {
    return this.request('/sites/');
  }

  async getSiteById(id) {
    return this.request(`/sites/${id}`);
  }

  async createSite(siteData) {
    return this.request('/sites/', {
      method: 'POST',
      body: JSON.stringify(siteData),
    });
  }

  async updateSite(id, siteData) {
    return this.request(`/sites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(siteData),
    });
  }

  async deleteSite(id) {
    return this.request(`/sites/${id}`, {
      method: 'DELETE',
    });
  }

  // Rental endpoints - FIXED: changed from /rental/ to /rentals/
  async getRentals() {
    return this.request('/rentals/');
  }

  async getRentalById(id) {
    return this.request(`/rentals/${id}`);
  }

  async createRental(rentalData) {
    return this.request('/rentals/', {
      method: 'POST',
      body: JSON.stringify(rentalData),
    });
  }

  async updateRental(id, rentalData) {
    return this.request(`/rentals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rentalData),
    });
  }

  async deleteRental(id) {
    return this.request(`/rentals/${id}`, {
      method: 'DELETE',
    });
  }

  // Equipment Live Status endpoints
  async getEquipmentStatus() {
    return this.request('/status/');
  }

  async getEquipmentStatusById(id) {
    return this.request(`/status/${id}`);
  }

  async createEquipmentStatus(statusData) {
    return this.request('/status/', {
      method: 'POST',
      body: JSON.stringify(statusData),
    });
  }

  async updateEquipmentStatus(id, statusData) {
    return this.request(`/status/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async deleteEquipmentStatus(id) {
    return this.request(`/status/${id}`, {
      method: 'DELETE',
    });
  }

  // Get connection status
  getConnectionStatus() {
    return this.isOnline;
  }
}

export default new ApiService();
