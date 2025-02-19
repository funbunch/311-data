/* eslint-disable */

import axios from 'axios';
import {
  takeLatest,
  takeEvery,
  call,
  put,
  select,
} from 'redux-saga/effects';
import { COUNCILS, REQUEST_TYPES } from '@components/common/CONSTANTS';

import {
  types,
  getDataRequest,
  getPinsSuccess,
  getPinsFailure,
  getPinInfoSuccess,
  getPinInfoFailure,
  getNcByLngLatSuccess,
  getNcByLngLatFailure,
} from '../reducers/data';

import {
  types as uiTypes,
  setErrorModal,
  showDataCharts,
} from '../reducers/ui';

import {
  types as mapFiltersTypes,
} from '../reducers/mapFilters';

/* ////////////////// API CALLS  //////////////// */

const BASE_URL = process.env.API_URL;

/* ////  MAP //// */

function* fetchPins(filters) {
  const pinsUrl = `${BASE_URL}/map/pins`;

  const { data } = yield call(axios.post, pinsUrl, filters);

  return data;
}

function* fetchPinInfo(srnumber) {
  const pinInfoUrl = `${BASE_URL}/requests/${srnumber}`;

  const { data } = yield call(axios.get, pinInfoUrl);

  return data;
}

function* fetchNcByLngLat({ longitude, latitude }) {
  const geocodeUrl = `${BASE_URL}/geojson/geocode?latitude=${latitude}&longitude=${longitude}`;

  const { data } = yield call(axios.get, geocodeUrl);

  return data;
}

/* ////////////////// FILTERS //////////////// */

const getState = (state, slice) => state[slice];

function* getFilters() {
  const {
    startDate,
    endDate,
    councils,
    requestTypes,
  } = yield select(getState, 'filters');

  const convertCouncilNameToID = ncList => (
    ncList.map(name => COUNCILS.find(nc => nc.name === name)?.id)
  );

  return {
    startDate,
    endDate,
    ncList: convertCouncilNameToID(councils),
    requestTypes: Object.keys(requestTypes).filter(req => req !== 'All' && requestTypes[req]),
  };
}

function* getMapFilters() {
  const {
    startDate,
    endDate,
    councils,
    requestTypes,
  } = yield select(getState, 'mapFilters');

  const convertCouncilNameToID = ncList => (
    ncList.map(name => COUNCILS.find(nc => nc.name === name)?.id)
  );

  return {
    startDate,
    endDate,
    ncList: convertCouncilNameToID(councils),
    requestTypes: Object.keys(requestTypes).filter(req => req !== 'All' && requestTypes[req]),
  };
}

/* /////////////////// SAGAS ///////////////// */

function* getMapData() {
  const filters = yield getFilters();
  // const mapPosition = yield getMapPosition();

  if (filters.ncList.length === 0 || filters.requestTypes.length === 0) {
    yield put(getPinsSuccess([]));
    return;
  }

  try {
    const pinsData = yield call(fetchPins, filters);
    yield put(getPinsSuccess(pinsData));
  } catch (e) {
    yield put(getPinsFailure(e));
    yield put(setErrorModal(true));
    return;
  }
}

function* getPinData(action) {
  try {
    const srnumber = action.payload;
    const data = yield call(fetchPinInfo, srnumber);
    yield put(getPinInfoSuccess(data));
  } catch (e) {
    yield put(getPinInfoFailure(e));
    yield put(setErrorModal(true));
  }
}

function* getNcByLngLat(action) {
  try {
    const data = yield call(fetchNcByLngLat, action.payload)
    yield put(getNcByLngLatSuccess(data));
  } catch (e) {
    yield put(getNcByLngLatFailure(e));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_DATA_REQUEST, getMapData);
  yield takeLatest(mapFiltersTypes.UPDATE_MAP_DATE_RANGE, getMapData);
  yield takeLatest(types.GET_NC_BY_LNG_LAT, getNcByLngLat)
  yield takeEvery(types.GET_PIN_INFO_REQUEST, getPinData);
}
