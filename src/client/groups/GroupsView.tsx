/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BaseTable, { Column } from 'react-base-table';
import { AddButton } from '../components/atoms/AddButton';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import WorkOrdersLocalNav from '../components/organisms/WorkOrdersLocalNav';
import { colors } from '../config/styles';
import AddGroup from './components/AddGroup';
import DeleteGroup from './components/DeleteGroup';
import { usePromise } from '../utils/promise.hook';
import groupsService from '../services/groups.service';

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

const GroupsView: React.FC<TrafficGenratorsProps> = ({ history }) => {
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });
  const [data, error, isLoading, setData] = usePromise(
    groupsService.get,
    [],
    [],
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
    setData({ value: sortedData });
  };

  const deleteFormatter = ({ cellData }) => {
    return (
      <DeleteGroup
        groupId={cellData}
        handleDelete={res => {
          setData({ value: res });
        }}
      />
    );
  };

  return (
    <SingleColumn history={history}>
      <h1>Groups</h1>
      <p>Group Work Orders by operation session.</p>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          <AddButton
            data-testid="addDestination"
            onClick={() => setIsAddGroupOpen(true)}
          >
            Add Group
          </AddButton>
          <WorkOrdersLocalNav activeItem="groups" />
          <AddGroup
            isOpen={isAddGroupOpen}
            handleModalClose={() => {
              setIsAddGroupOpen(false);
            }}
            handleUpdate={res => {
              setData({ value: [...data, { ...res.data, ...res.values }] });
              setIsAddGroupOpen(false);
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
              cellRenderer={deleteFormatter}
              title="Delete"
              key="delete"
              dataKey="id"
              width={300}
            />
          </BaseTable>
        </StyledDiv>
      )}
    </SingleColumn>
  );
};

export default GroupsView;
