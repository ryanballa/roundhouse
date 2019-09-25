import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Pane, toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import SingleColumn from '../components/layout/SingleColumn';
import Form from './components/Form';
import { userState } from '../UserProvider';

function RailcarsAdd({ history }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = userState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await axios(`/api/v1/photos/`).then(photosRes => {
        setPhotos(photosRes.data);
        setIsLoading(false);
      });
    };
    fetchData();
  }, []);

  const [data] = useState([
    { car_number: '', is_operational: true, location: 'home', road: '' },
  ]);

  const EditSchema = Yup.object().shape({
    car_number: Yup.number().required('Required'),
    road: Yup.string().required('Required'),
  });

  return (
    <SingleColumn history={history}>
      <Fragment>
        <Pane>
          <h1>Add Railcar</h1>
          {isLoading && <p>Loading....</p>}
          {!isLoading && (
            <Formik
              initialValues={{
                car_number: data[0].car_number || '',
                is_dcc: data[0].is_dcc,
                is_operational: data[0].is_operational,
                location: data[0].location,
                road: data[0].road,
                user_id: user ? user.id : '',
              }}
              validationSchema={EditSchema}
              onSubmit={(values, { setSubmitting }) => {
                axios
                  .post('/api/v1/railcars/', values)
                  .then(
                    /* istanbul ignore next */ () => {
                      /* istanbul ignore next */
                      toaster.success('Railcar Added');
                      setSubmitting(false);
                      history.push('/railcars');
                    },
                  )
                  .catch(() => {});
              }}
            >
              {({ errors, touched, handleSubmit, setFieldValue, values }) => (
                <Form
                  errors={errors}
                  touched={touched}
                  handleSubmit={handleSubmit}
                  setFieldValue={setFieldValue}
                  photos={photos}
                  values={values}
                />
              )}
            </Formik>
          )}
        </Pane>
      </Fragment>
    </SingleColumn>
  );
}

RailcarsAdd.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default RailcarsAdd;
