const {
  addIssue, deleteIssue, endIssue, getActiveQuestion, getConcludedIssues,
  getIssueById, updateIssue,
} = require('../issue.accessors');
const { getActiveGenfors } = require('../meeting.accessors');

const { generateIssue, generateMeeting } = require('../../utils/integrationTestUtils');

describe('issue', () => {
  afterEach(async () => {
    // Invalidate test data
    const meeting = await getActiveGenfors();
    let activeIssue = await getActiveQuestion(meeting.id);
    while (activeIssue !== null && activeIssue !== undefined) {
      await deleteIssue(activeIssue.id);
      activeIssue = await getActiveQuestion(meeting.id);
    }
  });

  it.skip("doesn't create issue if invalid", async () => {
    const issue = addIssue();

    await expect(issue).rejects.toEqual(new Error('Question validation failed: voteDemand: Path `voteDemand` is required., description: Path `description` is required., genfors: Path `genfors` is required.'));
  });

  it('creates an issue', async () => {
    const issue = await generateIssue();

    expect(issue).toEqual(expect.objectContaining({
      description: 'question',
    }));
  });

  it('gets an issue by id', async () => {
    const issue = await generateIssue();

    expect(await getIssueById(issue.id)).toEqual(
      expect.objectContaining({ id: issue.id }));
  });

  it('gets active issue', async () => {
    const meeting = await generateMeeting();
    const activeIssue = await generateIssue({ meetingId: meeting.id, active: true });
    await generateIssue({ meetingId: meeting.id, active: false });

    expect(await getActiveQuestion(meeting.id)).toEqual(
      expect.objectContaining({
        id: activeIssue.id,
      }),
    );
  });

  it('gets concluded issues', async () => {
    const meeting = await generateMeeting();
    const concluded = await generateIssue({ genfors: meeting, active: false });
    await generateIssue({ genfors: meeting, active: true });

    const concludedIssues = await getConcludedIssues(meeting);

    expect(concludedIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: concluded.description,
        }),
      ]));
  });

  it('ends and issue', async () => {
    const issue = await generateIssue({ active: true });

    await endIssue(issue);

    const endedIssue = await getIssueById(issue.id);

    expect(endedIssue).toEqual(expect.objectContaining({
      id: issue.id,
      active: false,
    }));
  });

  // @ToDo: TEST Delete issue by ID and by object
  it('deletes an issue', async () => {
    const issue = await generateIssue({ deleted: false });

    await deleteIssue(issue);

    const deletedIssue = await getIssueById(issue.id);

    expect(deletedIssue).toEqual(expect.objectContaining({
      id: issue.id,
      deleted: true,
    }));
  });

  it('updates an issue', async () => {
    const issue = await generateIssue({ deleted: false });

    await updateIssue({ id: issue.id }, { description: 'updated' });

    const updatedIssue = await getIssueById(issue.id);

    expect(updatedIssue).toEqual(expect.objectContaining({
      id: issue.id,
      description: 'updated',
    }));
  });
});
