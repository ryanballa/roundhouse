import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import DeleteTrafficGenerator from './DeleteTrafficGenerator';
import { usePromise } from '../../utils/promise.hook';
import { testHook } from '../../utils/testHook';

const render = props => mount(<DeleteTrafficGenerator {...props} />);

describe('Delete Traffic Generator', () => {
  it('displays the delete modal', async () => {
    let component;
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
    const mockDelete = jest.fn();
    testHook(() => {
      usePromise(async () => {
        return { value: '' };
      }, data);
    });
    await act(async () => {
      component = render({ handleDelete: mockDelete });
    });
    component.update();
    const deletebutton = () => component.find('Button[children="Delete"]');
    expect(deletebutton().length).toEqual(1);
    // deletebutton().simulate('click');
    // expect(mockDelete).toHaveBeenCalled();
  });
});
