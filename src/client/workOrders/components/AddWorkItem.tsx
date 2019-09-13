/* eslint-disable react/no-multi-comp */
import React from 'react';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import Select from '../../components/atoms/forms/Select';
import { colors } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Button from '../../components/atoms/Button';

const StyledDiv = styledComponent('div', {
  '& button': {
    marginTop: '38px',
  },
  '& input': {
    border: '1px solid #fffcfc',
    borderRadius: '2px',
    boxShadow: '0 0 0 1px rgba(67, 90, 111, 0.14)',
    padding: '8px',
  },
  '& li': {
    display: 'inline',
    listStyle: 'none',
    marginBottom: '15px',
    marginRight: '15px',
  },
  '& ul': {
    display: 'flex',
    paddingLeft: 0,
  },
  '@media print': {
    display: 'none',
  },
  color: colors.error,
  paddingTop: '5px',
  marginLeft: '25px',
});

type AddWorkItemProps = {
  destinations: Array<{ id: number; name: string }>;
  handleUpdate: () => void;
  order: number;
  workOrderId: number;
};

const AddWorkItem: React.FC<AddWorkItemProps> = ({
  destinations,
  handleUpdate,
  order,
  workOrderId,
}) => {
  return (
    <StyledDiv>
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          axios
            .post('/api/v1/work_items/', {
              ...values,
              order,
              work_order_id: workOrderId,
            })
            .then(
              /* istanbul ignore next */ () => {
                /* istanbul ignore next */
                handleUpdate();
                toaster.success('Work Item Added');
                setSubmitting(false);
              },
            )
            .catch(err => {
              console.log(err);
              console.log('Catch');
            });
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form data-testid="taskAdd-form" onSubmit={handleSubmit}>
            <ul>
              <li>
                <Select
                  label="Destination"
                  id="destination_id"
                  name="destination_id"
                >
                  <option value="">Select Destination</option>
                  {destinations.map(destination => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name}
                    </option>
                  ))}
                </Select>
              </li>
              <li>
                <Button
                  data-testid="taskAdd-submit"
                  disabled={isSubmitting}
                  icon="add"
                >
                  Add
                </Button>
              </li>
            </ul>
          </form>
        )}
      </Formik>
    </StyledDiv>
  );
};

export default AddWorkItem;
