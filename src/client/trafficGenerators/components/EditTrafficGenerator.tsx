/* eslint-disable react/no-multi-comp */
import React, { FunctionComponent, useState, useEffect } from 'react';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import Input from '../../components/atoms/forms/Input';
import { colors } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Button from '../../components/atoms/Button';
import Select from '../../components/atoms/forms/Select';
import ModalWindow from '../../components/organisms/ModalWindow';
import { userState } from '../../UserProvider';
import { usePromise } from '../../utils/promise.hook';
import trafficGeneratorsService from '../../services/trafficGenerators.service';
import destinationsService from '../../services/destinations.service';

const StyledFormDiv = styledComponent('div', {
  '& button': {
    marginTop: '38px',
  },
  '& input': {
    width: '90%',
  },
  '& li': {
    listStyle: 'none',
    marginBottom: '15px',
    marginRight: '15px',
  },
  '& ul': {
    paddingLeft: 0,
  },
  color: colors.error,
  paddingTop: '5px',
});

const customStyles = {
  content: {
    left: '30%',
    right: '30%',
    maxHeight: '500px',
    maxWidth: '40%',
  },
};

type trafficGenerator = {
  id: number;
  destination_id: number;
  name: string;
  type: string;
};

type EditTrafficGeneratorProps = {
  isOpen: boolean;
  handleModalClose: () => void;
  handleUpdate: (trafficGenerator) => void;
  trafficGenerator: trafficGenerator;
};

const EditTrafficGenerator: FunctionComponent<EditTrafficGeneratorProps> = ({
  handleUpdate,
  isOpen,
  handleModalClose,
  trafficGenerator,
}) => {
  const { user } = userState();
  const [data, isLoading] = usePromise(destinationsService.get, [], []);

  return (
    <ModalWindow
      isModalOpen={isOpen}
      handleModalClose={() => {
        handleModalClose();
      }}
      style={customStyles}
      title="Edit Traffic Generator"
    >
      <Formik
        initialValues={{
            id: trafficGenerator.id,
            destination_id: trafficGenerator.destination_id,
            name: trafficGenerator.name,
            type: trafficGenerator.type,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          trafficGeneratorsService.edit(user, values).then(res => {
            toaster.success('Traffic Generator Edited');
            Object.assign(values, res);
            handleUpdate({ values });
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
          <StyledFormDiv>
            {!isLoading && (
              <form
                data-testid="trafficGeneratorAdd-form"
                onSubmit={handleSubmit}
              >
                <ul>
                  <li data-testid="name">
                    <Input
                      data-testid="nameField"
                      label="Name"
                      id="name"
                      type="text"
                      name="name"
                      placeholder=""
                    />
                  </li>
                  <li data-testid="type">
                    <Select label="Type" id="type" name="type">
                      <option key="industry" value="industry">
                        Industry
                      </option>
                      <option key="railroad" value="railroad">
                        Railroad
                      </option>
                      <option key="foreign" value="foreign road">
                        Foreign Road
                      </option>
                      <option key="other" value="other">
                        Other
                      </option>
                    </Select>
                  </li>
                  <li>
                    <Select
                      label="Destination"
                      id="destination_id"
                      name="destination_id"
                    >
                      {data.map(destination => (
                        <option key={destination.id} value={destination.id}>
                          {destination.name}
                        </option>
                      ))}
                    </Select>
                  </li>
                  <li>
                    <Button
                      data-testid="trafficGeneratorEdit-submit"
                      disabled={isSubmitting}
                    >
                      Edit
                    </Button>
                  </li>
                </ul>
              </form>
            )}
          </StyledFormDiv>
        )}
      </Formik>
    </ModalWindow>
  );
};

export default EditTrafficGenerator;
