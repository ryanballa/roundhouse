import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, Dialog, Pane, toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import SingleColumn from '../components/layout/SingleColumn';
import FormActions from '../components/organisms/FormActions';
import Form from './components/Form';

const Edit = ({ history, match }) => {
  const [data, setData] = useState([{ engine_number: '123', road: 'Test' }]);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await axios(`/api/v1/locomotives/${match.params.id}`).then(locomotive => {
        if (!locomotive.data.locomotive.length) {
          history.push('/404');
        }
        setData(locomotive.data.locomotive);
      });
      await axios(`/api/v1/photos/`).then(photosRes => {
        setPhotos(photosRes.data);
        setIsLoading(false);
      });
    };
    fetchData();
  }, []);

  const EditSchema = Yup.object().shape({
    engine_number: Yup.number()
      .min(3, 'Numbers need to be at least 3 numbers')
      .max(9999, 'Numbers cannot be more than 9999')
      .required('Required'),
    road: Yup.string().required('Required'),
  });

  return (
    <SingleColumn>
      <FormActions>
        <h1>Edit Locomotive</h1>
        <Button
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
          <div>Loading ...</div>
        ) : (
          <Pane>
            <Dialog
              intent="danger"
              isShown={isDeleting}
              title="Delete Locomotive"
              onCloseComplete={() => setIsDeleting(false)}
              onConfirm={() => {
                axios
                  .delete(`/api/v1/locomotives/${match.params.id}`)
                  .then(() => {
                    setIsDeleting(false);
                    toaster.success('Locomotive Deleted');
                    history.push('/locomotives');
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }}
              confirmLabel="Delete"
            >
              Are you sure you want to delete {data[0].road} ?
            </Dialog>
            <Formik
              initialValues={{
                engine_number: data[0].engine_number || '',
                is_dcc: data[0].is_dcc,
                is_operational: data[0].is_operational,
                location: data[0].location,
                purchased_on: moment(data[0].purchased_on).isValid()
                  ? moment(data[0].purchased_on).format('YYYY-MM-DD')
                  : undefined,
                road: data[0].road,
                thumbnail: data[0].thumbnail || '',
              }}
              validationSchema={EditSchema}
              onSubmit={(values, { setSubmitting }) => {
                axios
                  .put(`/api/v1/locomotives/${match.params.id}`, values)
                  .then(() => {
                    setSubmitting(false);
                    toaster.success('Locomotive Saved');
                  })
                  .catch(error => {
                    console.log(error);
                  });
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

Edit.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Edit;
