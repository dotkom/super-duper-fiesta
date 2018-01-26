const fetch = require('jest-fetch-mock');

jest.setMock('node-fetch', fetch);

const { getClientInformation } = require('../ow4');


describe('ow4 oauth2 provider', () => {
  it('throws error if it fails', async () => {
    fetch.mockImplementation(() => { throw Error(); });

    await expect(getClientInformation()).rejects.toEqual(new Error());
  });
});
