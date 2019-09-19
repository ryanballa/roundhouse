import axios from 'axios';

class LocomotivesService {
  async get() {
    try {
      this.response = await axios.get('/api/v1/locomotives');
      return this.response.data;
    } catch (e) {
      return e;
    }
  }
}

const locomotivesService = new LocomotivesService();

export default locomotivesService;
