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
import { filter } from 'rxjs/operators';

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
});

function List({ history, location }) {
  const [data, setData] = useState({
    data: [{ id: '1', road: 'Test' }],
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

  const getListOfRoads = data => {
    const roads = [];
    data.forEach(locomotive => {
      roads.push(locomotive.road);
    });
    const uniqueSet = new Set(roads);
    return [...uniqueSet];
  };

  const getTotalValue = data => {
    const values = data.map(value => value.value);

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
            <div className="filters">
              <h2>Filter</h2>
              <ul>
                {data.roads.map((road, i) => (
                  <li key={i}>
                    <input
                      data-testid={road}
                      onChange={e => {
                        const options = filters;
                        let index;
                        if (e.target.checked) {
                          options.push(+e.target.value);
                        } else {
                          index = options.indexOf(+e.target.value);
                          options.splice(index, 1);
                        }
                        setFilters(options);
                        onFilter(options);
                      }}
                      type="checkbox"
                      value={i}
                    />
                    {road}
                  </li>
                ))}
              </ul>
            </div>
            <BaseTable
              onColumnSort={onColumnSort}
              data={data.displayedData}
              sortBy={sortBy}
              width={1000}
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
