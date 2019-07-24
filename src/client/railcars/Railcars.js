/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button } from 'evergreen-ui';
import axios from 'axios';
import BaseTable, { Column } from 'react-base-table';
import SingleColumn from '../components/layout/SingleColumn';

function Railcars({ history }) {
  const [data, setData] = useState([{ id: '1', road: 'Test' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios('/api/v1/railcars');
      setData(result.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const booleanFormatter = ({ cellData }) => {
    return cellData ? 'Yes' : 'No';
  };

  const dateFormatter = ({ cellData }) =>
    cellData ? moment(cellData).format('MM/DD/YYYY') : '';

  const linkFormatter = ({ rowData }) => (
    <Link to={`railcars/${rowData.id}`}>{rowData.road}</Link>
  );

  const sortArrayOfObjects = (arr, key, order) => {
    return arr.sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  };

  const onColumnSort = sortByVal => {
    const sortedData = sortArrayOfObjects(data, sortByVal.key, sortByVal.order);
    setSortBy(sortByVal);
    setData(sortedData);
  };

  return (
    <SingleColumn history={history}>
      <h1>Railcars</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <BaseTable
          onColumnSort={onColumnSort}
          data={data}
          sortBy={sortBy}
          width={1200}
          height={400}
        >
          <Column sortable title="Id" key="id" dataKey="id" width={100} />
          <Column
            cellRenderer={linkFormatter}
            title="Road"
            key="road"
            dataKey="road"
            sortable
            width={300}
          />
          <Column
            title="Car Number"
            key="car_number"
            dataKey="car_number"
            sortable
            width={250}
          />
          <Column
            cellRenderer={booleanFormatter}
            title="Operational"
            key="is_operational"
            dataKey="is_operational"
            sortable
            width={250}
          />
          <Column
            title="Location"
            key="location"
            dataKey="location"
            sortable
            width={200}
          />
          <Column
            cellRenderer={dateFormatter}
            title="Purchase Date"
            key="purchased_on"
            dataKey="purchased_on"
            sortable
            width={220}
          />
        </BaseTable>
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
