/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BaseTable, { Column } from 'react-base-table';
import { AddButton } from '../components/atoms/AddButton';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { colors } from '../config/styles';
import WorkOrdersLocalNav from '../components/organisms/WorkOrdersLocalNav';
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

type WorkOrder = {
  key: string;
  order: string;
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

  const sortArrayOfObjects = (arr: string[], key: string, order: string) => {
    return arr.sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  };

  const onColumnSort = (sortByVal: WorkOrder) => {
    const sortedData = sortArrayOfObjects(data, sortByVal.key, sortByVal.order);
    setSortBy(sortByVal);
    setData({ value: sortedData });
  };

  return (
    <SingleColumn history={history}>
      <h1>Work Orders</h1>
      <p>
        Run your railroad like a real one with work orders to for operation
        sessions.
      </p>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          <AddButton
            data-testid="addWorkOrder"
            onClick={() => setIsAddWorkOrderOpen(true)}
          >
            Add Work Order
          </AddButton>
          <WorkOrdersLocalNav activeItem="workOrders" />
          <AddWorkOrder
            isOpen={isAddWorkOrderOpen}
            handleModalClose={() => {
              setIsAddWorkOrderOpen(false);
            }}
            handleUpdate={res => {
              const updated = data;
              updated.push(res);
              setData({ value: data });
              setIsAddWorkOrderOpen(false);
            }}
          />
          {!data[0] && data.length === 0 && (
            <p>
              Begin the fun by setting up Destinations, Traffic Generators, and
              Railcars. Once you've created one of each you're ready to create
              your first Work Order.
            </p>
          )}
          {data.length > 0 && (
            <>
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
            </>
          )}
        </StyledDiv>
      )}
    </SingleColumn>
  );
};

export default WorkOrders;
