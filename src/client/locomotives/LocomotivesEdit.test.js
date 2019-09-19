import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';
import { MemoryRouter } from 'react-router';
import { act } from '../utils/act';
import { asyncUpdates } from '../utils/testHelpers';
import LocomotivesEdit from './LocomotivesEdit';
import { UserProvider } from '../UserProvider';

const PATHNAME = '/locomotives/1';
const mockSubmit = jest.fn();

const buildComponent = props =>
  mount(
    <MemoryRouter initialEntries={[PATHNAME]}>
      <UserProvider>
        <LocomotivesEdit
          data={[{ engine_number: '123', road: 'Test' }]}
          handleFormSubmit={mockSubmit}
          history={{
            push: () => {},
          }}
          photos={[]}
          user={{ id: 1 }}
          {...props}
        />
      </UserProvider>
    </MemoryRouter>,
  );

describe('Locomotive Edit Test', () => {
  let wrapper;

  beforeEach(async () => {
    await act(() => {
      wrapper = buildComponent();
    });
  });

  it('displays the locomotive edit form', async () => {
    await asyncUpdates(wrapper);
    const findLocomotiveAddForm = () =>
      wrapper.find('[data-testid="locomotiveEdit-form"]');

    expect(findLocomotiveAddForm().length).toEqual(1);
  });
  it('displays the loading icon', async () => {
    wrapper = buildComponent({ isLoading: true });
    await asyncUpdates(wrapper);
    const loadingNotice = () => wrapper.find('[data-testid="loading"]');

    expect(loadingNotice().length).toEqual(1);
  });
  xit('displays errors when required fields are left empty', async () => {
    wrapper = buildComponent({ isLoading: false });
    await asyncUpdates(wrapper);

    wrapper
      .find('[data-testid="engine_number"] input')
      .at(0)
      .simulate('change', { target: { name: 'engine_number', value: '' } })
      .simulate('blur')
      .simulate('keyDown', { key: 'Enter' });

    wrapper
      .find('form')
      .at(0)
      .simulate('submit');

    const findLocomotiveAddFormErrors = () => wrapper.find('.error');
    expect(findLocomotiveAddFormErrors().length).toEqual(1);
  });
  it('submits data when editing a locomotive', async () => {
    wrapper = buildComponent({ isLoading: false });
    await asyncUpdates(wrapper);

    expect(wrapper.find('.error').length).toEqual(0);
    wrapper
      .find('[data-testid="road"] input')
      .at(0)
      .simulate('change', { target: { name: 'road', value: 'Rocky Island' } })
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

    expect(mockSubmit).toHaveBeenCalledWith({
      engine_number: '1234',
      is_dcc: false,
      is_operational: true,
      location: 'home',
      notes: '',
      purchase_price: 0,
      purchased_on: moment().format('YYYY-MM-DD'),
      road: 'Rocky Island',
      thumbnail: '',
      type: 'diesel',
      user_id: '',
      value: '',
    });
  });
});
