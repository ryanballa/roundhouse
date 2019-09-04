/* eslint-disable react/no-multi-comp */
import React, { FunctionComponent } from 'react';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import Input from '../../components/atoms/forms/Input';
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
});

type RailCarType = {
  id: number;
  road: number;
};

type RailCarsType = Array<{
  id: number;
  road: number;
}>;

type TaskType = {
  railcar_id: number;
};

type TasksType = Array<{
  railcar_id: number;
}>;

type TrafficGeneratorType = {
  id: number;
  name: string;
};

type AddTaskProps = {
  handleUpdate: () => void;
  railcars: RailCarType[];
  tasks: TasksType[];
  trafficGenerators: TrafficGeneratorType[];
  workItemId: number;
};

const AddTask: FunctionComponent<AddTaskProps> = ({
  handleUpdate,
  railcars,
  trafficGenerators,
  tasks,
  workItemId,
}) => {
  const filteredRailcars = (
    tasksVals: TasksType,
    railcarsVals: RailCarsType,
  ) => {
    // Count railcar use
    const railcarsUse = [];
    tasksVals.map(task => {
      if (
        railcarsUse.reduce((res, rc) => res + (rc === task.railcar_id), 0) <= 1
      ) {
        railcarsUse.push(task.railcar_id);
      }
    });
    // Find only railcars not used or used once
    return railcarsVals.reduce((result, railcar) => {
      if (railcarsUse.reduce((res, rc) => res + (rc === railcar.id), 0) <= 1) {
        result.push(railcar);
      }
      return result;
    }, []);
  };

  return (
    <StyledDiv>
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          axios
            .post('/api/v1/tasks/', {
              ...values,
              work_item_id: workItemId,
            })
            .then(
              /* istanbul ignore next */ () => {
                /* istanbul ignore next */
                handleUpdate();
                toaster.success('Task Added');
                setSubmitting(false);
              },
            )
            .catch(e => {
              console.log(e);
            });
        }}
      >
        {({
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          values,
        }) => (
          <form data-testid="taskAdd-form" onSubmit={handleSubmit}>
            <ul>
              <li>
                <Select label="Type" id="type" name="type">
                  <option value="">Select One</option>
                  <option value="drop">Drop</option>
                  <option value="pick">Pick</option>
                </Select>
              </li>
              <li>
                <Select label="Railcar" id="railcar_id" name="railcar_id">
                  <option value="">Select Railcar</option>
                  {filteredRailcars(tasks, railcars).map(railcar => (
                    <option key={railcar.id} value={railcar.id}>
                      {railcar.road}
                    </option>
                  ))}
                </Select>
              </li>
              <li>
                <Select
                  label="Traffic Generator"
                  id="traffic_generator_id"
                  name="traffic_generator_id"
                >
                  <option value="">Select Traffic Generator</option>
                  {trafficGenerators.map(tg => (
                    <option key={tg.id} value={tg.id}>
                      {tg.name}
                    </option>
                  ))}
                </Select>
              </li>
              <li data-testid="weight">
                <Input
                  label="Weight"
                  id="weight"
                  type="text"
                  name="weight"
                  placeholder=""
                />
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

export default AddTask;
