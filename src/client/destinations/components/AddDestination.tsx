/* eslint-disable react/no-multi-comp */
import React, { FunctionComponent, useState, useEffect } from 'react';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import Input from '../../components/atoms/forms/Input';
import { colors } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Button from '../../components/atoms/Button';
import ModalWindow from '../../components/organisms/ModalWindow';
import { userState } from '../../UserProvider';
import api from '../../api';
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

type DestinationProps = {
  id: number;
  type: string;
};

type AddDestinationProps = {
  isOpen: boolean;
  handleModalClose: () => void;
  handleUpdate: (DestinationProps) => void;
};

const AddDestination: FunctionComponent<AddDestinationProps> = ({
  handleUpdate,
  isOpen,
  handleModalClose,
}) => {
  const { user } = userState();
  const [data, setData] = useState([{ id: '', name: '' }]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    api.destinations.get(result => {
      setData(result.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModalWindow
      isModalOpen={isOpen}
      handleModalClose={() => {
        handleModalClose();
      }}
      style={customStyles}
      title="Add Destination"
    >
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          destinationsService.add(user, values).then(res => {
            toaster.success('Destination Added');
            Object.assign(values, res);
            handleUpdate({ values });
          });
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <StyledFormDiv>
            {!isLoading && (
              <form data-testid="destinationAdd-form" onSubmit={handleSubmit}>
                <ul>
                  <li data-testid="name">
                    <Input
                      label="Name"
                      id="name"
                      type="text"
                      name="name"
                      placeholder=""
                    />
                  </li>
                  <li>
                    <Button
                      data-testid="destinationAdd-submit"
                      disabled={isSubmitting}
                      icon="add"
                    >
                      Add
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

export default AddDestination;
