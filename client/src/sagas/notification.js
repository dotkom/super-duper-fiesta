import { call, takeLatest, select } from 'redux-saga/effects';
import { OPEN_ISSUE } from '../../../common/actionTypes/issues';
import { TOGGLE_NOTIFICATION } from '../../../common/actionTypes/userSettings';
import { notify, notifyPermission } from '../utils/notification';
import { notificationIsEnabled } from '../selectors/userSettings';

function* openIssue(action) {
  const { description } = action.data;
  const notificationEnabled = yield select(notificationIsEnabled);
  if (notificationEnabled) {
    yield call(notify, description);
  }
}

function* toggleNotification() {
  const notificationEnabled = yield select(notificationIsEnabled);
  if (notificationEnabled) {
    yield call(notifyPermission);
  }
}

export default function* issueSaga() {
  yield takeLatest(OPEN_ISSUE, openIssue);
  yield takeLatest(TOGGLE_NOTIFICATION, toggleNotification);
}
