import { getAllFactorInfoList,factorInfoAdd,factorInfoUpdate,factorInfoDelete,factorInfoUpload } from '../services/api';
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
export default {
  namespace: 'factor_model',

  state: {
    factorData:[],
    currentFactorInfo:{},
    filepath:'',
  },

  effects: {
    //查询所有因子列表
    *fetch(_, { call, put }) {
      const response = yield call(getAllFactorInfoList);
      yield put({
        type: 'save',
        payload: {
          factorData:response,
        },
      });
    },
    *add({payload},{call,put}){
      const response = yield call(factorInfoAdd,payload);
      console.log("add factorInfo:");
      console.log(payload);
      console.log(response);
      yield put({
        type:'save',
        payload:{
          currentFactorInfo:response,
        },
      });
    },
    *update({payload},{call,put}){
      var response = yield call(factorInfoUpdate,payload);
      console.log("update factorInfo:");
      console.log(payload);
      console.log(response);
      yield put({
        type:'save',
        payload:{
          currentFactorInfo:response,
        },
      });
    },
    *delete({payload},{call,put}){
      var response = yield call(factorInfoDelete,payload);
      console.log("delete factorInfo:");
      console.log(payload);
      console.log(response);
      yield put({
        type:'save',
        payload:{
          currentFactorInfo:response,
          //factorData:state.factorData.filter(item => item.factorid !== payload.id),
        },
      });
    },
    //上传
    *upload({payload},{call,put}){
      var response = yield call(factorInfoUpload,payload);
      console.log("upload factor file:");
      console.log(payload);
      console.log(response);
      yield put({
        type:'save',
        payload:{
          filepath:response,
          //factorData:state.factorData.filter(item => item.factorid !== payload.id),
        },
      });
    },
    // effects end
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveDelete(state, { payload }) {
      console.log("saveDelete"); 
      console.log(state);
      console.log(payload);
      return state.factorData.filter(item => item.factorid !== payload.id);
    },
    clear() {
      return {
        factorData:[],
        currentFactorInfo:{},
        filepath:'',
      };
    },
  },
};
