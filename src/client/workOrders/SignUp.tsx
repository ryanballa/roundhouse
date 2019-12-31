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
    console.log(values);
    console.log(editingWorkOrder);
    axios
      .put(`/api/v1/workOrders/${editingWorkOrder}`, {
        ...values,
        assignee,
      })
      .then(
        /* istanbul ignore next */ res => {
          /* istanbul ignore next */
          toaster.success("You're Signed Up");
        },
      )
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <SingleColumn authProtected={false} history={history}>
      <h1>Work Order Signup</h1>
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
    </SingleColumn>
  );
};

export default Signup;
