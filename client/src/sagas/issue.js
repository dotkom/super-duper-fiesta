import { call, takeLatest } from 'redux-saga/effects';
import { OPEN_ISSUE } from '../../../common/actionTypes/issues';
import { notify } from '../utils/notification';

function* openIssue(action) {
  const { description } = action.data;
  yield call(notify, description);
}

export default function* issueSaga() {
  yield takeLatest(OPEN_ISSUE, openIssue);
}
