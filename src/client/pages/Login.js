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
import { colors } from '../config/styles';

const Form = styledComponent('div', {
  '& h1': {
    marginTop: 0,
  },
  '& input': {
    width: '360px',
  },
  '& li': {
    listStyle: 'none',
    marginBottom: '15px',
  },
  '& ul': {
    paddingLeft: 0,
  },
  border: `1px solid ${colors.form.stroke}`,
  borderRadius: '4px',
  margin: '0 auto',
  padding: '25px',
  width: '400px',
});

function Login({ history }) {
  const dispatch = userDispatch();
  const [submitError, setSubmitError] = useState(false);

  return (
    <SingleColumn history={history}>
      <Form>
        <h1>Login</h1>
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
