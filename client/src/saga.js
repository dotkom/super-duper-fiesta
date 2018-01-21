import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import userSettings from './components/UserSettings/sagas';

function* rootSaga() {
  yield all([userSettings()]);
}

export const sagaMiddleware = createSagaMiddleware();

export function runSaga() {
  sagaMiddleware.run(rootSaga);
}
