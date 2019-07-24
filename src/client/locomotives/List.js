/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button } from 'evergreen-ui';
import axios from 'axios';
import BaseTable, { Column } from 'react-base-table';
import SingleColumn from '../components/layout/SingleColumn';
import { errorHandler } from '../utils/errorHandler';
import 'react-base-table/styles.css';

function List({ history }) {
  const [data, setData] = useState({ data: [{ id: '1', road: 'Test' }] });
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      axios('/api/v1/locomotives')
        .then(response => {
          const values = response.data.map(value => {
            return value.value;
          });
          const reducer = (accumulator, currentValue) =>
            Math.round(accumulator) + Math.round(currentValue);

          const totalValues = values.reduce(reducer);
          setData({ data: response.data, totalValues });
        })
        .catch(error => {
          errorHandler(history, error.reponse, error.response.status);
        });
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
    <Link to={`locomotives/${rowData.id}`}>{rowData.road}</Link>
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
    const sortedData = sortArrayOfObjects(
      data.data,
      sortByVal.key,
      sortByVal.order,
    );
    setSortBy(sortByVal);
    setData({ data: sortedData, totalValues: data.totalValues });
  };

  return (
    <SingleColumn history={history}>
      <h1>Locomotives</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <>
          <BaseTable
            onColumnSort={onColumnSort}
            data={data.data}
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
              title="Engine Number"
              key="engine_number"
              dataKey="engine_number"
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
              cellRenderer={booleanFormatter}
              title="DCC Equipped"
              key="is_dcc"
              dataKey="is_dcc"
              sortable
              width={200}
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
          <h2>Collection</h2>
          <ul>
            <li>
              <b>Locomotives:</b>
              {data.data.length}
            </li>
            <li>Value: ${data.totalValues}</li>
          </ul>
        </>
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
