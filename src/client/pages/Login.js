import React, { useState } from 'react';
import { Pane, toaster } from 'evergreen-ui';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import SingleColumn from '../components/layout/SingleColumn';
import Button from '../components/atoms/Button';
import Error from '../components/atoms/forms/Error';
import Input from '../components/atoms/forms/Input';
import { styledComponent } from '../utils/styledComponent';
import { userDispatch } from '../UserProvider';

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
  const [submitError, setSubmitError] = useState(false);

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
              setSubmitError(false);
              axios
                .post('auth/login/', values)
                .then(
                  /* istanbul ignore next */ data => {
                    dispatch({ type: 'set', user: data.data.status });
                    /* istanbul ignore next */
                    toaster.success('Login Successful');
                    setSubmitting(false);
                    history.push('/locomotives');
                  },
                )
                .catch(() => {
                  setSubmitError(true);
                  setSubmitting(false);
                });
            }}
          >
            {({ errors, touched, handleSubmit, isSubmitting }) => (
              <form data-testid="locomotiveAdd-form" onSubmit={handleSubmit}>
                {submitError && (
                  <Error>Please check your username or password</Error>
                )}
                <ul>
                  <li data-testid="username">
                    <Input label="Username" name="username" />
                    <Error>
                      {errors.username && touched.username ? (
                        <div className="error">{errors.username}</div>
                      ) : null}
                    </Error>
                  </li>
                  <li data-testid="password">
                    <Input label="Password" name="password" type="password" />
                    <Error>
                      {errors.password && touched.password ? (
                        <div className="error">{errors.password}</div>
                      ) : null}
                    </Error>
                  </li>
                  <li>
                    <Button
                      data-testid="login-submit"
                      disabled={isSubmitting}
                    />
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
