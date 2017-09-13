import React from 'react';
import DocumentTitle from 'react-document-title';

import { UserListContainer } from './List';
import { UserFilterContainer } from './Filter';
import css from './index.css';

const Users = () => (
  <DocumentTitle title="Brukeradmin">
    <div className={css.users}>
      <div className={css.info}>
        <p>Denne oversikten viser alle brukere som er registrert som møtt
        på generalforsamlingen. I tillegg vises deres status som deltaker,
        nærmere bestemt om de har stemmerett eller ikke.
        Klikk på «Kan stemme» knappen for en person for å endre status.
        Denne statusen skal brukes dersom en person forlater salen
        for å gå på toalettet under et spørsmål, eller om personen
        forlater generalforsamlingen for godt.
        </p>

        <p>
          <b>NB</b>: Man må ikke endre status på personer
          dersom det er en aktiv pågående sak/avstemning.
          Dette vil påvirke resultatkalkuleringen og gjøre resultatet ugyldig.
        </p>
      </div>

      <UserFilterContainer />
      <UserListContainer />
    </div>
  </DocumentTitle>
);

export default Users;
