/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button } from 'evergreen-ui';
import axios from 'axios';
import ReactDataGrid from 'react-data-grid';
import SingleColumn from '../components/layout/SingleColumn';
import { errorHandler } from '../utils/errorHandler';

function List({ history }) {
  const [data, setData] = useState([{ id: '1', road: 'Test' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(data);

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
          setData(response.data);
          setRows({ ...response.data, totalValues });
        })
        .catch(error => {
          errorHandler(history, error.reponse, error.response.status);
        });
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const booleanFormatter = ({ value }) => {
    return value ? 'Yes' : 'No';
  };

  const dateFormatter = ({ value }) =>
    value ? moment(value).format('MM/DD/YYYY') : '';

  const linkFormatter = ({ row }) => (
    <Link to={`locomotives/${row.id}`}>{row.road}</Link>
  );

  const defaultColumnProperties = {
    sortable: true,
  };

  const columns = [
    { key: 'id', name: 'ID', sortDescendingFirst: true, width: 120 },
    { formatter: linkFormatter, key: 'road', name: 'Road', width: 220 },
    { key: 'engine_number', name: 'Engine Number', width: 180 },
    {
      formatter: booleanFormatter,
      key: 'is_operational',
      name: 'Operational',
      width: 120,
    },
    {
      formatter: booleanFormatter,
      key: 'is_dcc',
      name: 'DCC Equipped',
      width: 180,
    },
    { key: 'location', name: 'Location', width: 120 },
    {
      formatter: dateFormatter,
      key: 'purchased_on',
      name: 'Purchase Date',
      width: 250,
    },
  ].map(c => ({ ...c, ...defaultColumnProperties }));

  const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      }
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    };
    return sortDirection === 'NONE' ? initialRows : [...rows].sort(comparer);
  };

  return (
    <SingleColumn history={history}>
      <h1>Locomotives</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <>
          <ReactDataGrid
            columns={columns}
            rowGetter={i => rows[i]}
            rowsCount={50}
            minHeight={500}
            onGridSort={(sortColumn, sortDirection) =>
              setRows(sortRows(data, sortColumn, sortDirection))
            }
          />
          <h2>Collection</h2>
          <ul>
            <li>
              <b>Locomotives:</b>
              {rows.length}
            </li>
            <li>Value: ${rows.totalValues}</li>
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
