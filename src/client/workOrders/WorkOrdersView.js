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
    marginBottom: '20px',
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
      fill: '#848484',
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
    alignItems: 'center',
    display: 'flex',
    margin: '10px 0',
  },
  '& p > svg': {
    fill: '#848484',
    height: '50px',
    marginLeft: '-20px',
    marginRight: '10px',
    overflow: 'hidden',
    width: '60px',
  },
  '@media print': {
    '& h2': {
      marginBottom: 0,
    },
    '& .edit': {
      display: 'none',
    },
    '& .instructions': {
      fontSize: '130%',
    },
    '& .task': {
      fontSize: '130%',
    },
    '& p': {
      fontSize: '140%',
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
                handleUpdate={values => {
                  const updatedWorkOrder = workOrder;
                  (updatedWorkOrder.workOrdersResults[0] = {
                    ...updatedWorkOrder.workOrdersResults[0],
                    ...values,
                  }),
                    setWorkOrder(updatedWorkOrder);
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
                  window.open(
                    `/work-orders/print/${workOrder.workOrdersResults[0].id}`,
                    '_blank',
                  );
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
                    className="edit"
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
                <WorkItemNotes
                  workOrderId={workOrder.workOrdersResults[0].id}
                  workItem={workItem}
                />
                <p>
                  <svg
                    data-name="Layer 1"
                    viewBox="0 0 100 125"
                    x="0px"
                    y="0px"
                  >
                    <title>36</title>
                    <path d="M21.79126,57.31445a.299.299,0,0,1-.29913.29908h-7.304a.29906.29906,0,0,1-.29913-.29908V49.78491a.29914.29914,0,0,1,.29913-.29907h7.304a.2991.2991,0,0,1,.29913.29907Zm-.29913,5.439h-7.304a.29914.29914,0,0,0-.29913.29907V70.582a.29914.29914,0,0,0,.29913.29907h7.304a.2991.2991,0,0,0,.29913-.29907V63.05249A.2991.2991,0,0,0,21.49213,62.75342ZM34.69061,49.78491a.2991.2991,0,0,0-.29913-.29907H27.08759a.2991.2991,0,0,0-.29914.29907v7.52954a.299.299,0,0,0,.29914.29908h7.30389a.299.299,0,0,0,.29913-.29908Zm0-13.26745a.2992.2992,0,0,0-.29913-.2992H27.08759a.2992.2992,0,0,0-.29914.2992v7.52942a.299.299,0,0,0,.29914.29907h7.30389a.299.299,0,0,0,.29913-.29907Zm-.29913,26.236H27.08759a.2991.2991,0,0,0-.29914.29907V70.582a.2991.2991,0,0,0,.29914.29907h7.30389a.2991.2991,0,0,0,.29913-.29907V63.05249A.2991.2991,0,0,0,34.39148,62.75342ZM47.59,36.51746a.2992.2992,0,0,0-.29914-.2992H39.98694a.29924.29924,0,0,0-.29913.2992v7.52942a.29906.29906,0,0,0,.29913.29907h7.304a.299.299,0,0,0,.29914-.29907Zm0,13.26745a.2991.2991,0,0,0-.29914-.29907H39.98694a.29914.29914,0,0,0-.29913.29907v7.52954a.29906.29906,0,0,0,.29913.29908h7.304a.299.299,0,0,0,.29914-.29908Zm-.29914,12.96851H39.98694a.29914.29914,0,0,0-.29913.29907V70.582a.29914.29914,0,0,0,.29913.29907h7.304A.2991.2991,0,0,0,47.59,70.582V63.05249A.2991.2991,0,0,0,47.29089,62.75342ZM52.88635,44.346h7.3039a.299.299,0,0,0,.29913-.29907V36.51746a.2992.2992,0,0,0-.29913-.2992h-7.3039a.2992.2992,0,0,0-.29913.2992v7.52942A.299.299,0,0,0,52.88635,44.346ZM52.584,57.31409a.30073.30073,0,0,0,.3.29992h.7a25.42236,25.42236,0,0,1,6.91-6.0299V49.78406a.30751.30751,0,0,0-.3-.29993h-7.31a.30747.30747,0,0,0-.3.29993ZM73.08966,44.346a.299.299,0,0,0,.29907-.29907V36.51746a.29919.29919,0,0,0-.29907-.2992H65.78571a.2992.2992,0,0,0-.29914.2992v7.52942a.299.299,0,0,0,.29914.29907ZM52.00006,73.5a21.5,21.5,0,1,1,21.5,21.5A21.5,21.5,0,0,1,52.00006,73.5Zm4,0a17.5,17.5,0,1,0,17.5-17.5A17.51981,17.51981,0,0,0,56.00006,73.5ZM85.751,67.97021l-3.53516-3.53515L70.06348,76.5874l-4.56836-4.56787L61.96,75.55566l8.10352,8.103ZM61.00562,8.69934v8.827a3.69931,3.69931,0,0,0,7.39862,0v-8.827a3.69931,3.69931,0,1,0-7.39862,0ZM11.8584,81.982H49.45605a25.276,25.276,0,0,1-1.05371-4H11.8584A2.86157,2.86157,0,0,1,9,75.1236V29.1358H78.27832V48.45563a25.27776,25.27776,0,0,1,4,1.102V17.5274A6.86678,6.86678,0,0,0,75.419,10.66852H72.2041v6.85791a7.499,7.499,0,0,1-14.998,0V10.66852H30.07227v6.85791a7.49927,7.49927,0,0,1-14.99854,0V10.66852H11.8584A6.866,6.866,0,0,0,5,17.5274V75.1236A6.86584,6.86584,0,0,0,11.8584,81.982ZM18.8736,8.69934v8.827a3.69931,3.69931,0,0,0,7.39862,0v-8.827a3.69931,3.69931,0,1,0-7.39862,0Z" />
                  </svg>
                  Scheduled work at {workItem.destinationname}
                </p>
                {!workItem.tasks.length && (
                  <div>
                    <small>No Scheduled Work</small>
                  </div>
                )}
                <ul>
                  {sortTasks(workItem.tasks).map(task => {
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
                {workItem.arrival_time && (
                  <p>Arrive at {workItem.arrival_time}</p>
                )}
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
