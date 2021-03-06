import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

import { getFakeBrinson } from './mock/brinson';
import { factorData,upload } from './mock/factor';

// 是否禁用代理
//const noProxy = process.env.NO_PROXY === 'true';
const noProxy = true;

const server1 = 'http://192.168.250.12:30000';
const server2 = 'https://quant-dev.phfund.com.cn';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  //=============================正式项目======================================== 
  
  'GET /api2/quant-policymanager/strategy-simple': getFakeBrinson.strategyInfo,

  //来源于service/api.js
  'GET /api1/performance/brinson': getFakeBrinson.brinsonData,

  'GET /api1/performance/factor_attr':getFakeBrinson.barraData,

  ///api1/performance/risk_attr
  'GET /api1/performance/risk_attr':getFakeBrinson.barraAnalysisData,

  'GET /api2/quant-policymanager/factor':factorData,

  //add
  'POST /api2/quant-policymanager/factor':(req, res) => {
    res.send({
        factorid:'ad83ieka0d321d9vdq3d03ld31ecw039',
        authorcode:'Panda',
        type:'marketvalue',
        scope:'person',
        factorname:'just_time_add',
        factorcode:'adfirst',
        describe:'刚刚新增的因子',
        filepath:'',
        uploaddate:1529498409888,
      });
      return;
  },

  //update
  'PUT /api2/quant-policymanager/factor':(req, res) => {
    res.send({
        factorid:'ad83ieka0d321d9vdq3d03ld31ecw040',
        authorcode:'Panda',
        type:'marketvalue',
        scope:'person',
        factorname:'just_time_add',
        factorcode:'adfirst',
        describe:'刚刚修改的因子',
        filepath:'',
        uploaddate:1529498409888,
      });
      return;
  },
  'DELETE /api2/quant-policymanager/factor':(req, res) => {
    res.send({
        factorid:'ad83ieka0d321d9vdq3d03ld31ecw040',
        authorcode:'Panda',
        type:'marketvalue',
        scope:'person',
        factorname:'just_time_add',
        factorcode:'adfirst',
        describe:'刚刚删除的因子',
        filepath:'',
        uploaddate:1529498409888,
      });
      return;
  },

  //upload
  // 'POST /api2/quant-policymanager/factorfile':(req, res) => {
  //   res.send('c:/alin/test.pyc');
  //   return;
  // },
  'POST /api2/quant-policymanager/factorfile':upload.filepath,


  //=====================以下是模板用例==================================
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

export default (noProxy
  ? {
      'POST /api1/(.*)': server1,
      'GET /api1/(.*)': server1,
      'POST /api2/(.*)': server2,
      'GET /api2/(.*)': server2,
    }
  : delay(proxy, 1000));
