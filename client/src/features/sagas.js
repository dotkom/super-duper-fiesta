import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import auth from './auth/sagas';
import userSettings from './userSettings/sagas';

function* rootSaga() {
  yield all([auth(), userSettings()]);
}

export const sagaMiddleware = createSagaMiddleware();

export function runSaga() {
  sagaMiddleware.run(rootSaga);
}
