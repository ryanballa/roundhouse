import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import { AddButton } from '../components/atoms/AddButton';
import Breadcrumb from '../components/atoms/Breadcrumb';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { fontConfig } from '../config/styles';
import AddTask from './components/AddTask';
import DeleteTask from './components/DeleteTask';
import AddWorkItem from './components/AddWorkItem';
import EditWorkOrder from './components/EditWorkOrder';
import EditWorkItem from './components/EditWorkItem';
import WorkItemNotes from './components/WorkItemNotes';
import DeleteWorkItem from './components/DeleteWorkItem';
import Button from '../components/atoms/Button';
import DeleteWorkOrder from './components/DeleteWorkOrder';
import { usePromise } from '../utils/promise.hook';
import railcarsService from '../services/railcars.service';
import tasksService from '../services/tasks.service';

const HeaderToolBar = styledComponent('div', {
  '& .butonWrapper': {
    display: 'flex',
    alignItems: 'center',
  },
  '& h1': {
    margin: 0,
  },
  '.intro': {
    display: 'block',
  },
  '.printButton': {
    marginLeft: '10px',
  },
  '@media print': {
    '& .introDesc': {
      display: 'none',
    },
    '& .butonWrapper': {
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
  '& .instructions': {
    '& svg': {
      fill: '#E67D19',
      height: '50px',
      marginLeft: '-20px',
      marginRight: '10px',
      overflow: 'hidden',
      width: '60px',
    },
    alignItems: 'center',
    display: 'flex',
  },
  '& .task': {
    alignItems: 'center',
    display: 'flex',
    fontSize: fontConfig.body.fontSize,
  },
  '& .destinationWrapper': {
    alignItems: 'center',
    display: 'flex',
  },
  '& .addButtonWrapper': {
    '@media print': {
      display: 'none',
    },
    marginTop: '20px',
  },
  '& .addButtonWrapper > div': {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  '& p': {
    margin: '10px 0',
  },
  '@media print': {
    '& .instructions': {
      fontSize: '130%',
    },
    '& .task': {
      fontSize: '130%',
    },
    '& p': {
      fontSize: '390%',
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
  const [isEditWorkOrderOpen, setIsEditWorkOrderOpen] = useState(false);
  const [isEditWorkItemOpen, setIsEditWorkItemOpen] = useState(false);
  const [editingWorkItem, setEditingWorkItem] = useState({});
  const [addingWorkItem, setAddingWorkItem] = useState(false);
  const [railcars, isRailcarsLoading] = usePromise(railcarsService.get, [], []);
  const [tasks, isTasksLoading] = usePromise(tasksService.get, [], []);

  const sortTasks = tasksToSort => {
    return tasksToSort.sort((a, b) => {
      var nameA = a.taskstype.toUpperCase();
      var nameB = b.taskstype.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  };

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
            <div className="intro">
              <h1>{workOrder.workOrdersResults[0].name}</h1>
              <p className="introDesc">
                Run your railroad like a real one with work orders to for
                operation sessions.
              </p>
            </div>
            <div className="butonWrapper">
              <Link
                onClick={() => {
                  setIsEditWorkOrderOpen(true);
                }}
                to={`/work-orders/${workOrder.workOrdersResults[0].id}`}
              >
                Edit
              </Link>
              <EditWorkOrder
                handleModalClose={() => {
                  setIsEditWorkOrderOpen(false);
                }}
                workOrder={workOrder.workOrdersResults[0]}
                isOpen={isEditWorkOrderOpen}
              />
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
          {workOrder.workOrdersResults[0].notes && <h2>Notes</h2>}
          <p>{workOrder.workOrdersResults[0].notes}</p>
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
            <EditWorkItem
              handleModalClose={() => {
                setIsEditWorkItemOpen(false);
              }}
              workItem={editingWorkItem}
              isOpen={isEditWorkItemOpen}
            />
            {workOrder.workItems.map(workItem => (
              <li key={shortid.generate()}>
                <div className="destinationWrapper">
                  <h2>{workItem.destinationname}</h2>
                  <Link
                    onClick={() => {
                      setIsEditWorkItemOpen(true);
                      setEditingWorkItem(workItem);
                    }}
                    to={`/work-orders/${workOrder.workOrdersResults[0].id}`}
                  >
                    Edit
                  </Link>
                  {!workItem.tasks.length && (
                    <DeleteWorkItem
                      workItemId={workItem.id}
                      handleDelete={() => {
                        fetchData();
                      }}
                    />
                  )}
                </div>
                <WorkItemNotes workItem={workItem} />
                <p>Scheduled work at {workItem.destinationname}</p>
                {!workItem.tasks.length && (
                  <div>
                    <small>No Scheduled Work</small>
                  </div>
                )}
                <ul>
                  {sortTasks(workItem.tasks).map(task => {
                    console.log(sortTasks(workItem.tasks));
                    return (
                      <li key={shortid.generate()} className="task">
                        [ ] {task.taskstype}{' '}
                        {task.taskstype === 'pick' ? 'up' : 'off'}{' '}
                        {task.is_passenger_stop ? 'passengers' : ''} {task.road}{' '}
                        {task.reporting_marks} {task.car_number} {task.type}{' '}
                        {task.color} {task.taskstype === 'pick' ? 'from' : 'to'}{' '}
                        {task.name}
                        <DeleteTask
                          taskId={task.id}
                          handleDelete={() => {
                            fetchData();
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
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
                {workItem.depature_time && (
                  <p>Leave at {workItem.depature_time}</p>
                )}
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
