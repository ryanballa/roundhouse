/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BaseTable, { Column } from 'react-base-table';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { colors } from '../config/styles';
import { usePromise } from '../utils/promise.hook';
import usersService from '../services/users.service';

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

type UsersViewProps = {
  history: {
    push: () => void;
  };
};

type User = {
  id: number;
  full_name: string;
  key: string;
  order: string;
  username: string;
};

const UsersView: React.FC<UsersViewProps> = ({ history }) => {
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });

  const [data, error, isLoading, setData] = usePromise(
    usersService.get,
    [],
    [],
  );

  const linkFormatter = ({ rowData }) => (
    <Link to={`users/${rowData.id}`}>{rowData.name}</Link>
  );

  const sortArrayOfObjects = (arr: string[], key: string, order: string) => {
    return arr.sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  };

  const onColumnSort = (sortByVal: User) => {
    const sortedData = sortArrayOfObjects(data, sortByVal.key, sortByVal.order);
    setSortBy(sortByVal);
    setData({ value: sortedData });
  };

  return (
    <SingleColumn history={history}>
      <h1>Users</h1>
      <p>All users in the platform.</p>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
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
              cellRenderer={linkFormatter}
              title="Full Name"
              key="full_name"
              dataKey="full_name"
              sortable={true}
              width={300}
            />
            <Column
              title="Username"
              key="username"
              dataKey="username"
              sortable={true}
              width={500}
            />
          </BaseTable>
        </StyledDiv>
      )}
    </SingleColumn>
  );
};

export default UsersView;
