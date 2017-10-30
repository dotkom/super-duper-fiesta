import { all } from 'redux-saga/effects';

import notification from './notification';

export default function* rootSaga() {
  yield all([notification()]);
}
