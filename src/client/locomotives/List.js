/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PieChart } from 'react-chartkick';
import 'chart.js';
import BaseTable, { Column } from 'react-base-table';
import { AddButton } from '../components/atoms/AddButton';
import TabMenu from '../components/atoms/TabMenu';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { errorHandler } from '../utils/errorHandler';
import 'react-base-table/styles.css';
import { colors } from '../config/styles';

const StyledDiv = styledComponent('div', {
  '& .BaseTable__body': {
    color: colors.body,
    fontSize: '16px',
  },
  '& .BaseTable__header-row': {
    borderBottom: `1px solid ${colors.border}`,
    fontSize: '16px',
    fontWeight: 600,
  },
  '& .BaseTable__row': {
    border: 'none',
  },
  '& .BaseTable__table': {
    outline: 'none',
  },
  '& .addLocomotive': {
    float: 'right',
  },
  '& .itemCallout': {
    width: '50%',
  },
  '& .items': {
    display: 'flex',
    marginTop: '20px',
  },
});

function List({ history, location }) {
  const [data, setData] = useState({ data: [{ id: '1', road: 'Test' }] });
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const qsValues = queryString.parse(location.search);

  if (Object.entries(qsValues).length === 0) {
    qsValues.running = 'true';
  }

  const generateGraphData = engineData => {
    const steam = engineData.filter(item => item.type === 'steam');
    const diesel = engineData.filter(item => item.type === 'diesel');
    const trolley = engineData.filter(item => item.type === 'trolley');
    const other = engineData.filter(item => item.type === 'other');

    return [
      ['Steam', steam.length],
      ['Diesel', diesel.length],
      ['Trolley', trolley.length],
      ['Other', other.length],
    ];
  };

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      axios(`/api/v1/locomotives?running=${qsValues.running}`)
        .then(response => {
          const values = response.data.map(value => {
            return value.value;
          });
          const reducer = (accumulator, currentValue) =>
            Math.round(accumulator) + Math.round(currentValue);

          const totalValues = values.reduce(reducer);
          setData({
            data: response.data,
            totalValues,
            typeGraphData: generateGraphData(response.data),
          });
        })
        .catch(error => {
          console.log(error);
        });
      setIsLoading(false);
    };
    fetchData();
  }, [location]);

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
    setData({
      data: sortedData,
      totalValues: data.totalValues,
      typeGraphData: generateGraphData(sortedData),
    });
  };

  return (
    <SingleColumn history={history}>
      <h1>Locomotives</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          <AddButton className="addLocomotive" to="/locomotives/add">
            Add Locomotive
          </AddButton>
          <TabMenu>
            <li className={qsValues.running === 'true' ? 'active' : ''}>
              <Link to="/locomotives?running=true">Running</Link>
            </li>
            <li className={qsValues.running === 'false' ? 'active' : ''}>
              <Link to="/locomotives?running=false">Needs Work</Link>
            </li>
          </TabMenu>
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
          <div className="items">
            <div className="itemCallout">
              <h2>Collection</h2>
              <ul>
                <li>
                  <b>Locomotives:</b>
                  {data.data.length}
                </li>
                <li>Value: ${data.totalValues}</li>
              </ul>
            </div>
            <div className="itemCallout">
              <h2>Equipment</h2>
              <PieChart data={data.typeGraphData} />
            </div>
          </div>
        </StyledDiv>
      )}
    </SingleColumn>
  );
}

List.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default List;
