import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { toaster } from 'evergreen-ui';
import axios from 'axios';
import SingleColumn from '../components/layout/SingleColumn';
import Thumb from '../components/atoms/Thumb';

function Upload() {
  return (
    <SingleColumn>
      <h1>Upload Image</h1>
      <div className="container">
        <Formik
          initialValues={{ file: null }}
          onSubmit={(values, { setSubmitting }) => {
            const bodyFormData = new FormData();
            bodyFormData.append('file', values.file);
            axios
              .post('/api/v1/locomotives/upload', bodyFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              })
              .then(
                /* istanbul ignore next */ () => {
                  /* istanbul ignore next */
                  toaster.success('Photo Added');
                  setSubmitting(false);
                },
              )
              .catch(err => {
                console.log(err);
              });
          }}
          validationSchema={yup.object().shape({
            file: yup.mixed().required(),
          })}
          render={({ values, handleSubmit, setFieldValue }) => {
            return (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label id="file" htmlFor="file">
                    File upload
                    <input
                      id="file"
                      name="file"
                      type="file"
                      onChange={event => {
                        setFieldValue('file', event.currentTarget.files[0]);
                      }}
                      className="form-control"
                    />
                  </label>
                  <Thumb file={values.file} />
                </div>
                <button type="submit" className="btn btn-primary">
                  submit
                </button>
              </form>
            );
          }}
        />
      </div>
    </SingleColumn>
  );
}

export default Upload;
