import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Breadcrumb from '../components/atoms/Breadcrumb';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { userState } from '../UserProvider';
import AddTask from './components/AddTask';
import DeleteTask from './components/DeleteTask';
import AddWorkItem from './components/AddWorkItem';
import DeleteWorkItem from './components/DeleteWorkItem';
import Button from '../components/atoms/Button';

const HeaderToolBar = styledComponent('div', {
  '& h1': {
    margin: 0,
  },
  display: 'flex',
  justifyContent: 'space-between',
  margin: '25px 0',
});

const StyledUl = styledComponent('ul', {
  '& .task': {
    alignItems: 'center',
    display: 'flex',
  },
  '& .destinationWrapper': {
    alignItems: 'center',
    display: 'flex',
  },
});

const WorkOrdersView = ({ history, match }) => {
  const [workOrder, setWorkOrder] = useState({
    workItems: [],
    destinations: [],
    traffic: [],
    workOrdersResults: [{}],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = userState();

  const fetchData = async () => {
    setIsLoading(true);
    await axios(`/api/v1/workOrders/${match.params.id}`)
      .then(workOrderRes => {
        if (!workOrderRes.data) {
          history.push('/404');
        }
        setWorkOrder(workOrderRes.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SingleColumn history={history}>
      <Breadcrumb
        items={[
          { link: '/work-orders', text: 'Work Orders' },
          { text: workOrder.workOrdersResults[0].name },
        ]}
      />
      <HeaderToolBar>
        <h1>{workOrder.workOrdersResults[0].name}</h1>
        <Button
          icon="print"
          onClick={() => {
            window.print();
          }}
        >
          Print
        </Button>
      </HeaderToolBar>
      <StyledUl>
        {workOrder.workItems.map(workItem => (
          <li key={workItem.id}>
            <div className="destinationWrapper">
              <h2>{workItem.destinationname}</h2>
              {!workItem.tasks.length && (
                <DeleteWorkItem
                  workItemId={workItem.id}
                  handleDelete={() => {
                    fetchData();
                  }}
                />
              )}
            </div>
            <AddTask
              handleUpdate={() => {
                fetchData();
              }}
              railcars={workOrder.railcars}
              trafficGenerators={workOrder.trafficGenerators}
              workItemId={workItem.id}
            />
            <p>Scheduled work at {workItem.destinationname}</p>
            <ul>
              {workItem.tasks.map(task => (
                <li key={task.id} className="task">
                  [ ] {task.taskstype}{' '}
                  {task.taskstype === 'pick' ? 'up' : 'off'} {task.road}{' '}
                  {task.car_number} {task.type} {task.length}&#39; {task.color}{' '}
                  from {task.name}
                  <DeleteTask
                    taskId={task.id}
                    handleDelete={() => {
                      fetchData();
                    }}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </StyledUl>
      <h3>Add Destination</h3>
      <AddWorkItem
        destinations={workOrder.destinations}
        handleUpdate={() => {
          fetchData();
        }}
        order={workOrder.workItems.length}
        workOrderId={workOrder.workOrdersResults[0].id}
      />
    </SingleColumn>
  );
};

WorkOrdersView.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default WorkOrdersView;
