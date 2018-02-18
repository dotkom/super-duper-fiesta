import React from 'react';
import PropTypes from 'prop-types';
import { CAN_VOTE, getPermissionDisplay } from 'common/auth/permissions';
import Card from '../Card';
import IconText from '../IconText';
import css from './Permissions.css';


function Permissions({ canVote, permissions }) {
  const shouldBeAbleToVote = permissions >= CAN_VOTE;
  return (
    <Card
      classes={css.card}
      title="Rettigheter"
      corner={shouldBeAbleToVote && !canVote && <IconText iconClass={css.canNotVote} />}
    >
      <div>Rettighetsnivå: {getPermissionDisplay(permissions)}</div>
      {shouldBeAbleToVote &&
        <div>Stemmeberettiget: {canVote ?
          'Ja' :
          <span title="Kontakt tellekorpset for å bli stemmeberettiget.">Nei</span>
        }
        </div>
      }
    </Card>
  );
}

Permissions.defaultProps = {
  canVote: false,
  permissions: 0,
};

Permissions.propTypes = {
  canVote: PropTypes.bool,
  permissions: PropTypes.number,
};

export default Permissions;
