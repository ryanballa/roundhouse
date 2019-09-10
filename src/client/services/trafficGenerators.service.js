import axios from 'axios';

class TrafficGeneratorsService {
  async add(user, values) {
    try {
      const response = await axios.post('/api/v1/trafficGenerators/', {
        ...values,
        user_id: user.id,
      });
      return response.data;
    } catch (e) {
      return e;
    }
  }
  async delete(trafficGeneratorId) {
    try {
      const response = await axios.delete(
        `/api/v1/trafficGenerators/${trafficGeneratorId}`,
      );
      return response.data;
    } catch (e) {
      return e;
    }
  }
  async get() {
    try {
      const response = await axios.get('/api/v1/trafficGenerators');
      return response.data;
    } catch (e) {
      return e;
    }
  }
}

const trafficGeneratorsService = new TrafficGeneratorsService();

export default trafficGeneratorsService;
