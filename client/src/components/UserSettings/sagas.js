import { call, takeLatest, select } from 'redux-saga/effects';
import { TOGGLE_NOTIFICATION } from 'common/actionTypes/userSettings';
import { ENABLE_VOTING } from 'common/actionTypes/voting';
import { notify, notifyPermission } from '../../utils/notification';
import { getIssueText } from '../../selectors/issues';
import { notificationIsEnabled } from '../../selectors/userSettings';

function* openIssue() {
  const notificationEnabled = yield select(notificationIsEnabled);
  const { description } = yield select(getIssueText);
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
  yield takeLatest(ENABLE_VOTING, openIssue);
  yield takeLatest(TOGGLE_NOTIFICATION, toggleNotification);
}
