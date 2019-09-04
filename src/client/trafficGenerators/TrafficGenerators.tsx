/* eslint-disable react/no-multi-comp */
import React, { FunctionComponent, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BaseTable, { Column } from 'react-base-table';
import { AddButton } from '../components/atoms/AddButton';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import TabMenu from '../components/atoms/TabMenu';
import { colors } from '../config/styles';
import AddTrafficGenerator from './components/AddTrafficGenerator';

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
  '& .itemCallout': {
    width: '50%',
  },
  '& .items': {
    display: 'flex',
    marginTop: '20px',
  },
});

type TrafficGenratorsProps = {
  history: {
    push: () => void;
  };
};

const TrafficGenrators: FunctionComponent<TrafficGenratorsProps> = ({
  history,
}) => {
  const [isAddTrafficGeneratorOpen, setIsAddTrafficGeneratorOpen] = useState(
    false,
  );
  const [data, setData] = useState([{ id: '1', road: 'Test' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });

  const fetchData = async () => {
    setIsLoading(true);
    const result = await axios('/api/v1/trafficGenerators');
    setData(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <h1>Traffic Generators</h1>
      <p>
        Industries and places that output or require railcars on your railroad.
      </p>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          <AddButton onClick={() => setIsAddTrafficGeneratorOpen(true)}>
            Add Traffic Generator
          </AddButton>
          <TabMenu>
            <li>
              <Link to="/work-orders">Work Orders</Link>
            </li>
            <li className="active">
              <Link to="/traffic-generators">Traffic Generators</Link>
            </li>
          </TabMenu>
          <AddTrafficGenerator
            isOpen={isAddTrafficGeneratorOpen}
            handleModalClose={() => {
              setIsAddTrafficGeneratorOpen(false);
            }}
            handleUpdate={() => {
              fetchData();
              setIsAddTrafficGeneratorOpen(false);
            }}
          />
          <BaseTable
            onColumnSort={onColumnSort}
            data={data}
            sortBy={sortBy}
            width={1200}
            height={400}
          >
            <Column
              sortable={true}
              title="Id"
              key="id"
              dataKey="id"
              width={100}
            />
            <Column
              title="Name"
              key="name"
              dataKey="name"
              sortable={true}
              width={300}
            />
            <Column
              title="Type"
              key="type"
              dataKey="type"
              sortable={true}
              width={500}
            />
          </BaseTable>
        </StyledDiv>
      )}
    </SingleColumn>
  );
};

export default TrafficGenrators;
