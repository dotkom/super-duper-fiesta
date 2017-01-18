import React from 'react';
import User from './User';
import '../css/Users.css';

const Users = () => (
  <div className="Users">
    <div className="Users-info">
      <p>Denne oversikten viser alle brukere som er registrert som møtt på generalforsamlingen.
      I tillegg vises deres status som deltaker, nærmere bestemt om de har stemmerett eller ikke.
      Klikk på «Kan stemme» knappen for en person for å endre status.
      Denne statusen skal brukes dersom en person forlater salen
      for å gå på toalettet under et spørsmål, eller om personen
      forlater generalforsamlingen for godt.
      </p>

      <p>
        <b>NB</b>: man må ikke endre status på personer
        dersom det er en aktiv pågående sak/avstemning.
        Dette vil påvirke resultatkalkuleringen og gjøre resultatet ugyldig.
      </p>
    </div>
    <table className="Users-list">
      <thead>
        <tr>
          <th className="Users-list--left">Bruker</th>
          <th className="Users-list--right">Registrert</th>
        </tr>
      </thead>
      <tbody>
        <User name="Ruth Lene Tennfjord" canVote />
        <User name="Werner Kennet Jakobsen" />
        <User name="Annbjørg Aslaug Toov" canVote />
        <User name="Ivar Jorun Eriksen" />
        <User name="Anne Bernhard Kristiansen" canVote />
        <User name="Henriette Britta Ruud" canVote />
        <User name="Julia Mark Nass" canVote />
        <User name="Anita Hilda Knutsen" />
        <User name="Abraham Viktor Landvik" />
        <User name="Henning Astrid Albertsen" canVote />
        <User name="Hugo Toril Adamsen" canVote />
      </tbody>
    </table>
  </div>
);

export default Users;
