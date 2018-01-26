import { connect } from 'react-redux';
import { getAlternatives } from 'features/alternative/selectors';
import Alternatives from '../Alternatives';

const mapStateToProps = state => ({
  alternatives: getAlternatives(state),
});

export default connect(
  mapStateToProps,
)(Alternatives);
