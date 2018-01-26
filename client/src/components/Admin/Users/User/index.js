import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { CAN_VOTE, getPermissionDisplay } from 'common/auth/permissions';
import { adminSetPermissions } from 'features/user/actionCreators';
import Button from '../../../Button';
import Dialog from '../../../Dialog';
import css from './User.css';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToggleCanVoteWarning: false,
    };
  }

  canVoteHandler(id, toggleTo) {
    this.setState({ showToggleCanVoteWarning: false });
    this.props.setPermissions(id, toggleTo, CAN_VOTE);
  }

  render() {
    const { id, name, registered, canVote, completedRegistration, permissions, toggleCanVote,
    } = this.props;
    const userClass = classNames({
      [css.canNotVote]: !canVote,
    });
    const registeredDate = moment(registered);
    const successToggle = classNames(
      css.success,
      { [css.toggle]: canVote },
    );
    const closeToggle = classNames(
      css.close,
      { [css.toggle]: !canVote },
    );
    const permissionLevel = getPermissionDisplay(permissions);
    return (
      <tr className={userClass}>
        <td className={css.left}>{name}</td>
        <td
          className={css.right}
          title={`${registeredDate.format('LLL')} (${registeredDate.fromNow()})`}
        >
          <div
            className={classNames(css.action,
              { [css.success]: completedRegistration,
                [css.close]: !completedRegistration,
                [css.toggle]: completedRegistration,
              },
          )}
          >{completedRegistration}</div>
        </td>
        <td className={css.right}>
          {permissionLevel}
        </td>
        <td className={css.right}>
          <Dialog
            title="Gi stemmerett"
            subtitle={'Denne personen er ikke medlem av Online. Ønsker du å ' +
            'gi dem stemmerett?'}
            visible={this.state.showToggleCanVoteWarning}
            onClose={() => this.setState({ showToggleCanVoteWarning: false })}
          >
            <p>Dette kan bare gjøres dersom generalforsamlingen vedtar det.</p>
            <Button
              background
              onClick={() => this.canVoteHandler(id, true)}
            >Bekreft</Button>
            <Button
              background
              onClick={() => this.setState({ showToggleCanVoteWarning: false })}
            >Avbryt</Button>
          </Dialog>
          <button
            className={css.action}
            onClick={() => (permissions >= CAN_VOTE
              ? toggleCanVote(id, true)
              : this.setState({ showToggleCanVoteWarning: true }))}
          >
            <div
              className={permissions >= CAN_VOTE ? successToggle : css.unavailable}
              title={permissions >= CAN_VOTE
                ? 'Gi brukeren stemmerett'
                : 'Brukeren har ikke rett til å få stemmerett.'}
            />
          </button>
          <button
            className={css.action}
            onClick={() => toggleCanVote(id, false)}
          >
            <div className={closeToggle} title="Fjern brukerens stemmerett" />
          </button>
        </td>
      </tr>
    );
  }
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  canVote: PropTypes.bool.isRequired,
  completedRegistration: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  permissions: PropTypes.number.isRequired,
  registered: PropTypes.string.isRequired,
  setPermissions: PropTypes.func.isRequired,
  toggleCanVote: PropTypes.func.isRequired,
};

const mapDispatchToProps = ({
  setPermissions: adminSetPermissions,
});

export default User;
export const UserContainer = connect(
  null,
  mapDispatchToProps,
)(User);
