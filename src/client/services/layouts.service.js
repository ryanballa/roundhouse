import axios from 'axios';

class LayoutsService {
  async add(user, values) {
    try {
      this.response = await axios.post('/api/v1/layouts/', {
        ...values,
        user_id: user.id,
      });
      return this.response.data;
    } catch (e) {
      return e;
    }
  }

  async edit(user, values) {
    try {
      this.response = await axios.put(`/api/v1/layouts/${values.id}`, {
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
      this.response = await axios.get('/api/v1/layouts');
      return this.response.data;
    } catch (e) {
      return e;
    }
  }
}

const layoutsService = new LayoutsService();

export default layoutsService;
