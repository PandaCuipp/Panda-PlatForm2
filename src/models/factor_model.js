import { getAllFactorInfoList,factorInfoAdd,factorInfoUpdate,factorInfoDelete } from '../services/api';
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
export default {
  namespace: 'factor_model',

  state: {
    factorData:[],
    currentFactorInfo:{},
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
      yield put({
        type:'save',
        payload:{
          currentFactorInfo:response,
        },
      });
    },
    *update({payload},{call,put}){
      var response = {};
      if(noProxy){
        response = yield call(factorInfoUpdate,payload);
      }else{
        response = payload;
      }
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
      var response = {};
      if(noProxy){
        response = yield call(factorInfoDelete,payload);
      }else{
        response = {
            factorid:'ad83ieka0d321d9vdq3d03ld31ecw040',
            authorcode:'Panda',
            type:'marketvalue',
            scope:'person',
            factorname:'just_time_add',
            factorcode:'adfirst',
            describe:'刚刚删除的因子',
            filepath:'',
            uploaddate:1529498409888,
          };
      }
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
      };
    },
  },
};
