import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'evergreen-ui';
import axios from 'axios';
import SingleColumn from '../components/layout/SingleColumn';

function List({ history }) {
  const [data, setData] = useState([{ id: '1', road: 'Test' }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios('/api/v1/locomotives');
      setData(result.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <SingleColumn>
      <h1>Locomotives</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.map(locomotive => (
            <li key={locomotive.id}>
              <Link key={locomotive.id} to={`locomotives/${locomotive.id}`}>
                {locomotive.road}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Button
        iconBefore="add"
        onClick={() => {
          history.push('/locomotives/add');
        }}
      >
        Add Locomotive
      </Button>
    </SingleColumn>
  );
}

List.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default List;
