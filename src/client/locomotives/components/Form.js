/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import Error from '../../components/atoms/forms/Error';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';
import Gallery from '../../components/organisms/Gallery';
import Input from '../../components/atoms/forms/Input';
import Toggle from '../../components/atoms/forms/Toggle';
import Select from '../../components/atoms/forms/Select';
import DatePickerField from '../../components/atoms/forms/DatePickerField';
import ModalWindow from '../../components/organisms/ModalWindow';
import Button from '../../components/atoms/Button';

const StyledDiv = styledComponent('div', {
  '& input': {
    border: '1px solid #fffcfc',
    borderRadius: '2px',
    boxShadow: '0 0 0 1px rgba(67, 90, 111, 0.14)',
    padding: '8px',
    width: '50%',
  },
  '& li': {
    listStyle: 'none',
    marginBottom: '15px',
  },
  '& ul': {
    paddingLeft: 0,
  },
  color: colors.error,
  paddingTop: '5px',
});

const Form = ({
  errors,
  isSubmitting,
  handleSubmit,
  photos,
  setFieldValue,
  touched,
  values,
}) => {
  const [addingPhoto, setAddingPhoto] = useState(false);
  return (
    <StyledDiv>
      <form data-testid="locomotiveAdd-form" onSubmit={handleSubmit}>
        <ul>
          <li>
            {values.thumbnail && (
              <img src={values.thumbnail} width="200" alt="" />
            )}
            <Button
              onClick={() => {
                setAddingPhoto(true);
              }}
              type="button"
              variant="quiet"
            >
              Select New Photo
            </Button>
            <ModalWindow
              isModalOpen={addingPhoto}
              handleModalClose={() => {
                setAddingPhoto(false);
              }}
            >
              <Gallery
                canSelect
                handleSelection={photo => {
                  setFieldValue('thumbnail', photo.path);
                }}
                photos={photos}
                title="Select a Photo"
              />
            </ModalWindow>
          </li>
          <li>
            <Field type="hidden" name="user_id" />
          </li>
          <li data-testid="road">
            <Input
              label="Road"
              id="road"
              type="text"
              name="road"
              placeholder=""
            />
            <Error>
              {errors.road && touched.road ? (
                <div className="error">{errors.road}</div>
              ) : null}
            </Error>
          </li>
          <li data-testid="engine_number">
            <Input
              label="Engine Number"
              id="engine_number"
              type="text"
              name="engine_number"
              placeholder=""
            />
            <Error>
              {errors.engine_number && touched.engine_number ? (
                <div className="error">{errors.engine_number}</div>
              ) : null}
            </Error>
          </li>
          <li data-testid="purchased_on">
            <DatePickerField
              label="Purchased On"
              name="purchased_on"
              setFieldValue={setFieldValue}
              values={values || []}
            />
          </li>
          <li data-testid="is_operational">
            <Field
              label="Operational"
              id="is_operational"
              name="is_operational"
              component={Toggle}
              setFieldValue={setFieldValue}
            />
          </li>
          <li data-testid="is_dcc">
            <Field
              label="DCC Equipped"
              id="is_dcc"
              name="is_dcc"
              component={Toggle}
              setFieldValue={setFieldValue}
            />
          </li>
          <li>
            <Select label="Location" id="location" name="location">
              <option value="club">Club</option>
              <option value="home">Home</option>
              <option value="studio">Studio</option>
            </Select>
          </li>
          <li>
            <Select label="Type" id="type" name="type">
              <option value="steam">Steam Engine</option>
              <option value="diesel">Diesel Engine</option>
              <option value="trolley">Trolley</option>
              <option value="other">Other</option>
            </Select>
          </li>
          <li>
            <Input
              label="Value"
              id="value"
              type="text"
              name="value"
              placeholder="0"
            />
          </li>
          <li>
            <Input
              label="Purchase Price"
              id="purchase_price"
              type="text"
              name="purchase_price"
              placeholder="0"
            />
          </li>
          <li>
            <Input
              label="Notes"
              id="notes"
              type="text"
              name="notes"
              placeholder=""
            />
          </li>
          <li>
            <Gallery
              canSelect
              handleSelection={photo => {
                setFieldValue('thumbnail', photo.path);
              }}
              photos={photos}
              title="Select a Photo"
            />
          </li>
          <li>
            <Button data-testid="locomotiveAdd-submit" disabled={isSubmitting}>
              Submit
            </Button>
          </li>
        </ul>
      </form>
    </StyledDiv>
  );
};

Form.propTypes = {
  errors: PropTypes.shape({
    engine_number: PropTypes.node,
    road: PropTypes.node,
  }),
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  photos: PropTypes.arrayOf(PropTypes.object),
  setFieldValue: PropTypes.func,
  touched: PropTypes.shape({
    engine_number: PropTypes.bool,
    road: PropTypes.bool,
  }).isRequired,
  values: PropTypes.shape({
    required: PropTypes.bool,
    thumbnail: PropTypes.string,
  }),
};

Form.defaultProps = {
  errors: {},
  isSubmitting: false,
  photos: [],
  setFieldValue: () => {},
  values: {},
};

export default Form;
