import React from 'react';
import { Button, FormField, Pane, toaster } from 'evergreen-ui';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Field, Formik } from 'formik';
import SingleColumn from '../components/layout/SingleColumn';
import Error from '../components/atoms/forms/Error';
import { styledComponent } from '../utils/styledComponent';
import { userState, userDispatch } from '../UserProvider';

const Form = styledComponent('div', {
  '& li': {
    listStyle: 'none',
    marginBottom: '15px',
  },
  '& ul': {
    paddingLeft: 0,
  },
  paddingTop: '5px',
});

function Login({ history }) {
  const dispatch = userDispatch();
  const { user } = userState();
  return (
    <SingleColumn history={history}>
      <h1>Login</h1>
      <Form>
        <Pane>
          <Formik
            initialValues={{
              password: '',
              username: '',
            }}
            onSubmit={(values, { setSubmitting }) => {
              axios
                .post('auth/login/', values)
                .then(
                  /* istanbul ignore next */ data => {
                    dispatch({ type: 'set', user: data });
                    console.log(user);
                    /* istanbul ignore next */
                    toaster.success('Login Successful');
                    setSubmitting(false);
                    console.log(user);
                    history.push('/locomotives');
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
                        type="password"
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
      </Form>
    </SingleColumn>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;
