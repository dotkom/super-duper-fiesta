import React from 'react';
import Button from './Button';
import '../css/IssueForm.css';

const IssueForm = () => (
  <div className="IssueForm">
    <form>
      <label className="IssueForm-textarea">
        <div className="IssueForm-label">Beskrivelse</div>
        <textarea />
        <p>Beskrivelse av saken</p>
      </label>
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
        <select>
          <option>Alminnelig flertall (1/2)</option>
          <option>Kvalifisert flertall (2/3)</option>
        </select>
      </label>
      <label className="IssueForm-select">
        <div className="IssueForm-label">Spørsmålstype</div>
        <select>
          <option>Ja/Nei</option>
          <option>Flervalg</option>
        </select>
      </label>
    </form>
    <Button>Lagre sak</Button>
  </div>
);

export default IssueForm;
