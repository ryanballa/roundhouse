import axios from 'axios';

class GroupsService {
  async add(user, values) {
    try {
      this.response = await axios.post('/api/v1/work_order_groups/', {
        ...values,
        user_id: user.id,
      });
      return this.response.data;
    } catch (e) {
      return e;
    }
  }

  async delete(groupId) {
    try {
      this.response = await axios.delete(
        `/api/v1/work_order_groups/${groupId}`,
      );
      return { id: groupId };
    } catch (e) {
      return e;
    }
  }

  async get() {
    try {
      this.response = await axios.get('/api/v1/work_order_groups');
      return this.response.data;
    } catch (e) {
      return e;
    }
  }
}

const groupsService = new GroupsService();

export default groupsService;
