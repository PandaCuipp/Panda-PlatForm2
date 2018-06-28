import { getBrinsonData, getStrategyInfo,getBarraData,getBarraAnalysisData } from '../services/api';
var common = require('../utils/common');

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
      
      // var query = window.location.href;
      // let param = '';
      // if(query.indexOf("?") >= 0){
      //   param = query.split("?")[1];
      //   yield put({
      //     type: 'save',
      //     payload: {
      //       strategyInfo: response,
      //       urlParamStr:param,
      //     },
      //   });
      // }else{
      //   yield put({
      //     type: 'save',
      //     payload: {
      //       strategyInfo: response,
      //     },
      //   });
      // }
    },
    //从链接中截取问号后的{链接参数}放入urlParamStr中缓存，链接中不存在{链接入参}时返回缓存的{链接入参}
    *getUrlParamStr({payload}, { call, put }) {
      var query = window.location.href;
      let response = '';
      if(query.indexOf("?") >= 0){
        response = query.split("?")[1];
        if(payload && payload.index_code){
          response = common.setQueryVariable(response,"index_code",payload.index_code);
        }
      }
      //console.log("进入getUrlParamStr:");
      //console.log(payload);
      //console.log(response);
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
      //console.log("进入saveUrlParamStr:");
      //console.log(payload);
      if(payload.urlParamStr == ''){
        return {...state,...{_:new Date()}};
      }else{
        //console.log("保存UrlParamStr:"+payload.urlParamStr);
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
