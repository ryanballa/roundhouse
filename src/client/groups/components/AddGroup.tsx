/* eslint-disable react/no-multi-comp */
import React, { FunctionComponent } from 'react';
import { toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import Input from '../../components/atoms/forms/Input';
import { colors } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Button from '../../components/atoms/Button';
import ModalWindow from '../../components/organisms/ModalWindow';
import { userState } from '../../UserProvider';
import groupsService from '../../services/groups.service';

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

const customStyles = {
  content: {
    left: '30%',
    right: '30%',
    maxHeight: '500px',
    maxWidth: '40%',
  },
};

type GroupsProps = {
  id: number;
  type: string;
};

type AddGroupProps = {
  isOpen: boolean;
  handleModalClose: () => void;
  handleUpdate: (GroupsProps) => void;
};

const AddGroup: FunctionComponent<AddGroupProps> = ({
  handleUpdate,
  isOpen,
  handleModalClose,
}) => {
  const { user } = userState();

  return (
    <ModalWindow
      isModalOpen={isOpen}
      handleModalClose={() => {
        handleModalClose();
      }}
      style={customStyles}
      title="Add Group"
    >
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          groupsService.add(user, values).then(res => {
            toaster.success('Group Added');
            Object.assign(values, res);
            handleUpdate({ values });
          });
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <StyledFormDiv>
            <form data-testid="groupAdd-form" onSubmit={handleSubmit}>
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
                    data-testid="groupAdd-submit"
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
    </ModalWindow>
  );
};

export default AddGroup;
