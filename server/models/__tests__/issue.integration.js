const {
  addIssue, deleteIssue, endIssue, getActiveQuestion, getConcludedIssues,
  getIssueById, updateIssue,
} = require('../issue');

const { generateIssue, generateMeeting } = require('../../utils/integrationTestUtils');

describe('issue', () => {
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

  it.skip('gets an issue by id', async () => {
    const issue = await generateIssue();

    expect(await getIssueById(issue._id)).toEqual(
      expect.objectContaining({ _id: issue._id }));
  });

  it.skip('gets active issue', async () => {
    const meeting = await generateMeeting();
    const activeIssue = await generateIssue({ genfors: meeting, active: true });
    await generateIssue({ genfors: meeting, active: false });

    expect(await getActiveQuestion(meeting._id)).toEqual(
      expect.objectContaining({
        _id: activeIssue._id,
      }),
    );
  });

  it.skip('gets concluded issues', async () => {
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

  it.skip('ends and issue', async () => {
    const issue = await generateIssue({ active: true });

    await endIssue(issue);

    const endedIssue = await getIssueById(issue._id);

    expect(endedIssue).toEqual(expect.objectContaining({
      _id: issue._id,
      active: false,
    }));
  });

  it.skip('deletes an issue', async () => {
    const issue = await generateIssue({ deleted: false });

    await deleteIssue(issue);

    const deletedIssue = await getIssueById(issue._id);

    expect(deletedIssue).toEqual(expect.objectContaining({
      _id: issue._id,
      deleted: true,
    }));
  });

  it.skip('updates an issue', async () => {
    const issue = await generateIssue({ deleted: false });

    await updateIssue({ _id: issue._id }, { description: 'updated' });

    const updatedIssue = await getIssueById(issue._id);

    expect(updatedIssue).toEqual(expect.objectContaining({
      _id: issue._id,
      description: 'updated',
    }));
  });
});
