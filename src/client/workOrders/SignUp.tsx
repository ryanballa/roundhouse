/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import Button from '../components/atoms/Button';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { usePromise } from '../utils/promise.hook';
import workOrdersService from '../services/workOrders.service';
import { colors } from '../config/styles';

const StyledDiv = styledComponent('div', {
  '& a': {
    color: '#61A3C5',
  },
  '& .inputFieldWrapper': {
    '& input': {
      background: colors.form.background,
      border: `1px solid ${colors.form.stroke}`,
      borderRadius: '4px',
      display: 'block',
      marginRight: '15px',
      padding: '15px',
    },
    alignItems: 'center',
    display: 'flex',
    marginBottom: '20px',
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
      .put(`/api/v1/workOrders/${editingWorkOrder.id}`, {
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
      <p>
        Sign Up for the ops session. Choose &ldquo;Take This Assignment&rdquo;
        and enter your name. If you change your mind, choose &ldquo;Change
        Assignment&rdquo; and click &ldquo;Sign Up&rdquo; without a name
        entered.
      </p>
      <StyledDiv>
        <ul>
          {data.map(item => (
            <li>
              <h2>
                {item.name} - {item.assignee}{' '}
                {!item.assignee && editingWorkOrder !== item.id && (
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      setEditingWorkOrder(item);
                    }}
                  >
                    Take This Assignment
                  </a>
                )}
                {item.assignee && editingWorkOrder !== item.id && (
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      setEditingWorkOrder(item);
                    }}
                  >
                    Change Assignment
                  </a>
                )}
              </h2>
              <p>{item.description}</p>
              {editingWorkOrder && editingWorkOrder.id === item.id && (
                <div className="inputFieldWrapper">
                  <input
                    placeholder="Enter Your Name"
                    type="text"
                    onChange={e => {
                      setAssignee(e.target.value);
                    }}
                    value={assignee}
                  />
                  <Button
                    onClick={() => {
                      editWorkOrder(item);
                    }}
                  >
                    Sign Up
                  </Button>
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
