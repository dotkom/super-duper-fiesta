import { connect } from 'react-redux';
import Alternatives from '../Alternatives';
import { getAlternatives } from '../../features/alternative/selectors';

const mapStateToProps = state => ({
  alternatives: getAlternatives(state),
});

export default connect(
  mapStateToProps,
)(Alternatives);
