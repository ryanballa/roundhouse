import React from 'react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { testHook } from '../utils/testHook';
import TrafficGenerators from './TrafficGenerators';
import { UserProvider } from '../UserProvider';
import { usePromise } from '../utils/promise.hook';

const history = createBrowserHistory();
jest.spyOn(history, 'push');
const PATHNAME = '/traffic-generators';

const buildComponent = props =>
  mount(
    <MemoryRouter initialEntries={[PATHNAME]}>
      <UserProvider>
        <TrafficGenerators
          history={{
            push: () => {},
          }}
          user={{ id: 1 }}
          {...props}
        />
      </UserProvider>
    </MemoryRouter>,
  );

describe('Traffic Generators Test', () => {
  let wrapper;

  beforeEach(async () => {
    await act(async () => {
      const mock = new MockAdapter(axios);
      const data = [
        {
          id: 2,
          name: 'Team Track',
          type: null,
          created_at: '2019-08-27T15:56:46.727Z',
          updated_at: '2019-08-27T15:56:46.727Z',
          user_id: 1,
          destination_id: 1,
        },
      ];
      mock.onGet('/api/v1/trafficGenerators').reply(200, data);
      testHook(() => {
        usePromise(async () => {
          return { value: '' };
        }, data);
      });
      wrapper = buildComponent();
    });
  });

  it('displays the traffic generator page', async () => {
    wrapper.update();
    const findTrafficGeneratorPage = () =>
      wrapper.find('[data-testid="trafficGeneratorPage"]');
    const findLoadedPage = () =>
      wrapper.find('[data-testid="addTrafficGenerator"]').first();
    expect(findLoadedPage().length).toBe(1);
    expect(findTrafficGeneratorPage().length).toEqual(1);
  });
  it('shows a delete button', async () => {
    wrapper.update();
    const deleteButton = wrapper
      .find('[data-testid="deleteTrafficGenerator"]')
      .at(0);
    expect(deleteButton.length).toEqual(1);
  });
});
