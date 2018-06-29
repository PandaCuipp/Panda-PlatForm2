import { stringify } from 'qs';
import request from '../utils/request';

const server1 = 'http://192.168.250.12:30000';
const server2 = 'https://quant-dev.phfund.com.cn';

// 是否禁用代理
//const noProxy = process.env.NO_PROXY === 'true';
const noProxy = true;

//const api1 = '/api1';
//const api2 = '/api2';
const api1 = server1;
const api2 = server2;
//========================请求Brinson模块数据=============================

//获取策略详情
export async function getStrategyInfo(params) {
  //strategy_id
  let id = '/'+params.strategy_id;
  if(!noProxy){
    id='';
  }
  return request(api2+'/quant-policymanager/strategy-simple' + id);
}

//获取Brinson归因明细
export async function getBrinsonData(params) {
  return request(api1+`/performance/brinson?${stringify(params)}`);
}

//Barra多因子归因明细数据
export async function getBarraData(params){
  return request(api1+`/performance/factor_attr?${stringify(params)}`);
}

//getBarraAnalysisData
export async function getBarraAnalysisData(params){
  return request(api1+`/performance/risk_attr?${stringify(params)}`);
}

//=====================单因子管理==================================

//查询所有因子信息列表
export async function getAllFactorInfoList(){
  return request(api2+'/quant-policymanager/factor');
}

//factorInfoAdd
export async function factorInfoAdd(params){
  if(!params){
    console.error("add factor params undefined:"+ params);
    return {};
  }
  return request(api2+'/quant-policymanager/factor', {
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
  var id = '/'+ params.factorid;
  if(!noProxy){
    id='';
  }
  return request(api2+'/quant-policymanager/factor'+ id, {
    method: 'PUT',
    body: {
      ...params,
      //method: 'put',
    },
  });
}

//factorInfoUpdate
export async function factorInfoDelete(id){
  if(!id){
    console.error("delete factorid is undefined:"+ id);
    return {};
  }
  var deleteid = '/' + id.id;
  if(!noProxy){
    deleteid='';
  }
  return request(api2+'/quant-policymanager/factor'+ deleteid, {
    method: 'DELETE',
    body: {
      id,
      //method: 'put',
    },
  });
}

//factorInfoUpload
export async function factorInfoUpload(params){
  if(!params){
    console.error("add factor params undefined");
    return {};
  }
  return request(api2+'/quant-policymanager/factorfile', {
    method: 'POST',
    body: {
      ...params,
      //method: 'post',
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


