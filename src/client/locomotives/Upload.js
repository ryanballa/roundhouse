/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { Button, toaster } from 'evergreen-ui';
import axios from 'axios';
import SingleColumn from '../components/layout/SingleColumn';

class Thumb extends React.Component {
  state = {
    loading: false,
    thumb: undefined,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.file) {
      return;
    }

    this.setState({ loading: true }, () => {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };

      reader.readAsDataURL(nextProps.file);
    });
  }

  render() {
    const { file } = this.props;
    const { loading, thumb } = this.state;

    if (!file) {
      return null;
    }

    if (loading) {
      return <p>loading...</p>;
    }

    return (
      <img
        src={thumb}
        alt={file.name}
        className="img-thumbnail mt-2"
        height={200}
        width={200}
      />
    );
  }
}

function Upload() {
  const [data, setData] = useState([{ file: {} }]);

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
            // alert(
            //   JSON.stringify(
            //     {
            //       fileName: values.file.name,
            //       type: values.file.type,
            //       size: `${values.file.size} bytes`,
            //     },
            //     null,
            //     2,
            //   ),
            // );
          }}
          validationSchema={yup.object().shape({
            file: yup.mixed().required(),
          })}
          render={({ values, handleSubmit, setFieldValue }) => {
            return (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="file">File upload</label>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    onChange={event => {
                      setData(event.currentTarget.files[0]);
                      setFieldValue('file', event.currentTarget.files[0]);
                    }}
                    className="form-control"
                  />
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
