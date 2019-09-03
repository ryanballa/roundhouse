/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
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

const AddWorkOrder = ({ handleUpdate, isOpen, handleModalClose }) => {
  const { user } = userState();

  return (
    <ModalWindow
      isModalOpen={isOpen}
      handleModalClose={() => {
        handleModalClose();
      }}
      style={customStyles}
      title="Add Work Order"
    >
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          axios
            .post('/api/v1/workOrders/', {
              ...values,
              user_id: user.id,
            })
            .then(
              /* istanbul ignore next */ () => {
                /* istanbul ignore next */
                toaster.success('Work Order Added');
                setSubmitting(false);
                handleUpdate();
              },
            )
            .catch(err => {
              console.log(err);
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
            <form data-testid="taskAdd-form" onSubmit={handleSubmit}>
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
          </StyledFormDiv>
        )}
      </Formik>
    </ModalWindow>
  );
};

export default AddWorkOrder;
