import { stringify } from 'qs';
import request from '../utils/request';


//========================请求Brinson模块数据=============================

//获取策略详情
export async function getStrategyInfo(params) {
  return request(`/api2/quant-policymanager/strategy-simple?${stringify(params)}`);
}

//获取Brinson归因明细
export async function getBrinsonData(params) {
  console.log("api-getBrinsonData");
  console.log(params);
  return request(`/api1/performance/brinson?${stringify(params)}`);
}

//Barra多因子归因明细数据
export async function getBarraData(params){
  return request(`/api1/performance/factor_attr?${stringify(params)}`);
}

//getBarraAnalysisData
export async function getBarraAnalysisData(params){
  return request(`/api1/performance/risk_attr?${stringify(params)}`);
}

//=====================单因子管理==================================

//查询所有因子信息列表
export async function getAllFactorInfoList(){
  return request('/api2/quant-policymanager/factor');
}

//factorInfoAdd
export async function factorInfoAdd(params){
  if(!params){
    console.error("add factor params undefined:"+ params);
    return {};
  }
  return request('/api2/quant-policymanager/factor', {
    method: 'POST',
    body: {
      ...params,
      //method: 'post',
    },
  });
}

//factorInfoUpdate
export async function factorInfoUpdate(params){
  if(!params || !params.factorid){
    console.error("update factorid is undefined:"+ params);
    return {};
  }
  return request('/api2/quant-policymanager/factor/'+ params.factorid, {
    method: 'PUT',
    body: {
      ...params,
      //method: 'put',
    },
  });
}

//factorInfoUpdate
export async function factorInfoDelete(id){
  if(!factorid){
    console.error("delete factorid is undefined:"+ id);
    return {};
  }
  return request('/api2/quant-policymanager/factor/'+ id, {
    method: 'DELETE',
    body: {
      id,
      //method: 'put',
    },
  });
}


//=====================以下是模板用例=========================

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  console.log("fakeAccountLogin:params");
  console.log(params);
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}


