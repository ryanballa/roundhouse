import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { wait } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { asyncUpdates } from '../utils/testHelpers';
import Edit from './Edit';

const PATHNAME = 'locomotives/1';

const buildComponent = () =>
  mount(
    <MemoryRouter initialEntries={[PATHNAME]}>
      <Route path={PATHNAME} component={Edit} />
    </MemoryRouter>,
  );

describe('Locomotive Edit Test', () => {
  let wrapper;
  let mock;
  beforeEach(async () => {
    wrapper = buildComponent();
    window.history.pushState({}, '', PATHNAME);
    await asyncUpdates(wrapper);
    mock = new MockAdapter(axios);
    mock.onGet('/api/v1/locomotives/1').reply(200, {
      data: {
        locomotive: { id: '1', path: 'foo' },
      },
    });
    mock.onGet('/api/v1/photos').reply(200, { data: { id: '1', path: 'foo' } });
  });

  afterEach(() => {
    mock.reset();
  });

  it('displays the locomotive edit form', async () => {
    await asyncUpdates(wrapper);
    const findLocomotiveAddForm = () =>
      wrapper.find('[data-testid="locomotiveEdit-form"]');

    expect(findLocomotiveAddForm().length).toEqual(1);
  });
  it('displays the loading icon', async () => {
    await asyncUpdates(wrapper);
    const loadingNotice = () => wrapper.find('[data-testid="loading"]');

    expect(loadingNotice().length).toEqual(1);
  });
  xit('displays errors when required fields are left empty', async () => {
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
  xit('submits data when editing a locomotive', async () => {
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

    wrapper
      .find('Formik')
      .props()
      .onSubmit({}, { setSubmitting: false });
    await wait(() => {
      expect(mock.history.post.length).toBe(1);
    });
  });
});
