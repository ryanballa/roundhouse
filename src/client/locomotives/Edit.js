import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Pane } from 'evergreen-ui';
import { Formik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import SingleColumn from '../components/layout/SingleColumn';
import Form from './components/Form';

const Edit = ({ match }) => {
  const [data, setData] = useState([{ engine_number: '123', road: 'Test' }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios(`/api/v1/locomotives/${match.params.id}`);
      setData(result.data);
      setIsLoading(false);
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
      <Fragment>
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <Pane>
            <Formik
              initialValues={{
                engine_number: data[0].engine_number || '',
                is_dcc: data[0].is_dcc,
                is_operational: data[0].is_operational,
                location: data[0].location,
                road: data[0].road,
              }}
              validationSchema={EditSchema}
              onSubmit={(values, { setSubmitting }) => {
                axios
                  .put(`/api/v1/locomotives/${match.params.id}`, values)
                  .then(() => {
                    setSubmitting(false);
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
                /* and other goodies */
              }) => (
                <Form
                  errors={errors}
                  touched={touched}
                  handleSubmit={handleSubmit}
                />
              )}
            </Formik>
          </Pane>
        )}
      </Fragment>
    </SingleColumn>
  );
};

Edit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Edit;
