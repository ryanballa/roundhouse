import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { asyncUpdates } from '../utils/testHelpers';
import { UserProvider } from '../UserProvider';
import WorkOrders from './WorkOrders';

describe('Work Orders', () => {
  xit('should fetch data on mount', async () => {
    let component;
    const PATHNAME = '/work-orders';
    // NOTE: Not sure how to remove the warnings about ACT. I've hidden them before but that didn't seem right.
    act(() => {
      component = mount(
        <MemoryRouter initialEntries={[PATHNAME]}>
          <UserProvider>
            <WorkOrders
              history={{
                push: () => {},
              }}
            />
          </UserProvider>
        </MemoryRouter>,
      );
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    component.update();
    const title = component
      .find('.hotel-name')
      .first()
      .text();
    expect(title).toEqual('Heart O Chicago');
  });
});
