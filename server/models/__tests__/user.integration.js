const databaseSetup = require('../essentials');
const {
  addUser, getAnonymousUser, getQualifiedUsers, getUserById,
  getUserByUsername, getUsers, updateUserById,
} = require('../user.accessors');
const { hashWithSalt } = require('../../utils/crypto');
const { CAN_VOTE } = require('../../../common/auth/permissions');

const {
  generateMeeting, generateUser, generateAnonymousUser,
} = require('../../utils/integrationTestUtils');

describe('user', () => {
  beforeAll(async () => {
    await databaseSetup();
  });

  it('adds user', async () => {
    const user = await generateUser({
      onlinewebId: 'test',
    });

    expect(user).toEqual(expect.objectContaining({
      onlinewebId: 'test',
    }));
  });

  it('adds anonymous user', async () => {
    const user = await generateAnonymousUser({
      passwordHash: '123',
    });

    expect(user).toEqual(expect.objectContaining({
      passwordHash: '123',
    }));
  });

  it('updates user', async () => {
    const user = await generateUser();

    const updatedUser = await updateUserById({ _id: user._id }, {
      onlinewebId: 'test2',
    }, { new: true });

    expect(updatedUser).toEqual(expect.objectContaining({
      _id: user._id,
      onlinewebId: 'test2',
    }));
  });

  it('gets users for meeting', async () => {
    const meeting = await generateMeeting();
    const user1 = await generateUser({ genfors: meeting });
    const user2 = await generateUser();

    const users = await getUsers(meeting);

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: user1._id,
        }),
      ]),
    );
    expect(users).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: user2._id,
        }),
      ]),
    );
  });

  it('gets anonymous users for meeting', async () => {
    const meeting = await generateMeeting();
    const user1 = await generateAnonymousUser({ genfors: meeting });
    const user2 = await generateAnonymousUser();

    const users = await getUsers(meeting, true);

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: user1._id,
        }),
      ]),
    );
    expect(users).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: user2._id,
        }),
      ]),
    );
  });

  it('gets user by id', async () => {
    const user = await generateUser();

    expect(await getUserById(user._id)).toEqual(expect.objectContaining({
      _id: user._id,
    }));
  });

  it('gets anonymous user by id', async () => {
    const user = await generateAnonymousUser();

    expect(await getUserById(user._id, true)).toEqual(expect.objectContaining({
      _id: user._id,
    }));
  });

  // Fails because there are multiple users with same username.
  it.skip('gets user by username', async () => {
    const user = await generateUser({ onlinewebId: 'update-test-6' });

    expect(await getUserByUsername(user.onlinewebId, user.genfors))
      .toEqual(expect.objectContaining({
        _id: user._id,
      }));
  });

  it('gets anonymous user', async () => {
    const meeting = await generateMeeting();
    const user = await generateUser({
      onlinewebId: 'test-get-anon-4',
      genfors: meeting,
    });
    const anonuser = await generateAnonymousUser({
      passwordHash: hashWithSalt('12345678', user.onlinewebId),
      genfors: meeting,
    });

    expect(await getAnonymousUser('12345678', user.onlinewebId, meeting)).toEqual(expect.objectContaining({
      _id: anonuser._id,
    }));
  });

  it('gets qualified users', async () => {
    const meeting = await generateMeeting();
    const user1 = await generateUser({
      genfors: meeting,
      canVote: true,
      permissions: CAN_VOTE,
    });
    const user2 = await generateUser({
      genfors: meeting,
      canVote: false,
      permissions: CAN_VOTE,
    });

    const users = await getQualifiedUsers(meeting);

    expect(users).toEqual(expect.arrayContaining([
      expect.objectContaining({
        _id: user1._id,
      }),
    ]));
    expect(users).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        _id: user2._id,
      }),
    ]));
  });
});
