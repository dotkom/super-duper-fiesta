const { RESOLUTION_TYPES, getResolutionTypeDisplay } = require('../voting');

describe('get resolution type display', () => {
  it('gets correct resolution type for regular vote demand', () => {
    expect(getResolutionTypeDisplay(RESOLUTION_TYPES.regular.key).name)
      .toEqual(RESOLUTION_TYPES.regular.name);
  });

  it('gets correct resolution type for qualified vote demand', () => {
    expect(getResolutionTypeDisplay(RESOLUTION_TYPES.qualified.key).name)
      .toEqual(RESOLUTION_TYPES.qualified.name);
  });
});
