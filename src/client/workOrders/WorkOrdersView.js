import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Breadcrumb } from '../components/atoms/Breadcrumb';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { userState } from '../UserProvider';
import AddTask from './components/AddTask';
import DeleteTask from './components/DeleteTask';

const StyledUl = styledComponent('ul', {
  '& .task': {
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
    await axios(`/api/v1/workOrders/${match.params.id}`).then(workOrderRes => {
      // if (!workOrder.data.length) {
      //   history.push('/404');
      // }
      setWorkOrder(workOrderRes.data);
      console.log(workOrderRes.data);
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
      <h1>{workOrder.workOrdersResults[0].name}</h1>
      <StyledUl>
        {workOrder.workItems.map(workItem => (
          <li>
            <h2>{workItem.destinationname}</h2>
            <AddTask
              destinationId={workItem.destinationid}
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
                <li className="task">
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
