/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import { toaster } from 'evergreen-ui';
import Input from '../components/atoms/forms/Input';
import Button from '../components/atoms/Button';
import { Formik } from 'formik';
import { HeaderToolbar } from '../components/organisms/HeaderToolbar';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { usePromise } from '../utils/promise.hook';
import layoutsService from '../services/layouts.service';
import { colors } from '../config/styles';
import { userState } from '../UserProvider';

const StyledDiv = styledComponent('div', {});

const StyledFormDiv = styledComponent('div', {
  '& button': {
    marginTop: '38px',
  },
  '& input': {
    width: '90%',
  },
  '& li': {
    listStyle: 'none',
    marginBottom: '15px',
    marginRight: '15px',
  },
  '& ul': {
    paddingLeft: 0,
  },
  color: colors.error,
  paddingTop: '5px',
});

type LayoutProps = {
  history: {
    push: () => void;
  };
};

const Layout: React.FC<LayoutProps> = ({ history }) => {
  const { user } = userState();
  const [data, error, isLoading, setData] = usePromise(
    layoutsService.get(),
    [],
    [],
  );

  console.log(data[0]);

  return (
    <SingleColumn history={history}>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
          <HeaderToolbar description="" title="Layout Details">
            <></>
          </HeaderToolbar>
          <p>Enter your layout name</p>
          <Formik
            initialValues={{
              name: data[0].name,
            }}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              if (data.length > 0) {
                layoutsService
                  .edit(user, { id: data[0].id, name: values.name })
                  .then(res => {
                    toaster.success('Layout Edited');
                  });
              } else {
                layoutsService.add(user, values).then(res => {
                  toaster.success('Layout Added');
                });
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <StyledFormDiv>
                <form data-testid="layoutAdd-form" onSubmit={handleSubmit}>
                  <ul>
                    <li data-testid="name">
                      <Input
                        label="Name"
                        id="name"
                        type="text"
                        name="name"
                        placeholder=""
                      />
                    </li>
                    <li>
                      <Button
                        data-testid="layoutAdd-submit"
                        disabled={isSubmitting}
                        icon="add"
                      >
                        Add
                      </Button>
                    </li>
                  </ul>
                </form>
              </StyledFormDiv>
            )}
          </Formik>
        </StyledDiv>
      )}
    </SingleColumn>
  );
};

export default Layout;
