import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { act } from 'react-dom/test-utils';
import { asyncUpdates } from '../../utils/testHelpers';
import AddTask from './AddTask';
import { UserProvider } from '../../UserProvider';

const PATHNAME = '/work-orders/1';
const mockUpate = jest.fn();
const mockModalClose = jest.fn();

const buildComponent = props =>
  mount(
    <MemoryRouter initialEntries={[PATHNAME]}>
      <UserProvider>
        <AddTask
          isOpen
          handleModalClose={mockModalClose}
          handleUpdate={mockUpate}
          railcars={[{ id: 1, road: 'Rock Island' }, { id: 2, road: 'BN' }]}
          trafficGenerators={[{ id: 1, name: 'Station' }]}
          workItemId={1}
          {...props}
        />
      </UserProvider>
    </MemoryRouter>,
  );

describe('Add Task Test', () => {
  let wrapper;

  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
      }
      if (/Warning.*not await the result of calling act/.test(args[0])) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(async () => {
    await act(() => {
      const mock = new MockAdapter(axios);
      const data = [
        {
          id: 1,
          railcar_id: 2,
        },
      ];
      mock.onGet('/api/v1/tasks').reply(200, data);
      mock.onPost('/api/v1/tasks/').reply(200, {
        id: 1,
        railcar_id: 3,
      });
      wrapper = buildComponent();
    });
  });

  it('displays the add task form', async () => {
    await asyncUpdates(wrapper);
    const taskAddForm = () => wrapper.find('[data-testid="taskAdd-form"]');

    expect(taskAddForm().length).toEqual(1);
  });
  it('submits data when adding a task', async () => {
    wrapper = buildComponent({ isLoading: false });
    await asyncUpdates(wrapper);

    expect(wrapper.find('.error').length).toEqual(0);
    wrapper
      .find('[data-testid="type"] select')
      .at(0)
      .simulate('change', { target: { name: 'type', value: 'Drop' } })
      .simulate('keyDown', { key: 'Enter' });
    await asyncUpdates(wrapper);
    wrapper
      .find('[data-testid="railcar_id"] select')
      .at(0)
      .simulate('change', { target: { name: 'railcar_id', value: '1' } })
      .simulate('keyDown', { key: 'Enter' });
    await asyncUpdates(wrapper);
    wrapper
      .find('[data-testid="traffic_generator_id"] select')
      .at(0)
      .simulate('change', {
        target: { name: 'traffic_generator_id', value: 1 },
      })
      .simulate('keyDown', { key: 'Enter' });
    await asyncUpdates(wrapper);
    wrapper
      .find('[data-testid="taskAdd-submit"]')
      .at(0)
      .simulate('click');
    await asyncUpdates(wrapper);

    const taskAddFormErrors = () => wrapper.find('.error');
    expect(taskAddFormErrors().length).toEqual(0);

    wrapper
      .find('form')
      .at(0)
      .simulate('submit');
    await asyncUpdates(wrapper);

    expect(mockUpate).toHaveBeenCalled();
  });
});
