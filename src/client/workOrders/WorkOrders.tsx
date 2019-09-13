/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BaseTable, { Column } from 'react-base-table';
import { AddButton } from '../components/atoms/AddButton';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { colors } from '../config/styles';
import TabMenu from '../components/atoms/TabMenu';
import AddWorkOrder from './components/AddWorkOrder';
import { usePromise } from '../utils/promise.hook';
import workOrdersService from '../services/workOrders.service';

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

type WorkOrdersProps = {
  history: {
    push: () => void;
  };
};

const WorkOrders: React.FC<WorkOrdersProps> = ({ history }) => {
  const [isAddWorkOrderOpen, setIsAddWorkOrderOpen] = useState(false);
  const [sortBy, setSortBy] = useState({ key: 'id', order: 'asc' });

  const [data, error, isLoading, setData] = usePromise(
    workOrdersService.get,
    [],
    [],
  );

  const linkFormatter = ({ rowData }) => (
    <Link to={`work-orders/${rowData.id}`}>{rowData.name}</Link>
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
      <h1>Work Orders</h1>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          <AddButton onClick={() => setIsAddWorkOrderOpen(true)}>
            Add Work Order
          </AddButton>
          <TabMenu>
            <li className="active">
              <Link to="/work-orders">Work Orders</Link>
            </li>
            <li>
              <Link to="/traffic-generators">Traffic Generators</Link>
            </li>
          </TabMenu>
          <AddWorkOrder
            isOpen={isAddWorkOrderOpen}
            handleModalClose={() => {
              setIsAddWorkOrderOpen(false);
            }}
            handleUpdate={() => {
              // fetchData();
              setIsAddWorkOrderOpen(false);
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
              cellRenderer={linkFormatter}
              title="Name"
              key="name"
              dataKey="name"
              sortable={true}
              width={300}
            />
            <Column
              title="Description"
              key="description"
              dataKey="description"
              sortable={true}
              width={500}
            />
          </BaseTable>
        </StyledDiv>
      )}
    </SingleColumn>
  );
};

export default WorkOrders;
