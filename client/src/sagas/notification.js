import { call, takeLatest, put, select } from 'redux-saga/effects';
import { OPEN_ISSUE } from '../../../common/actionTypes/issues';
import { TOGGLE_NOTIFICATION } from '../../../common/actionTypes/notification';
import { notify, notifyPermission } from '../utils/notification';
import { toggleNotification as toggleNotificationAction } from '../actionCreators/notification';

function* openIssue(action) {
  const { description } = action.data;
  yield put(toggleNotificationAction());
  yield call(notify, description);
}

function* toggleNotification() {
  yield call(notifyPermission);
}

export default function* issueSaga() {
  yield takeLatest(OPEN_ISSUE, openIssue);
  yield takeLatest(TOGGLE_NOTIFICATION, toggleNotification);
}
