import React, { Fragment, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, Dialog, Pane } from 'evergreen-ui';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SingleColumn from '../components/layout/SingleColumn';
import FormActions from '../components/organisms/FormActions';
import { Breadcrumb } from '../components/atoms/Breadcrumb';
import Form from './components/Form';

const LocomotivesEdit = ({
  data,
  handleDelete,
  handleFormSubmit,
  history,
  isLoading,
  photos,
  user,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const EditSchema = Yup.object().shape({
    engine_number: Yup.number()
      .min(3, 'Numbers need to be at least 3 numbers')
      .max(9999, 'Numbers cannot be more than 9999')
      .required('Required'),
    road: Yup.string().required('Required'),
  });

  return (
    <SingleColumn history={history}>
      <Breadcrumb
        items={[
          { link: '/locomotives', text: 'Locomotives' },
          { text: 'Edit Locomotive' },
        ]}
      />
      <FormActions>
        <h1 data-testid="locomotiveEdit-form">Edit Locomotive</h1>
        <Button
          data-testid="locomotiveEdit-delete"
          iconBefore="trash"
          intent="danger"
          onClick={() => {
            setIsDeleting(true);
          }}
        >
          Delete
        </Button>
      </FormActions>
      <Fragment>
        {isLoading ? (
          <div data-testid="loading">Loading ...</div>
        ) : (
          <Pane>
            <Dialog
              intent="danger"
              isShown={isDeleting}
              title="Delete Locomotive"
              onCloseComplete={() => setIsDeleting(false)}
              onConfirm={() => {
                handleDelete();
              }}
              confirmLabel="Delete Locomotive"
            >
              Are you sure you want to delete {data[0].road} ?
            </Dialog>
            <Formik
              initialValues={{
                engine_number: data[0].engine_number || '',
                is_dcc: data[0].is_dcc,
                is_operational: data[0].is_operational,
                location: data[0].location,
                notes: data[0].notes,
                purchase_price: data[0].purchase_price,
                purchased_on: moment(data[0].purchased_on).isValid()
                  ? moment(data[0].purchased_on).format('YYYY-MM-DD')
                  : undefined,
                road: data[0].road,
                thumbnail: data[0].thumbnail || '',
                type: data[0].type,
                user_id: user ? user.id : null,
                value: data[0].value,
              }}
              validationSchema={EditSchema}
              onSubmit={values => {
                handleFormSubmit(values);
              }}
            >
              {({
                errors,
                touched,
                handleSubmit,
                setFieldValue,
                values,
                /* and other goodies */
              }) => (
                <Fragment>
                  <Form
                    errors={errors}
                    touched={touched}
                    handleSubmit={handleSubmit}
                    photos={photos}
                    setFieldValue={setFieldValue}
                    values={values}
                  />
                </Fragment>
              )}
            </Formik>
          </Pane>
        )}
      </Fragment>
    </SingleColumn>
  );
};

LocomotivesEdit.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleDelete: PropTypes.func,
  handleFormSubmit: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
  photos: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

LocomotivesEdit.defaultProps = {
  handleDelete: () => {},
  handleFormSubmit: () => {},
  isLoading: true,
};

export default LocomotivesEdit;
