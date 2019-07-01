import React, { Fragment, useState, useEffect } from 'react'
import SingleColumn from '../components/layout/SingleColumn';
import { Link } from 'react-router-dom'
import axios from 'axios';

function List() {
  const [data, setData] = useState([{ id: '1', road: 'Test'}]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios(
        '/api/v1/locomotives',
      );
      setData(result.data);
      setIsLoading(false);
    }
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
              <Link key={locomotive.id} to={`locomotives/${locomotive.id}`}>{locomotive.road}</Link>
            </li>
          ))}
        </ul>
      )}
    </SingleColumn>
  );
}

export default List;
