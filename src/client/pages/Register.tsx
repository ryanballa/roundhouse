/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import axios from 'axios';
import { toaster } from 'evergreen-ui';
import SingleColumn from '../components/layout/SingleColumn';
import ReCAPTCHA from 'react-google-recaptcha';
import Input from '../components/atoms/forms/Input';
import Button from '../components/atoms/Button';
import FormWrapper from '../components/atoms/forms/FormWrapper';
import { Field, Formik } from 'formik';
import { styledComponent } from '../utils/styledComponent';

const StyledSection = styledComponent('section', {});

type RegisterViewProps = {
  history: {
    push: (arg0: string) => void;
  };
};

const Register: React.FC<RegisterViewProps> = ({ history }) => {
  const [isRobot, setIsRobot] = useState(true);

  return (
    <SingleColumn authProtected={false} history={history}>
      <h1>Register</h1>
      <FormWrapper>
        <Formik
          initialValues={{
            full_name: '',
            password: '',
            username: '',
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            axios
              .post('/auth/register', {
                ...values,
              })
              .then(
                /* istanbul ignore next */ () => {
                  /* istanbul ignore next */
                  setSubmitting(false);
                  toaster.success('Registered Successfully');
                  history.push('/login');
                },
              )
              .catch(e => {
                console.log(e);
              });
          }}
        >
          {({ handleSubmit, isSubmitting }) => {
            return (
              <form data-testid="taskAdd-form" onSubmit={handleSubmit}>
                <ul>
                  <li data-testid="full_name">
                    <Input
                      label="Full Name"
                      id="full_name"
                      type="text"
                      name="full_name"
                      placeholder=""
                    />
                  </li>
                  <li data-testid="username">
                    <Input
                      label="User Name"
                      id="username"
                      type="text"
                      name="username"
                      placeholder=""
                    />
                  </li>
                  <li data-testid="password">
                    <Input
                      label="Password"
                      id="password"
                      type="password"
                      name="password"
                      placeholder=""
                    />
                  </li>
                  <li>
                    <ReCAPTCHA
                      sitekey="6LfwML0UAAAAACmy1MXSUbSlyveoJmcXbJHIJ_L_"
                      onChange={() => {
                        setIsRobot(false);
                      }}
                    />
                  </li>
                  <li>
                    <Button
                      data-testid="userAdd-submit"
                      disabled={isSubmitting || isRobot}
                      icon="add"
                    >
                      Register
                    </Button>
                  </li>
                </ul>
              </form>
            );
          }}
        </Formik>
      </FormWrapper>
      <StyledSection />
    </SingleColumn>
  );
};

export default Register;
