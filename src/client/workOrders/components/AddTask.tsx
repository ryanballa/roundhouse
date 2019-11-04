/* eslint-disable react/no-multi-comp */
import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import { Field, Formik } from 'formik';
import Input from '../../components/atoms/forms/Input';
import SearchableSelect from '../../components/atoms/forms/SearchableSelect';
import Select from '../../components/atoms/forms/Select';
import Toggle from '../../components/atoms/forms/Toggle';
import { colors } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Button from '../../components/atoms/Button';
import ModalWindow from '../../components/organisms/ModalWindow';
import tasksService from '../../services/tasks.service';
import filteredRailcarUse from '../lib/filteredRailcarUse';

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
  workItemId,
  isOpen,
  handleModalClose,
}) => {
  const [filteredRailcarsData, setfilteredRailcarsData] = useState([]);
  const [selectedRailcar, setSelectedRailcar] = useState({ value: null });
  const options = filteredRailcarsData.map((railcar) => { return { value: railcar.id, label: `${railcar.road} ${railcar.car_number} ${railcar.color}`}})

  useEffect(() => {
    tasksService.get().then(vals => {
      const taskVals = vals.length ? vals : [];
      const filtered = filteredRailcarUse(taskVals, railcars);
      setfilteredRailcarsData(filtered);
    });
  }, [isOpen]);

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
                railcar_id: selectedRailcar.value,
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
                  <li data-testid="type">
                    <Select label="Type" id="type" name="type">
                      <option value="">Select One</option>
                      <option value="drop">Drop</option>
                      <option value="pick">Pick</option>
                    </Select>
                  </li>
                  <li data-testid="railcar_id">
                    {!values.is_passenger_stop && (
                      <SearchableSelect
                      name="railcar_id"
                      label="Railcar"
                      value={selectedRailcar}
                      onChange={(v) => { setSelectedRailcar(v) }}
                      options={options}
                    />
                    )}
                  </li>
                  <li data-testid="traffic_generator_id">
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
