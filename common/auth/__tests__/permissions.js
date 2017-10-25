const { getPermissionDisplay,
  IS_LOGGED_IN, IS_LOGGED_IN_DISPLAY,
  CAN_VOTE, CAN_VOTE_DISPLAY,
  IS_MANAGER, IS_MANAGER_DISPLAY,
  IS_SUPERUSER, IS_SUPERUSER_DISPLAY,
} = require('../permissions');

describe('getPermissionDisplay', () => {
  it('gets correct permission display for logged in user', () => {
    expect(getPermissionDisplay(IS_LOGGED_IN)).toEqual(IS_LOGGED_IN_DISPLAY);
  });
  it('gets correct permission display for user who can vote', () => {
    expect(getPermissionDisplay(CAN_VOTE)).toEqual(CAN_VOTE_DISPLAY);
  });
  it('gets correct permission display for manager', () => {
    expect(getPermissionDisplay(IS_MANAGER)).toEqual(IS_MANAGER_DISPLAY);
  });
  it('gets correct permission display for dotkom', () => {
    expect(getPermissionDisplay(IS_SUPERUSER)).toEqual(IS_SUPERUSER_DISPLAY);
  });
});
