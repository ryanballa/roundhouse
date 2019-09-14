import axios from 'axios';

class RailcarsService {
  async get() {
    try {
      this.response = await axios.get('/api/v1/railcars');
      return this.response.data;
    } catch (e) {
      return e;
    }
  }
}

const railcarsService = new RailcarsService();

export default railcarsService;
