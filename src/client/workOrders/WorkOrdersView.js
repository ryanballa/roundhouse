import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, Dialog, Pane, toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import SingleColumn from '../components/layout/SingleColumn';
import { userState } from '../UserProvider';

const WorkOrdersView = ({ history, match }) => {
  const [workOrder, setWorkOrder] = useState({
    destinations: [],
    traffic: [],
    workOrdersResults: [{}],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = userState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await axios(`/api/v1/workOrders/${match.params.id}`).then(
        workOrderRes => {
          // if (!workOrder.data.length) {
          //   history.push('/404');
          // }
          setWorkOrder(workOrderRes.data);
          console.log(workOrderRes.data);
        },
      );
    };
    fetchData();
  }, []);

  return (
    <SingleColumn history={history}>
      <h1>{workOrder.workOrdersResults[0].name}</h1>
      <ul>
        {workOrder.traffic.map(wo => (
          <li key={wo.destination.id}>
            <h2>{wo.destination.name}</h2>
            <p>Scheduled work at {wo.destination.name}</p>
            <ul>
              {wo.tasks.map(task => (
                <li>
                  [ ] {task.taskstype} up {task.road} {task.car_number}{' '}
                  {task.type} {task.length}&#39; {task.color} from{' '}
                  {task.destinationName}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
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
