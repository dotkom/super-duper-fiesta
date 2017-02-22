import React from 'react';
import Button from './Button';
import '../css/IssueForm.css';
import SelectResolutionTypeContainer from '../containers/SelectResolutionTypeContainer';
import SelectQuestionTypeContainer from '../containers/SelectQuestionTypeContainer';
import AddIssueFormAlternative from '../containers/AddIssueFormAlternative';

const IssueForm = () => (
  <div className="IssueForm">
    <label className="IssueForm-textarea">
      <div className="IssueForm-label">Beskrivelse</div>
      <textarea />
      <p>Beskrivelse av saken</p>
    </label>
    <AddIssueFormAlternative />
    <div className="IssueForm-label">Innstillinger</div>
    <label className="IssueForm-checkbox">
      <input type="checkbox" />
      Hemmelig valg
    </label>
    <label className="IssueForm-checkbox">
      <input type="checkbox" />
      Vis kun vinner
    </label>
    <label className="IssueForm-checkbox">
      <input type="checkbox" />
      Tellende blanke stemmer
    </label>
    <label className="IssueForm-select">
      <div className="IssueForm-label">Flertallstype</div>
      <SelectResolutionTypeContainer />
    </label>
    <label className="IssueForm-select">
      <div className="IssueForm-label">Spørsmålstype</div>
      <SelectQuestionTypeContainer />
    </label>
    <Button>Lagre sak</Button>
  </div>
);

export default IssueForm;
