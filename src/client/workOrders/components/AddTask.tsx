/* eslint-disable react/no-multi-comp */
import React, { FunctionComponent, useState } from 'react';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import { Field, Formik } from 'formik';
import Input from '../../components/atoms/forms/Input';
import Select from '../../components/atoms/forms/Select';
import Toggle from '../../components/atoms/forms/Toggle';
import { colors } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Button from '../../components/atoms/Button';
import ModalWindow from '../../components/organisms/ModalWindow';

const StyledDiv = styledComponent('div', {
  '& button': {
    marginTop: '28px',
  },
  '& li': {
    listStyle: 'none',
    marginBottom: '15px',
    marginRight: '15px',
  },
  '& ul': {
    paddingLeft: 0,
  },
  '@media print': {
    display: 'none',
  },
  color: colors.error,
  paddingTop: '5px',
});

const customStyles = {
  content: {
    left: '10%',
    right: '10%',
    maxHeight: '600px',
    maxWidth: '80%',
  },
};

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
  id: number;
  railcar_id: number;
}>;

type TrafficGeneratorType = {
  id: number;
  name: string;
};

type AddTaskProps = {
  handleUpdate: () => void;
  handleModalClose: () => void;
  isOpen: boolean;
  railcars: RailCarType[];
  tasks: TasksType;
  trafficGenerators: TrafficGeneratorType[];
  workItemId: number;
};

const AddTask: FunctionComponent<AddTaskProps> = ({
  handleUpdate,
  railcars,
  trafficGenerators,
  tasks,
  workItemId,
  isOpen,
  handleModalClose,
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
    <ModalWindow
      isModalOpen={isOpen}
      handleModalClose={() => {
        handleModalClose();
      }}
      style={customStyles}
      title="Add Task"
    >
      <StyledDiv>
        <Formik
          initialValues={{
            is_passenger_stop: false,
            traffic_generator_id: '',
            type: 'drop',
            weight: 100,
          }}
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
          {({ handleSubmit, isSubmitting, setFieldValue, values }) => {
            return (
              <form data-testid="taskAdd-form" onSubmit={handleSubmit}>
                <ul>
                  <li data-testid="is_passenger_stop">
                    <Field
                      label="Passenger Stop"
                      id="is_passenger_stop"
                      name="is_passenger_stop"
                      component={Toggle}
                      setFieldValue={setFieldValue}
                    />
                  </li>
                  <li>
                    <Select label="Type" id="type" name="type">
                      <option value="">Select One</option>
                      <option value="drop">Drop</option>
                      <option value="pick">Pick</option>
                    </Select>
                  </li>
                  <li>
                    {!values.is_passenger_stop && (
                      <Select label="Railcar" id="railcar_id" name="railcar_id">
                        <option value="">Select Railcar</option>
                        {filteredRailcars(tasks, railcars).map(railcar => (
                          <option key={railcar.id} value={railcar.id}>
                            {railcar.road} {railcar.car_number} {railcar.color}
                          </option>
                        ))}
                      </Select>
                    )}
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
            );
          }}
        </Formik>
      </StyledDiv>
    </ModalWindow>
  );
};

export default AddTask;
