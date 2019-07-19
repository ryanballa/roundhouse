import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Pane, toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import SingleColumn from '../components/layout/SingleColumn';
import Form from './components/Form';
import { userState } from '../UserProvider';

function Add({ history }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = userState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await axios(`/api/v1/photos`)
        .then(photosRes => {
          setPhotos(photosRes.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const [data] = useState([
    { engine_number: '', is_operational: true, location: 'home', road: '' },
  ]);

  const EditSchema = Yup.object().shape({
    engine_number: Yup.number()
      .min(3, 'Numbers need to be at least 3 numbers')
      .max(9999, 'Numbers cannot be more than 4')
      .required('Required'),
    road: Yup.string().required('Required'),
  });

  return (
    <SingleColumn history={history}>
      <Fragment>
        <Pane>
          <Formik
            initialValues={{
              engine_number: data[0].engine_number || '',
              is_dcc: data[0].is_dcc,
              is_operational: data[0].is_operational,
              location: data[0].location,
              road: data[0].road,
              user_id: user ? user.id : null,
            }}
            validationSchema={EditSchema}
            onSubmit={(values, { setSubmitting }) => {
              axios
                .post('/api/v1/locomotives/', values)
                .then(
                  /* istanbul ignore next */ () => {
                    /* istanbul ignore next */
                    toaster.success('Locomotive Added');
                    setSubmitting(false);
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
        </Pane>
      </Fragment>
    </SingleColumn>
  );
}

Add.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Add;
