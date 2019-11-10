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

type WorkItemProps = {
  depature_time: string;
  destinationid: number;
  notes: string;
  order: number;
  user_id: number;
  id: number;
};

type EditWorkItemProps = {
  handleModalClose: () => void;
  handleUpdate: (arg0: WorkItemProps) => void;
  isOpen: boolean;
  workItem: WorkItemProps;
};

const EditWorkItem: React.FC<EditWorkItemProps> = ({
  handleUpdate,
  isOpen,
  handleModalClose,
  workItem,
}) => {
  const { user } = userState();

  return (
    <ModalWindow
      isModalOpen={isOpen}
      handleModalClose={() => {
        handleModalClose();
      }}
      style={customStyles}
      title="Edit Work Item"
    >
      <Formik
        initialValues={{
          notes: workItem.notes,
          destination_id: workItem.destinationid,
          depature_time: workItem.depature_time,
          order: workItem.order,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          console.log(workItem);
          axios
            .put(`/api/v1/work_items/${workItem.id}`, {
              ...values,
              destination_id: workItem.destinationid,
              user_id: user.id,
            })
            .then(
              /* istanbul ignore next */ res => {
                /* istanbul ignore next */
                toaster.success('Work Item Edited');
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
                <li data-testid="depature_time">
                  <Input
                    label="Depature Time"
                    id="depature_time"
                    type="text"
                    name="depature_time"
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
                <li data-testid="order">
                  <Input
                    label="Order"
                    id="order"
                    type="text"
                    name="order"
                    placeholder=""
                  />
                </li>
                <li>
                  <Button
                    data-testid="workItem-submit"
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

export default EditWorkItem;
