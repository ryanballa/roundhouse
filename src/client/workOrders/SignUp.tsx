/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
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
  '& a': {
    color: '#61A3C5',
  },
  '& li': {
    '& h2': {
      marginBottom: '5px',
    },
    '& p': {
      letterSpacing: 0,
      lineHeight: '24px',
      margin: '0 0 10px 0',
    },
    borderBottom: '1px solid #ccc',
    listStyle: 'none',
  },
  '& ul': {
    margin: 0,
    padding: 0,
  },
});

type SignupProps = {
  history: {
    push: () => void;
  };
};

const Signup: React.FC<SignupProps> = ({ history, match }) => {
  const [assignee, setAssignee] = useState(null);
  const [editingWorkOrder, setEditingWorkOrder] = useState(null);
  const [data, error, isLoading, setData] = usePromise(
    workOrdersService.getSignUp(match.params.id),
    [],
    [],
  );

  const editWorkOrder = values => {
    axios
      .put(`/api/v1/workOrders/${editingWorkOrder}`, {
        ...values,
        assignee,
      })
      .then(
        /* istanbul ignore next */ res => {
          /* istanbul ignore next */
          toaster.success("You're Signed Up");
          const updateItem = data.find(item => item.id === values.id);
          updateItem.assignee = assignee;
          setData({ value: data });
          setEditingWorkOrder(null);
        },
      )
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <SingleColumn authProtected={false} history={history}>
      <h1>Work Order Signup</h1>
      <StyledDiv>
        <ul>
          {data.map(item => (
            <li>
              <h2>
                {item.name} - {item.assignee}
                {!item.assignee && (
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      setEditingWorkOrder(item.id);
                    }}
                  >
                    Take This Assignment
                  </a>
                )}
              </h2>
              <p>{item.description}</p>
              {editingWorkOrder === item.id && (
                <div>
                  <input
                    type="text"
                    onChange={e => {
                      setAssignee(e.target.value);
                    }}
                    value={assignee}
                  />
                  <button
                    onClick={() => {
                      editWorkOrder(item);
                    }}
                    type="button"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </StyledDiv>
    </SingleColumn>
  );
};

export default Signup;
