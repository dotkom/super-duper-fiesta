const databaseSetup = require('../essentials');
const { getActiveGenfors, getGenfors, updateGenfors } = require('../meeting');

const { generateMeeting } = require('../../utils/integrationTestUtils');


describe('meeting', () => {
  beforeAll(async () => {
    await databaseSetup();
  });

  afterEach(async () => {
    let meeting = await getActiveGenfors();
    while (meeting !== null) {
      updateGenfors({ _id: meeting._id }, { status: 'closed' });
      meeting = await getActiveGenfors();
    }
  });

  it('creates a meeting', async () => {
    const genfors = await generateMeeting({ title: 'meeting' });

    expect(genfors).toEqual(expect.objectContaining({
      title: 'meeting',
    }));
  });

  it('gets a meeting by id', async () => {
    const { _id: meetingId } = await generateMeeting();
    const meeting = await getGenfors(meetingId);

    expect(meeting).toEqual(expect.objectContaining({
      _id: meetingId,
    }));
  });

  it('updates a meeting', async () => {
    const meeting = await generateMeeting();

    const updatedMeeting = await updateGenfors({ _id: meeting._id }, {
      title: 'new title',
    }, { new: true });

    expect(updatedMeeting).toEqual(expect.objectContaining({
      _id: meeting._id,
      title: 'new title',
    }));
  });

  it('gets active genfors', async () => {
    const meeting1 = await generateMeeting();

    await updateGenfors({ _id: meeting1._id }, { status: 'open' });

    const activeMeeting = await getActiveGenfors();

    expect(activeMeeting._id).toEqual(meeting1._id);
  });
});
