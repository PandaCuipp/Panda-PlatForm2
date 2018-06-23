import { fakeChartData, getBrinsonData, getStrategyInfo } from '../services/api';

export default {
  namespace: 'brinson',

  state: {
    brinsonData: {},
    strategyInfo: {},
  },

  effects: {
    *getBrinson({ payload }, { call, put }) {
      const response = yield call(getBrinsonData, payload);
      console.log("payload");
      console.log(payload);
      console.log("response");
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          brinsonData: response,
        },
      });
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
    //获取策略
    *getStrategyInfo(payload, { call, put }) {
      const response = yield call(getStrategyInfo, payload);
      yield put({
        type: 'save',
        payload: {
          strategyInfo: response,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        brinsonData: {},
        strategyInfo: {},
      };
    },
  },
};
