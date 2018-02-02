const { getActiveGenfors, getGenfors, updateGenfors } = require('../meeting');

const { generateMeeting } = require('../../utils/integrationTestUtils');


describe('meeting', () => {
  afterEach(async () => {
    // Sneaky way to make sure to not break "getActiveMeeting".
    // We close all active meetings during testing.
    let genfors = await getActiveGenfors();
    while (genfors !== null) {
      // eslint-disable-next-line no-await-in-loop
      await updateGenfors(genfors.id, { status: 'closed' });
      // eslint-disable-next-line no-await-in-loop
      genfors = await getActiveGenfors();
    }
  });

  it('creates a meeting', async () => {
    const genfors = await generateMeeting({ title: 'meeting' });

    expect(genfors).toEqual(expect.objectContaining({
      title: 'meeting',
    }));
  });

  it('gets a meeting by id', async () => {
    const { id: meetingId } = await generateMeeting();
    const meeting = await getGenfors(meetingId);

    expect(meeting).toEqual(expect.objectContaining({
      id: meetingId,
    }));
  });

  it('updates a meeting', async () => {
    const meeting = await generateMeeting();

    const updatedMeeting = await updateGenfors({ id: meeting.id }, {
      title: 'new title',
    }, { new: true });

    expect(updatedMeeting).toEqual(expect.objectContaining({
      id: meeting.id,
      title: 'new title',
    }));
  });

  it('gets active genfors', async () => {
    const meeting1 = await generateMeeting();

    await updateGenfors({ id: meeting1.id }, { status: 'open' });

    const activeMeeting = await getActiveGenfors();

    expect(activeMeeting.id).toEqual(meeting1.id);
  });
});
