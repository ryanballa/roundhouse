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
import Roadfilter from '../components/atoms/RoadFilter';
import { colors } from '../config/styles';
import { AddButton } from '../components/atoms/AddButton';
import ZeroState from '../components/atoms/ZeroState';
import TabMenu from '../components/atoms/TabMenu';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import 'react-base-table/styles.css';

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
  '& .filters': {
    '& input': {
      marginRight: '10px',
    },
    '& li': {
      listStyle: 'none',
    },
    '& ul': {
      margin: '0 15px 0 0',
      padding: 0,
    },
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
  marginTop: '20px',
});

function List({ history, location }) {
  const [data, setData] = useState({
    data: [{ id: '001', road: 'Test' }],
    displayedData: [],
    roads: [],
  });
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });
  const [filters, setFilters] = useState([]);
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

  const getListOfRoads = roadData => {
    const roads = [];
    roadData.forEach(locomotive => {
      roads.push(locomotive.road);
    });
    const sortedRoads = roads.sort((a, b) => {
      return a > b ? 1 : -1;
    });
    const uniqueSet = new Set(sortedRoads);
    return [...uniqueSet];
  };

  const getTotalValue = totalValues => {
    const values = totalValues.map(value => value.value);
    if (!values.length) {
      return [];
    }
    const reducer = (accumulator, currentValue) =>
      Math.round(accumulator) + Math.round(currentValue);

    return values.reduce(reducer);
  };

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      axios(`/api/v1/locomotives?running=${qsValues.running}`)
        .then(response => {
          setData({
            data: response.data,
            displayedData: response.data,
            roads: getListOfRoads(response.data),
            totalValues: getTotalValue(response.data),
            typeGraphData: generateGraphData(response.data),
          });
          setIsLoading(false);
        })
        .catch(error => {
          console.log(error);
        });
    };
    fetchData();
  }, [location]);

  const booleanFormatter = ({ cellData }) => {
    return cellData ? 'Yes' : 'No';
  };

  const photoFormatter = ({ cellData }) => {
    return cellData ? <img alt="Locomotive" src={cellData} width="75" /> : '';
  };

  photoFormatter.propTypes = {
    cellData: {},
  };

  photoFormatter.defaultProps = {
    cellData: '',
  };

  const dateFormatter = ({ cellData }) =>
    cellData ? moment(cellData).format('MM/DD/YYYY') : '';

  const linkFormatter = ({ rowData }) => (
    <Link to={`locomotives/${rowData.id}`}>{rowData.road}</Link>
  );

  linkFormatter.propTypes = {
    rowData: PropTypes.shape({
      id: PropTypes.string,
      road: PropTypes.string,
    }),
  };

  linkFormatter.defaultProps = {
    rowData: {},
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
      totalValues: data.totalValues,
      typeGraphData: generateGraphData(sortedData),
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
      totalValues: getTotalValue(
        filteredData.length ? filteredData : data.data,
      ),
      typeGraphData: generateGraphData(
        filteredData.length ? filteredData : data.data,
      ),
    });
  };

  return (
    <SingleColumn history={history}>
      <h1>Locomotives</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          {!data.data[0] && data.displayedData.length === 0 && (
            <ZeroState entity="locomotive" to="/locomotives/add">
              <p>
                Add a locomotive to begin building a record of your collection.
              </p>
            </ZeroState>
          )}
          {data.displayedData.length > 0 && (
            <>
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
                    title="Engine Number"
                    key="engine_number"
                    dataKey="engine_number"
                    sortable
                    width={200}
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
                    width={120}
                  />
                  <Column
                    cellRenderer={dateFormatter}
                    title="Purchase Date"
                    key="purchased_on"
                    dataKey="purchased_on"
                    sortable
                    width={200}
                  />
                </BaseTable>
              </section>
              <div className="items">
                <div className="itemCallout">
                  <h2>Collection</h2>
                  <ul>
                    <li>
                      <b>Locomotives: </b>
                      {data.data.length}
                    </li>
                    <li>Value: ${data.totalValues}</li>
                  </ul>
                </div>
                <div className="itemCallout">
                  <h2>Equipment</h2>
                  <PieChart
                    data={data.typeGraphData}
                    colors={['#8CC3F5', '#21517d', '#1F34A3', '#8078B7']}
                  />
                </div>
              </div>
              <h2>More Tasks</h2>
              <Link to="/locomotives/csv">Download CSV</Link>
            </>
          )}
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
