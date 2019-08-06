import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toaster } from 'evergreen-ui';
import axios from 'axios';

import { userState } from '../UserProvider';
import LocomotivesEdit from './LocomotivesEdit';

const EditContainer = ({ history, match }) => {
  const [data, setData] = useState([{ engine_number: '123', road: 'Test' }]);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = userState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      function loadPhotos() {
        axios(`/api/v1/photos/`)
          .then(photosRes => {
            setPhotos(photosRes.data);
          })
          .catch(e => {
            console.log(e);
          });
      }

      function loadData() {
        axios(`/api/v1/locomotives/${match.params.id}`)
          .then(locomotive => {
            if (!locomotive.data.locomotive.length) {
              history.push('/404');
            }
            setData(locomotive.data.locomotive);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }

      await Promise.all([loadPhotos(), loadData()]);
    };
    fetchData();
  }, []);

  const handleSubmit = values => {
    axios
      .put(`/api/v1/locomotives/${match.params.id}`, values)
      .then(() => {
        setIsLoading(true);
        toaster.success('Locomotive Saved');
        history.push('/locomotives');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`/api/v1/locomotives/${match.params.id}`)
      .then(() => {
        toaster.success('Locomotive Deleted');
        history.push('/locomotives');
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <LocomotivesEdit
      data={data}
      handleDelete={handleDelete}
      handleFormSubmit={handleSubmit}
      history={history}
      isLoading={isLoading}
      photos={photos}
      user={user}
    />
  );
};

EditContainer.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default EditContainer;
