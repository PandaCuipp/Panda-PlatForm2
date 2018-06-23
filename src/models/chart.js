import { fakeChartData } from '../services/api';

export default {
  namespace: 'chart',

  state: {
    visitData: [],
    visitData2: [],
    salesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    loading: false,
    indexData: [],
    columnsData: [],
    exContribution: [],
    configData: [],
    stockcrossData: [],
    dataData: [],
    strategyInfo: {},
    barraData: {},
    barraAnalysisData: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: response,
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
    *getStrategyInfo(_, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          strategyInfo: {
            strategy_id: 'S0000000000000000000000000000382',
            strategy_code: 'S0000162',
            strategy_name: 'PE选股策略',
            strategy_version: '1.1.1',
          },
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
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
        loading: false,
        indexData: [],
        columnsData: [],
        exContribution: [],
        configData: [],
        stockcrossData: [],
        dataData: [],
        strategyInfo: {},
        barraData: {},
        barraAnalysisData: {},
      };
    },
  },
};
