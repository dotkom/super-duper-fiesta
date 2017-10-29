import { all } from 'redux-saga/effects';

import issue from './issue';

export default function* rootSaga() {
  yield all([issue()]);
}
