import axios from 'axios';

const api = {
  destinations: {
    get: (success, error) => {
      axios('/api/v1/destinations')
        .then(res => {
          success(res);
        })
        .catch(err => {
          error(err);
        });
    },
  },
  trafficGenerators: {
    add: (user, success, error) => {
      axios
        .post('/api/v1/trafficGenerators/', {
          ...values,
          user_id: user.id,
        })
        .then(res => {
          success(res);
        })
        .catch(err => {
          error(err);
        });
    },
    delete: (trafficGeneratorId, success, error) => {
      axios
        .delete(`/api/v1/trafficGenerators/${trafficGeneratorId}`)
        .then(data => {
          success(data);
        })
        .catch(err => {
          error(err);
        });
    },
    get: (success, error) => {
      axios('/api/v1/trafficGenerators')
        .then(data => {
          success(data);
        })
        .catch(err => {
          error(err);
        });
    },
  },
};

export default api;
