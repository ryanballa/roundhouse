/* eslint-disable react/no-multi-comp */
import React from 'react';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import Input from '../../components/atoms/forms/Input';
import { colors } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Button from '../../components/atoms/Button';
import ModalWindow from '../../components/organisms/ModalWindow';
import { userState } from '../../UserProvider';

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

type WorkOrderProps = {
  description: string;
  name: string;
  notes: string;
  user_id: number;
  id: number;
};

type EditWorkOrderProps = {
  handleModalClose: () => void;
  handleUpdate: (arg0: WorkOrderProps) => void;
  isOpen: boolean;
  workOrder: WorkOrderProps;
};

const EditWorkOrder: React.FC<EditWorkOrderProps> = ({
  handleUpdate,
  isOpen,
  handleModalClose,
  workOrder,
}) => {
  const { user } = userState();

  return (
    <ModalWindow
      isModalOpen={isOpen}
      handleModalClose={() => {
        handleModalClose();
      }}
      style={customStyles}
      title="Edit Work Order"
    >
      <Formik
        initialValues={{
          description: workOrder.description,
          name: workOrder.name,
          notes: workOrder.notes,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          axios
            .put(`/api/v1/workOrders/${workOrder.id}`, {
              ...values,
              user_id: user.id,
            })
            .then(
              /* istanbul ignore next */ res => {
                /* istanbul ignore next */
                toaster.success('Work Order Added');
                setSubmitting(false);
                handleModalClose();
              },
            )
            .catch(err => {
              console.log(err);
            });
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <StyledFormDiv>
            <form data-testid="workOrderEdit-form" onSubmit={handleSubmit}>
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
                <li data-testid="description">
                  <Input
                    label="Desciption"
                    id="description"
                    type="text"
                    name="description"
                    placeholder=""
                  />
                </li>
                <li data-testid="notes">
                  <Input
                    label="Notes"
                    id="notes"
                    type="text"
                    name="notes"
                    placeholder=""
                  />
                </li>
                <li>
                  <Button
                    data-testid="workOrderEdit-submit"
                    disabled={isSubmitting}
                  >
                    Edit
                  </Button>
                </li>
              </ul>
            </form>
          </StyledFormDiv>
        )}
      </Formik>
    </ModalWindow>
  );
};

export default EditWorkOrder;