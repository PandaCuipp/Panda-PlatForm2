import { getAllFactorInfoList,factorInfoAdd } from '../services/api';

export default {
  namespace: 'factor_model',

  state: {
    factorData:[],
    addFactorInfo:{},
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
    *delete({payload},{call,put}){
      yield put({
        type:'save',
        payload:{
          factorData:state.factorData.filter(item => item.factorid !== payload.factorid),
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
          addFactorInfo:response,
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
    clear() {
      return {
        factorData:[],
        addFactorInfo:{},
      };
    },
  },
};
