import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { wait } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { asyncUpdates } from '../utils/testHelpers';
import Add from './Add';

const PATHNAME = '/locomotives';

const buildComponent = () =>
  mount(
    <MemoryRouter initialEntries={[PATHNAME]}>
      <Route path={PATHNAME} component={Add} />
    </MemoryRouter>,
  );

describe('Locomotive Add Test', () => {
  let wrapper;
  beforeEach(async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('/api/v1/photos').reply(200, [{ id: '1', path: 'foo' }]);
    wrapper = buildComponent();
    await asyncUpdates(wrapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays the locomotive add form', async () => {
    await asyncUpdates(wrapper);
    const findLocomotiveAddForm = () =>
      wrapper.find('[data-testid="locomotiveAdd-form"]');

    expect(findLocomotiveAddForm().length).toEqual(1);
  });
  it('displays errors when required fields are left empty', async () => {
    await asyncUpdates(wrapper);

    wrapper
      .find('[data-testid="road"] input')
      .at(0)
      .simulate('blur');

    await asyncUpdates(wrapper);

    wrapper
      .find('[data-testid="engine_number"] input')
      .at(0)
      .simulate('blur');

    wrapper
      .find('form')
      .at(0)
      .simulate('submit');

    const findLocomotiveAddFormErrors = () => wrapper.find('.error');
    expect(findLocomotiveAddFormErrors().length).toEqual(2);
  });
  it('submits data when adding a locomotive', async () => {
    await asyncUpdates(wrapper);

    expect(wrapper.find('.error').length).toEqual(0);
    wrapper
      .find('[data-testid="road"] input')
      .at(0)
      .simulate('change', { target: { name: 'road', value: '1234' } })
      .simulate('keyDown', { key: 'Enter' });
    await asyncUpdates(wrapper);
    wrapper
      .find('[data-testid="engine_number"] input')
      .at(0)
      .simulate('change', { target: { name: 'engine_number', value: '1234' } })
      .simulate('keyDown', { key: 'Enter' });
    await asyncUpdates(wrapper);
    wrapper
      .find('[data-testid="is_operational"] input')
      .at(0)
      .simulate('change', { target: { name: 'is_operational', value: true } })
      .simulate('keyDown', { key: 'Enter' });
    await asyncUpdates(wrapper);
    wrapper
      .find('[data-testid="locomotiveAdd-submit"]')
      .at(0)
      .simulate('click');
    await asyncUpdates(wrapper);

    const findLocomotiveAddFormErrors = () => wrapper.find('.error');
    expect(findLocomotiveAddFormErrors().length).toEqual(0);

    wrapper
      .find('form')
      .at(0)
      .simulate('submit');
    await asyncUpdates(wrapper);

    const mock = new MockAdapter(axios);
    const data = { road: 'Rock Island' };
    mock.onPost('/api/v1/locomotives').reply(200, data);

    wrapper
      .find('Formik')
      .props()
      .onSubmit({}, { setSubmitting: false });
    await wait(() => {
      expect(mock.history.post.length).toBe(1);
    });
  });
});
