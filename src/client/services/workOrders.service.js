import axios from 'axios';

class WorkOrdersService {
  async get() {
    try {
      this.response = await axios.get('/api/v1/workOrders');
      return this.response.data;
    } catch (e) {
      return e;
    }
  }
}

const workOrdersService = new WorkOrdersService();

export default workOrdersService;
