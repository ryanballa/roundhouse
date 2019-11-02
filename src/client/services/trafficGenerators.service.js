import axios from 'axios';

class TrafficGeneratorsService {
  async add(user, values) {
    try {
      this.response = await axios.post('/api/v1/trafficGenerators/', {
        ...values,
        user_id: user.id,
      });
      return this.response.data;
    } catch (e) {
      return e;
    }
  }

  async delete(trafficGeneratorId) {
    try {
      this.response = await axios.delete(
        `/api/v1/trafficGenerators/${trafficGeneratorId}`,
      );
      return { id: trafficGeneratorId };
    } catch (e) {
      return e;
    }
  }

  async edit(user, values) {
    try {
      this.response = await axios.put(`/api/v1/trafficGenerators/${values.id}`, {
        ...values,
        user_id: user.id,
      });
      return this.response.data;
    } catch (e) {
      return e;
    }
  }

  async get() {
    try {
      this.response = await axios.get('/api/v1/trafficGenerators');
      return this.response.data;
    } catch (e) {
      return e;
    }
  }

  async view(id) {
    try {
      this.response = await axios.get(`/api/v1/trafficGenerators/${id}`);
      return this.response.data;
    } catch (e) {
      return e;
    }
  }
}

const trafficGeneratorsService = new TrafficGeneratorsService();

export default trafficGeneratorsService;
