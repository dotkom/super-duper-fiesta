import React from 'react';
import Button from './Button';
import '../css/IssueForm.css';
import SelectResolutionTypeContainer from '../containers/SelectResolutionTypeContainer';
import SelectQuestionTypeContainer from '../containers/SelectQuestionTypeContainer';
import AddIssueFormAlternative from '../containers/AddIssueFormAlternative';
import IssueFormSettings from '../containers/IssueFormSettings';

const IssueForm = () => (
  <div className="IssueForm">
    <label className="IssueForm-textarea">
      <div className="IssueForm-label">Beskrivelse</div>
      <textarea />
      <p>Beskrivelse av saken</p>
    </label>
    <AddIssueFormAlternative />
    <div className="IssueForm-label">Innstillinger</div>
    <IssueFormSettings />
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
