/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BaseTable, { Column } from 'react-base-table';
import Roadfilter from '../components/atoms/RoadFilter';
import { AddButton } from '../components/atoms/AddButton';
import SingleColumn from '../components/layout/SingleColumn';
import ZeroState from '../components/atoms/ZeroState';
import { styledComponent } from '../utils/styledComponent';
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
  '& input': {
    marginBottom: '20px',
  },
  '& .itemCallout': {
    width: '50%',
  },
  '& .items': {
    display: 'flex',
    marginTop: '20px',
  },
  '& .tableWrapper': {
    display: 'flex',
  },
});

function Railcars({ history }) {
  const [data, setData] = useState({
    data: [{ id: '001', road: 'Test' }],
    displayedData: [],
    roads: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState([]);
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });

  useEffect(() => {
    const getListOfRoads = roadData => {
      const roads = [];
      roadData.forEach(locomotive => {
        roads.push(locomotive.road);
      });
      const uniqueSet = new Set(roads);
      return [...uniqueSet];
    };

    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios('/api/v1/railcars');
      setData({
        data: result.data,
        displayedData: result.data,
        roads: getListOfRoads(result.data),
      });
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const photoFormatter = ({ cellData }) => {
    return cellData ? <img alt="Locomotive" src={cellData} width="75" /> : '';
  };

  photoFormatter.propTypes = {
    cellData: {},
  };

  photoFormatter.defaultProps = {
    cellData: '',
  };

  const booleanFormatter = ({ cellData }) => {
    return cellData ? 'Yes' : 'No';
  };

  const dateFormatter = ({ cellData }) =>
    cellData ? moment(cellData).format('MM/DD/YYYY') : '';

  const linkFormatter = ({ rowData }) => (
    <Link to={`railcars/${rowData.id}`}>{rowData.road}</Link>
  );

  linkFormatter.propTypes = {
    rowData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        road: PropTypes.string,
      }),
    ),
  };

  linkFormatter.defaultProps = {
    rowData: [],
  };

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
      data: data.data,
      displayedData: sortedData,
      roads: data.roads,
    });
  };

  const onSearch = e => {
    const filteredData = data.data.filter(dataItem => {
      return (
        dataItem.road.toLowerCase() === e.target.value ||
        dataItem.car_number === parseInt(e.target.value)
      );
    });
    setFilters([]);
    setData({
      data: data.data,
      displayedData: filteredData.length ? filteredData : data.data,
      roads: data.roads,
    });
  };

  const onFilter = filterVals => {
    const filteredData = [];

    filterVals.forEach(val => {
      const items = data.data.filter(
        dataItem => dataItem.road === data.roads[val],
      );
      items.forEach(item => {
        filteredData.push(item);
      });
    });

    setData({
      data: data.data,
      displayedData: filteredData.length ? filteredData : data.data,
      roads: data.roads,
    });
  };

  return (
    <SingleColumn history={history}>
      <h1>Railcars</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          {!data.data[0] && data.data.length === 0 && (
            <ZeroState entity="railcar" to="/railcars/add">
              <p>
                Add a railcar to begin building a record of your collection.
              </p>
            </ZeroState>
          )}
          {data.data.length > 0 && (
            <>
              <AddButton className="addRailcar" to="/railcars/add">
                Add Railcar
              </AddButton>
              <h2>Search</h2>
              <input onChange={e => onSearch(e)} type="text" />
              <section className="tableWrapper">
                <Roadfilter
                  data={data}
                  filters={filters}
                  onFilter={options => {
                    onFilter(options);
                  }}
                  setFilters={options => {
                    setFilters(options);
                  }}
                />
                <BaseTable
                  onColumnSort={onColumnSort}
                  data={data.displayedData}
                  sortBy={sortBy}
                  width={1000}
                  height={400}
                >
                  <Column
                    cellRenderer={photoFormatter}
                    sortable
                    title="Photo"
                    key="thumbnail"
                    dataKey="thumbnail"
                    width={100}
                  />
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
              </section>
              <h2>More Tasks</h2>
              <Link to="/railcars/csv">Download CSV</Link>
            </>
          )}
        </StyledDiv>
      )}
    </SingleColumn>
  );
}

Railcars.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Railcars;
