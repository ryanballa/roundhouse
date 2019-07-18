import React, { Fragment } from 'react';
import { Button, FormField, Pane, toaster } from 'evergreen-ui';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Field, Formik } from 'formik';
import SingleColumn from '../components/layout/SingleColumn';
import Error from '../components/atoms/forms/Error';

function Login({ history }) {
  return (
    <SingleColumn history={history}>
      <h1>Login</h1>
      <Fragment>
        <Pane>
          <Formik
            initialValues={{
              password: '',
              username: '',
            }}
            onSubmit={(values, { setSubmitting }) => {
              axios
                .post('/auth/login/', values)
                .then(
                  /* istanbul ignore next */ () => {
                    /* istanbul ignore next */
                    toaster.success('Login Successful');
                    setSubmitting(false);
                  },
                )
                .catch(() => {});
            }}
          >
            {({ errors, touched, handleSubmit, isSubmitting }) => (
              <form data-testid="locomotiveAdd-form" onSubmit={handleSubmit}>
                <ul>
                  <li data-testid="username">
                    <FormField label="Username">
                      <Field
                        id="username"
                        type="text"
                        name="username"
                        placeholder=""
                      />
                    </FormField>
                    <Error>
                      {errors.username && touched.username ? (
                        <div className="error">{errors.username}</div>
                      ) : null}
                    </Error>
                  </li>
                  <li data-testid="password">
                    <FormField label="Password">
                      <Field
                        id="password"
                        type="text"
                        name="password"
                        placeholder=""
                      />
                    </FormField>
                    <Error>
                      {errors.password && touched.password ? (
                        <div className="error">{errors.password}</div>
                      ) : null}
                    </Error>
                  </li>
                  <li>
                    <Button
                      type="submit"
                      data-testid="login-submit"
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </li>
                </ul>
              </form>
            )}
          </Formik>
        </Pane>
      </Fragment>
    </SingleColumn>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;
