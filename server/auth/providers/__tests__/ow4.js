const { getPermissionLevel } = require('../ow4');
const permissionLevels = require('../../../../common/auth/permissions');

function mockOW4OAuth2ResponseBody(data) {
  return Object.assign({
    first_name: 'first name',
    last_name: 'last name',
    username: 'username',
    email: 'test@example.org',
    member: false,
    staff: false,
    superuser: false,
    nickname: 'nickname',
    rfid: '12345678',
    image: '',
    field_of_study: '',
  }, data);
}

describe('permission level parser', () => {
  it('parses userinfo body and returns is logged in permission for non-members', () => {
    const body = mockOW4OAuth2ResponseBody({ member: false });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.IS_LOGGED_IN);
  });

  it('parses userinfo body and returns can vote permission for members', () => {
    const body = mockOW4OAuth2ResponseBody({ member: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.CAN_VOTE);
  });

  it('parses userinfo body and returns can vote permission for staff', () => {
    const body = mockOW4OAuth2ResponseBody({ member: true, staff: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.CAN_VOTE);
  });

  it('parses userinfo body and returns can vote permission for superusers', () => {
    const body = mockOW4OAuth2ResponseBody({ member: true, superuser: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.CAN_VOTE);
  });

  it('parses userinfo body and returns is logged in permission for superusers who are not members', () => {
    const body = mockOW4OAuth2ResponseBody({ member: false, superuser: true });

    expect(getPermissionLevel(body)).toEqual(permissionLevels.IS_LOGGED_IN);
  });
});
