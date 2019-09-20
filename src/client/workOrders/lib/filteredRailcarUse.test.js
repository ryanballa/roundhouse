import filteredRailcarUse from './filteredRailcarUse';

describe('Work Orders - Filterd Railcar Use', () => {
  it('returns all railcars if no tasks are entered', () => {
    const tasks = [];
    const railcars = [{ id: 1, road: 'Rock Island' }];
    expect(filteredRailcarUse(tasks, railcars)).toEqual(railcars);
  });
  it('returns only railcars not used twice', () => {
    const tasks = [{ id: 1, railcar_id: 1 }, { id: 2, railcar_id: 1 }];
    const railcars = [{ id: 1, road: 'Rock Island' }, { id: 2, road: 'BN' }];
    expect(filteredRailcarUse(tasks, railcars)).toEqual([
      { id: 2, road: 'BN' },
    ]);
  });
  it('returns railcars if used once', () => {
    const tasks = [{ id: 1, railcar_id: 1 }, { id: 2, railcar_id: 2 }];
    const railcars = [{ id: 1, road: 'Rock Island' }, { id: 2, road: 'BN' }];
    expect(filteredRailcarUse(tasks, railcars)).toEqual(railcars);
  });
});
