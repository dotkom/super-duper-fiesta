import React from 'react';
import Dialog from './Dialog';
import css from './NewVersionAvailable.css';

const NewVersionAvailable = ({ newVersionAvailable }) => (
  <Dialog
    onClose={() => { window.location.href = '.'; }}
    title="En ny versjon av applikasjonen er tilgjengelig"
    visible={newVersionAvailable}
  >
    <p>
      <a href="." className={css.reloadPageLink}>
        Klikk her for å laste inn siden på nytt.
      </a>
    </p>
  </Dialog>
);

NewVersionAvailable.propTypes = {
  newVersionAvailable: React.PropTypes.bool.isRequired,
};

export default NewVersionAvailable;