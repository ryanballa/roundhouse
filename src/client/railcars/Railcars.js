import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'evergreen-ui';
import axios from 'axios';
import SingleColumn from '../components/layout/SingleColumn';

function Railcars({ history }) {
  const [data, setData] = useState([{ id: '1', road: 'Test' }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios('/api/v1/railcars');
      setData(result.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <SingleColumn>
      <h1>Railcars</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.map(railcar => (
            <li key={railcar.id}>
              <Link key={railcar.id} to={`railcars/${railcar.id}`}>
                {railcar.road}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Button
        iconBefore="add"
        onClick={() => {
          history.push('/railcars/add');
        }}
      >
        Add Railcar
      </Button>
    </SingleColumn>
  );
}

Railcars.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Railcars;
