import axios from 'axios';

class UsersService {
  async get() {
    try {
      this.response = await axios.get('/api/v1/users');
      return this.response.data;
    } catch (e) {
      return e;
    }
  }
}

const usersService = new UsersService();

export default usersService;
