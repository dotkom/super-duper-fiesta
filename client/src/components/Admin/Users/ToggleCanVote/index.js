import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { CAN_VOTE } from 'common/auth/permissions';
import { adminSetPermissions } from 'features/user/actionCreators';
import Button from '../../../Button';
import Dialog from '../../../Dialog';
import css from './ToggleCanVote.css';

class ToggleCanVote extends React.Component {
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
    const { id, canVote, permissions, toggleCanVote } = this.props;

    const successToggle = classNames(
      css.success,
      { [css.toggle]: canVote },
    );

    const closeToggle = classNames(
      css.close,
      { [css.toggle]: !canVote },
    );

    return (
      <Fragment>
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
      </Fragment>
    );
  }
}

ToggleCanVote.propTypes = {
  canVote: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  permissions: PropTypes.number.isRequired,
  setPermissions: PropTypes.func.isRequired,
  toggleCanVote: PropTypes.func.isRequired,
};

const mapDispatchToProps = ({
  setPermissions: adminSetPermissions,
});

export default ToggleCanVote;
export const ToggleCanVoteContainer = connect(
  null,
  mapDispatchToProps,
)(ToggleCanVote);
