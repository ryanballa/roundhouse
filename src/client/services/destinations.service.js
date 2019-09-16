import axios from 'axios';

class DestinationsService {
  async add(user, values) {
    try {
      this.response = await axios.post('/api/v1/destinations/', {
        ...values,
        user_id: user.id,
      });
      return this.response.data;
    } catch (e) {
      return e;
    }
  }

  async delete(destinationId) {
    try {
      this.response = await axios.delete(
        `/api/v1/destinations/${destinationId}`,
      );
      return { id: destinationId };
    } catch (e) {
      return e;
    }
  }

  async get() {
    try {
      this.response = await axios.get('/api/v1/destinations');
      return this.response.data;
    } catch (e) {
      return e;
    }
  }
}

const destinationsService = new DestinationsService();

export default destinationsService;
