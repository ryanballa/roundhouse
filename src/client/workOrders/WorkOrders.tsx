/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [workOrderGroups, setWorkOrderGroups] = useState([]);
  const [isAddWorkOrderOpen, setIsAddWorkOrderOpen] = useState(false);
  const [sortBy, setSortBy] = useState({ key: 'assignee', order: 'desc' });
  const [sortedData, setSortedData] = useState([]);
  const [data, error, isLoading, setData] = usePromise(
    workOrdersService.get,
    [],
    [],
  );

  const linkFormatter = ({ rowData }) => (
    <Link to={`work-orders/${rowData.id}`}>{rowData.name}</Link>
  );

  const groupFormatter = ({ rowData }) => {
    const workOrderGroupDisplay = workOrderGroups.find(
      item => item.id === rowData.work_orders_group_id,
    );
    const dataToDisplay = workOrderGroupDisplay
      ? workOrderGroupDisplay.name
      : rowData.work_orders_group_id;
    return <span>{dataToDisplay}</span>;
  };

  const sortArrayOfObjects = (arr: string[], key: string, order: string) => {
    return arr.sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  };

  useEffect(() => {
    if (!workOrderGroups.length) {
      axios.get('/api/v1/work_order_groups/').then(data => {
        setWorkOrderGroups(data.data);
      });
    }
    const sortedData = sortArrayOfObjects(data, 'assignee', 'desc');
    setSortedData(data);
  }, [data]);

  const onColumnSort = (sortByVal: WorkOrder) => {
    const newSortedData = sortArrayOfObjects(
      sortedData,
      sortByVal.key,
      sortByVal.order,
    );
    setSortBy(sortByVal);
    setSortedData(data);
  };

  return (
    <SingleColumn history={history}>
      <h1>Work Orders</h1>
      <p>
        Run your railroad like a real one with work orders for operation
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
              const updated = sortedData;
              updated.push(res);
              setData({ value: sortedData });
              setIsAddWorkOrderOpen(false);
            }}
          />
          {!sortedData[0] && sortedData.length === 0 && (
            <p>
              Begin the fun by setting up Destinations, Traffic Generators, and
              Railcars. Once you've created one of each you're ready to create
              your first Work Order.
            </p>
          )}
          {sortedData.length > 0 && (
            <>
              <BaseTable
                onColumnSort={onColumnSort}
                data={sortedData}
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
                <Column
                  title="Complexity"
                  key="complexity"
                  dataKey="complexity"
                  sortable={true}
                  width={200}
                />
                <Column
                  title="Assignee"
                  key="assignee"
                  dataKey="assignee"
                  sortable={true}
                  width={200}
                />
                <Column
                  cellRenderer={groupFormatter}
                  title="Group"
                  key="work_orders_group_id"
                  dataKey="work_orders_group_id"
                  sortable={true}
                  width={200}
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
