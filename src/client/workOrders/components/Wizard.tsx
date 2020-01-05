import React, { useState } from 'react';
import axios from 'axios';
import { Field, Formik } from 'formik';
import Button from '../../components/atoms/Button';
import SearchableSelect from '../../components/atoms/forms/SearchableSelect';
import Select from '../../components/atoms/forms/Select';
import ModalWindow from '../../components/organisms/ModalWindow';
import { userState } from '../../UserProvider';

const customStyles = {
  content: {
    left: '30%',
    right: '30%',
    maxHeight: '500px',
    maxWidth: '40%',
  },
};

type WorkOrderProps = {
  user_id: number;
  id: number;
};

type AddToWorkOrderProps = {
  handleModalClose: () => void;
  handleUpdate: (arg0: WorkOrderProps) => void;
  isOpen: boolean;
};

const Wizard: React.FC<AddToWorkOrderProps> = ({
  handleUpdate,
  isOpen,
  handleModalClose,
  workOrder,
}) => {
  const [dropId, setDropId] = useState(null);
  const [dropTGID, setDropTGID] = useState(null);
  const [pickId, setPickId] = useState(null);
  const [pickTGID, setPickTGID] = useState(null);
  const { user } = userState();
  return (
    <ModalWindow
      isModalOpen={isOpen}
      handleModalClose={() => {
        handleModalClose();
      }}
      style={customStyles}
      title="Add Railcars to Work Order"
    >
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          axios
            .post('/api/v1/tasks/', {
              ...values,
              type: 'pick',
              traffic_generator_id: pickTGID,
              work_item_id: pickId,
              is_passenger_stop: false,
              user_id: user.id,
            })
            .then(
              /* istanbul ignore next */ () => {
                axios.post('/api/v1/tasks/', {
                  ...values,
                  type: 'drop',
                  traffic_generator_id: dropTGID,
                  work_item_id: dropId,
                  is_passenger_stop: false,
                  user_id: user.id,
                });
                /* istanbul ignore next */
                // handleUpdate();
                setSubmitting(false);
                handleModalClose();
              },
            )
            .catch(e => {
              console.log(e);
            });
        }}
      >
        {({ handleSubmit, isSubmitting, setFieldValue, values }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div>
                <Select label="Railcar" id="railcar" name="railcar_id">
                  {workOrder.railcars &&
                    workOrder.railcars.map(railcar => (
                      <option value={railcar.id}>
                        {railcar.road} {railcar.car_number} {railcar.color}
                      </option>
                    ))}
                </Select>
                {workOrder.workItems.map(item => {
                  // const options = filteredRailcarsData.map((railcar) => { return { value: railcar.id, label: `${railcar.road} ${railcar.car_number} ${railcar.color}`}})
                  const options = workOrder.trafficGenerators
                    .filter(tg => tg.destination_id === item.destinationid)
                    .map(item => {
                      return { value: item.id, label: item.name };
                    });
                  return (
                    <div>
                      <h4>
                        {item.destinationname} - {item.arrival_time} :{' '}
                        {item.depature_time}
                      </h4>
                      <SearchableSelect
                        name="traffic_generator_id"
                        label="Taffic Generator"
                        value={null}
                        onChange={v => {
                          if (!pickTGID) {
                            setPickTGID(v.value);
                          }
                          if (pickTGID && !dropTGID) {
                            setDropTGID(v.value);
                          }
                        }}
                        options={options}
                      />
                      {pickId === item.id && <p>Set for Pickup</p>}
                      {dropId === item.id && <p>Set for Drop off</p>}
                      {!dropId && pickId !== item.id && (
                        <p>{!pickId ? 'Pick' : 'Drop'}</p>
                      )}
                      {!dropId && pickId !== item.id && (
                        <input
                          name={`pickdrop${item.id}`}
                          onChange={e => {
                            if (e.target.checked) {
                              if (!pickId) {
                                setPickId(item.id);
                              }
                              if (pickId && !dropId) {
                                setDropId(item.id);
                              }
                            }
                          }}
                          type="checkbox"
                        />
                      )}
                    </div>
                  );
                })}
                <Button
                  data-testid="railcarsWorkOrder-submit"
                  disabled={isSubmitting}
                  icon="add"
                >
                  Add
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </ModalWindow>
  );
};
export default Wizard;
