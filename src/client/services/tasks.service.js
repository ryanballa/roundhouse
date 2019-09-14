import axios from 'axios';

class TasksService {
  async get() {
    try {
      this.response = await axios.get('/api/v1/tasks');
      return this.response.data;
    } catch (e) {
      return e;
    }
  }
}

const tasksService = new TasksService();

export default tasksService;
