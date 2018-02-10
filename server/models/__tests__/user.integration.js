const {
  getAnonymousUser, getQualifiedUsers, getUserById,
  getUserByUsername, getUsers, updateUserById,
} = require('../user.accessors');
const { hashWithSalt } = require('../../utils/crypto');
const { CAN_VOTE } = require('../../../common/auth/permissions');

const {
  generateMeeting, generateUser, generateAnonymousUser,
} = require('../../utils/integrationTestUtils');

describe('user', () => {
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

    const updatedUser = await updateUserById(user.id, {
      onlinewebId: 'test2',
    }, { new: true });

    expect(updatedUser).toEqual(expect.objectContaining({
      id: user.id,
      onlinewebId: 'test2',
    }));
  });

  it('gets users for meeting', async () => {
    const meeting = await generateMeeting();
    const user1 = await generateUser({ meetingId: meeting.id });
    const user2 = await generateUser();

    const users = await getUsers(meeting);

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: user1.id,
        }),
      ]),
    );
    expect(users).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: user2.id,
        }),
      ]),
    );
  });

  it('gets anonymous users for meeting', async () => {
    const meeting = await generateMeeting();
    const user1 = await generateAnonymousUser({ meeting });
    const user2 = await generateAnonymousUser();

    const users = await getUsers(meeting, true);

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: user1.id,
        }),
      ]),
    );
    expect(users).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: user2.id,
        }),
      ]),
    );
  });

  it('gets user by id', async () => {
    const user = await generateUser();

    expect(await getUserById(user.id)).toEqual(expect.objectContaining({
      id: user.id,
    }));
  });

  it('gets anonymous user by id', async () => {
    const user = await generateAnonymousUser();

    expect(await getUserById(user.id, true)).toEqual(expect.objectContaining({
      id: user.id,
    }));
  });

  // Fails because there are multiple users with same username.
  it('gets user by username', async () => {
    const user = await generateUser({ onlinewebId: 'update-test-6' });

    expect(await getUserByUsername(user.onlinewebId, user.meetingId))
      .toEqual(expect.objectContaining({
        id: user.id,
      }));
  });

  it('gets anonymous user', async () => {
    const meeting = await generateMeeting();
    const user = await generateUser({
      onlinewebId: 'test-get-anon-4',
      meeting,
    });
    const anonuser = await generateAnonymousUser({
      passwordHash: hashWithSalt('12345678', user.onlinewebId),
      meeting,
    });

    expect(await getAnonymousUser('12345678', user.onlinewebId, meeting)).toEqual(expect.objectContaining({
      id: anonuser.id,
    }));
  });

  it('gets qualified users', async () => {
    const meeting = await generateMeeting();
    const user1 = await generateUser({
      meeting,
      canVote: true,
      permissions: CAN_VOTE,
    });
    const user2 = await generateUser({
      meeting,
      canVote: false,
      permissions: CAN_VOTE,
    });

    const users = await getQualifiedUsers(meeting);

    expect(users).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: user1.id,
      }),
    ]));
    expect(users).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: user2.id,
      }),
    ]));
  });
});
