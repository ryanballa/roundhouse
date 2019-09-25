import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import shortid from 'shortid';
import { AddButton } from '../components/atoms/AddButton';
import Breadcrumb from '../components/atoms/Breadcrumb';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import AddTask from './components/AddTask';
import DeleteTask from './components/DeleteTask';
import AddWorkItem from './components/AddWorkItem';
import DeleteWorkItem from './components/DeleteWorkItem';
import Button from '../components/atoms/Button';
import DeleteWorkOrder from './components/DeleteWorkOrder';
import { usePromise } from '../utils/promise.hook';
import railcarsService from '../services/railcars.service';
import tasksService from '../services/tasks.service';

const HeaderToolBar = styledComponent('div', {
  '& .butonWrapper': {
    display: 'flex',
  },
  '& h1': {
    margin: 0,
  },
  '@media print': {
    '.printButton': {
      display: 'none',
    },
  },
  display: 'flex',
  justifyContent: 'space-between',
  margin: '25px 0',
});
const StyledDestWrapper = styledComponent('div', {
  '@media print': {
    display: 'none',
  },
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
  '& .addButtonWrapper': {
    '@media print': {
      display: 'none',
    },
  },
  '& .addButtonWrapper > div': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  '@media print': {
    '& p': {
      fontSize: '190%',
    },
    fontSize: '190%',
  },
});

const WorkOrdersView = ({ history, match }) => {
  const [workOrder, setWorkOrder] = useState({
    workItems: [],
    destinations: [],
    traffic: [],
    trafficGenerators: [],
    workOrdersResults: [{}],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [addingWorkItem, setAddingWorkItem] = useState(false);
  const [railcars, isRailcarsLoading] = usePromise(railcarsService.get, [], []);
  const [tasks, isTasksLoading] = usePromise(tasksService.get, [], []);

  const fetchData = async () => {
    setIsLoading(true);
    await axios(`/api/v1/workOrders/${match.params.id}`)
      .then(workOrderRes => {
        if (!workOrderRes.data) {
          history.push('/404');
        }
        setWorkOrder(workOrderRes.data);
        setIsLoading(false);
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
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div>
          <Breadcrumb
            items={[
              { link: '/work-orders', text: 'Work Orders' },
              { text: workOrder.workOrdersResults[0].name },
            ]}
          />
          <HeaderToolBar>
            <h1>{workOrder.workOrdersResults[0].name}</h1>
            <div className="butonWrapper">
              {!workOrder.workItems.length && (
                <DeleteWorkOrder
                  workOrderId={workOrder.workOrdersResults[0].id}
                  handleDelete={() => {
                    history.push('/work-orders');
                  }}
                />
              )}
              <Button
                additionalClasses="printButton"
                icon="print"
                onClick={() => {
                  window.print();
                }}
              >
                Print
              </Button>
            </div>
          </HeaderToolBar>
          {!isRailcarsLoading && !isTasksLoading && (
            <AddTask
              isOpen={isAddTaskOpen}
              handleUpdate={() => {
                fetchData();
                setIsAddTaskOpen(false);
              }}
              handleModalClose={() => {
                setIsAddTaskOpen(false);
              }}
              railcars={railcars}
              trafficGenerators={workOrder.trafficGenerators.filter(
                tg => tg.destination_id === addingWorkItem.destinationid,
              )}
              tasks={tasks}
              workItemId={addingWorkItem.id}
            />
          )}
          <StyledUl>
            {workOrder.workItems.map(workItem => (
              <li key={shortid.generate()}>
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
                <div className="addButtonWrapper">
                  <AddButton
                    onClick={() => {
                      setAddingWorkItem(workItem);
                      setIsAddTaskOpen(true);
                    }}
                  >
                    Add Task
                  </AddButton>
                </div>
                <p>Scheduled work at {workItem.destinationname}</p>
                {!workItem.tasks.length && <small>No Scheduled Work</small>}
                <ul>
                  {workItem.tasks.map(task => (
                    <li key={shortid.generate()} className="task">
                      [ ] {task.taskstype}{' '}
                      {task.taskstype === 'pick' ? 'up' : 'off'}{' '}
                      {task.is_passenger_stop ? 'passengers' : ''} {task.road}{' '}
                      {task.car_number} {task.type} {task.length}&#39;{' '}
                      {task.color} from {task.name}
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
          <StyledDestWrapper>
            <h3>Add Destination</h3>
          </StyledDestWrapper>
          <AddWorkItem
            destinations={workOrder.destinations}
            handleUpdate={() => {
              fetchData();
            }}
            order={workOrder.workItems.length}
            workOrderId={workOrder.workOrdersResults[0].id}
          />
        </div>
      )}
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
