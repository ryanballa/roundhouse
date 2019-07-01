import React, { Fragment, useState, useEffect } from 'react'
import { Button, FormField, Pane, Select, Switch } from 'evergreen-ui'
import { Formik, Field } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import Error from '../components/atoms/forms/Error';

const StyledDiv = styledComponent('div', {
  '& li': {
    listStyle: 'none',
    marginBottom: '15px',
  },
  '& input': {
    border: '1px solid #fffcfc',
    borderRadius: '2px',
    boxShadow: '0 0 0 1px rgba(67, 90, 111, 0.14)',
    padding: '8px',
  },
});

function Edit({match}) {
  const [data, setData] = useState([{ engine_number: '123', road: 'Test'}]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios(
        `/api/v1/locomotives/${match.params.id}`,
      );
      setData(result.data);
      setIsLoading(false);
    }
  fetchData();
}, []);

const SwitchField = ({
  id,
  field: { name, value, onChange, onBlur },
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <div>
    <Switch
      id={id}
      name={name}
      value={value ? value.toString() : 'false'}
      onBlur={onBlur}
      checked={value}
      onChange={onChange}
      {...props}
    />
  </div>
);

const SelectField = ({
  id,
  field: { name, value, onChange, onBlur },
  form: { touched, errors },
  ...props
}) => (
  <div>
    <Select
      id={id}
      name={name}
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      {...props}
    >
      <option value="club">Club</option>
      <option value="home">Home</option>
      <option value="studio">Studio</option>
    </Select>
  </div>
);

const EditSchema = Yup.object().shape({
  engine_number: Yup.string()
    .min(3, 'Numbers need to be at least 3 numbers')
    .max(4, 'Numbers cannot be more than 4')
    .required('Required'),
  road: Yup.string()
    .required('Required'),
});

return (
  <SingleColumn>
    <Fragment>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <Pane>
          <Formik
            initialValues={
              {
                road: data[0].road,
                engine_number: data[0].engine_number || '',
                is_operational: data[0].is_operational,
                is_dcc: data[0].is_dcc,
                location: data[0].location,
              }
            }
            validationSchema={EditSchema}
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
              axios.put(`/api/v1/locomotives/${match.params.id}`, values)
              .then(function (response) {
                console.log(response);
                setSubmitting(false);
              })
              .catch(function (error) {
                console.log(error);
              });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <StyledDiv>
                <form onSubmit={handleSubmit}>
                  <ul>
                    <li>
                      <FormField label="Road">
                        <Field type="text" name="road" placeholder="" />
                      </FormField>
                      <Error>
                        {errors.road && touched.road ? (
                          <div>{errors.road}</div>
                        ) : null}
                      </Error>
                    </li>
                    <li>
                      <FormField label="Engine Number">
                        <Field type="text" name="engine_number" placeholder="" />
                      </FormField>
                      <Error>
                        {errors.engine_number && touched.engine_number ? (
                          <div>{errors.engine_number}</div>
                        ) : null}
                      </Error>
                    </li>
                    <li>
                      <FormField label="Is Operational">
                        <Field name="is_operational" component={SwitchField} />
                      </FormField>
                    </li>
                    <li>
                      <FormField label="Is DCC">
                        <Field name="is_dcc" component={SwitchField} />
                      </FormField>
                    </li>
                    <li>
                      <FormField label="Location">
                        <Field name="location" component={SelectField} />
                      </FormField>
                    </li>
                    <li>
                      <Button disabled={isSubmitting}>
                        Submit
                      </Button>
                    </li>
                  </ul>
                </form>
              </StyledDiv>
            )}
          </Formik>
        </Pane>
      )}
    </Fragment>
  </SingleColumn>
)};

export default Edit;
