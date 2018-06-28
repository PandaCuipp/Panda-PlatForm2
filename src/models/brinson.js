import { getBrinsonData, getStrategyInfo,getBarraData,getBarraAnalysisData } from '../services/api';

export default {
  namespace: 'brinson',
  state: {
    brinsonData: {},
    strategyInfo: {},
    barraData:{},
    barraAnalysisData:{},
    urlParamStr:'',
  },

  effects: {
    //获取brinson数据明细
    *getBrinson({ payload }, { call, put }) {
      const response = yield call(getBrinsonData, payload);
      
      yield put({
        type: 'save',
        payload: {
          brinsonData: response,
        },
      });
    },
    //获取barra明细
    *getBarraData({ payload }, { call, put }) {
      const response = yield call(getBarraData, payload);
      yield put({
        type: 'save',
        payload: {
          barraData: response,
        },
      });
    },
    //getBarraAnalysisData
    *getBarraAnalysisData({ payload }, { call, put }) {
      const response = yield call(getBarraAnalysisData, payload);
      yield put({
        type: 'save',
        payload: {
          barraAnalysisData: response,
        },
      });
    },
    //获取策略
    *getStrategyInfo({payload}, { call, put }) {
      const response = yield call(getStrategyInfo, payload);
      yield put({
        type: 'save',
        payload: {
          strategyInfo: response,
        },
      });
    },
    //获取策略
    *getUrlParamStr({payload}, { call, put }) {
      var query = window.location.href;
      let response = '';
      if(query.indexOf("?") < 0){
        response = query.split("?")[1];
      }
      yield put({
        type: 'saveUrlParamStr',
        payload: {
          urlParamStr: response,
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
    saveUrlParamStr(state,{payload}){
      if(payload.urlParamStr == ''){
        return {...state};
      }else{
        return {
        ...state,
        ...payload,
      };
      }
    },
    clear() {
      return {
        brinsonData: {},
        strategyInfo: {},
        barraData:{},
        barraAnalysisData:{},
      };
    },
  },
};
