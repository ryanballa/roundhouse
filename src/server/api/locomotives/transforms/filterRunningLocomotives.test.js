const { filterRunningLocomotives } = require('./filterRunningLocomotives');

describe('filterRunningLocomotives tranform', () => {
  it('handles a null/undefined argument', () => {
    const undefinedLocos = filterRunningLocomotives(undefined, undefined);
    undefinedLocos.should.eql([]);

    const nullLocos = filterRunningLocomotives(null, null);
    nullLocos.should.eql([]);
  });
  it('handles a false argument', () => {
    const result = filterRunningLocomotives([{ is_operational: true }], 'true');
    result.should.eql([{ is_operational: true }]);
  });
});
