import Cookies from 'js-cookie';
import { call, takeLatest, put } from 'redux-saga/effects';
import { REQUEST_PASSWORD_HASH, SEND_PASSWORD_HASH } from 'common/actionTypes/auth';

function* requestPasswordHash() {
  const passwordHash = yield call(Cookies.get, 'passwordHash');
  yield put({
    type: SEND_PASSWORD_HASH,
    passwordHash,
  });
}

export default function* authSaga() {
  yield takeLatest(REQUEST_PASSWORD_HASH, requestPasswordHash);
}
