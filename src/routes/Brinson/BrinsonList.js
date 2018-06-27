import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table, Button, Icon,Select } from 'antd';
import { NavigationBar } from './NavigationBar';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
require('echarts/lib/component/legendScroll');
import styles from './BrinsonList.less';

var $ = require('jquery');
//import exportExcel from '../../utils/exportExcel';
var exportExcel = require('../../utils/exportExcel');
var common = require('../../utils/common');

@connect(({ brinson, loading }) => ({
  brinson,
  loading: loading.effects['brinson/getBrinson'],
}))
export default class BrinsonList extends Component {
  state = {
    currentTabKey: '1',
    columns: [],
    tableData: [],
    columns2: [],
    tableData2: [],
    strategyInfo: {},
    index_code:'000300',
  };

  componentDidMount() {

    const strategy_id = common.getParamFromURLOrCookie('stg_id', true);
    const index_code = common.getParamFromURLOrCookie('init_scale', true);
    const begin_date = common.getParamFromURLOrCookie('startdate', true);
    const end_date = common.getParamFromURLOrCookie('enddate', true);
    const usercode = common.getParamFromURLOrCookie('usercode', true);
    if(!strategy_id){
      return;
    }
    this.setState({
      begin_date: begin_date,
      end_date: end_date,
    });

    this.props
      .dispatch({
        type: 'brinson/getStrategyInfo',
        payload: {
          strategy_id,
        },
      })
      .then(() => {
        if(!this.props.brinson.strategyInfo){
          return;
        }
        this.setState({ strategyInfo: this.props.brinson.strategyInfo });
      });

      this.initData(strategy_id, this.state.index_code, begin_date, end_date)
  }

  initData=(strategy_id, index_code, begin_date, end_date)=>{
    this.props
      .dispatch({
        type: 'brinson/getBrinson',
        payload: { strategy_id, index_code, begin_date, end_date },
      })
      .then(() => {
        const { brinsonData } = this.props.brinson;
        if (brinsonData == undefined || brinsonData.Error != undefined) {
          return;
        }
        //解析接口返回的数据
        const indexData = brinsonData.index; //行
        const columnsData = brinsonData.columns; //列
        const exContribution = []; //超额贡献
        const configData = []; // 行业配置
        const stockcrossData = []; //选股+交叉
        //const dataData = brinsonData.data; //交叉数据
        if(!brinsonData.data){
          return;
        }
        for (let i = 0; i < brinsonData.data.length; i++) {
          for (let j = 0; j < brinsonData.columns.length; j++) {
            if (brinsonData.columns[j] == '超额贡献') {
              exContribution.push(brinsonData.data[i][j]);
            }
            if (brinsonData.columns[j] == '行业配置') {
              configData.push(brinsonData.data[i][j]);
            }
            if (brinsonData.columns[j] == '选股+交叉') {
              stockcrossData.push(brinsonData.data[i][j]);
            }
          }
        }
        //const { indexData, exContribution, configData, stockcrossData } = this.props.brinson;
        this.displayChart1(indexData, exContribution);
        this.displayChart2(indexData, configData, stockcrossData);

        const tableData = []; //数据 brinson数据
        for (let i = 0; i < indexData.length; i++) {
          tableData.push({
            index: i + 1,
            x: indexData[i],
            y: exContribution[i],
          });
        }

        const columns = [
          {
            title: '项目',
            dataIndex: 'x',
            key: 'x',
          },
          {
            title: '超额贡献',
            dataIndex: 'y',
            key: 'y',
            //sorter: (a, b) => a.count - b.count,
            className: styles.alignRight,
          },
        ];

        const tableData2 = []; //行业配置和交叉股
        for (let i = 0; i < indexData.length; i++) {
          tableData2.push({
            index: i + 1,
            x: indexData[i],
            y: configData[i],
            z: stockcrossData[i],
          });
        }
        const columns2 = [
          {
            title: '项目',
            dataIndex: 'x',
            key: 'x',
          },
          {
            title: '行业配置',
            dataIndex: 'y',
            key: 'y',
            //sorter: (a, b) => a.count - b.count,
            className: styles.alignRight,
          },
          {
            title: '选股+交叉',
            dataIndex: 'z',
            key: 'z',
            //sorter: (a, b) => a.count - b.count,
            className: styles.alignRight,
          },
        ];

        this.setState({
          columns: columns,
          tableData: tableData,
          columns2: columns2,
          tableData2: tableData2,
        });
        //then end
      });
  }

  componentWillUnmount() {
    // console.log('componentWillUnmount');
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'brinson/clear',
    // });
  }

  //绘制图表1
  displayChart1 = function(xAxisData, yAxisData) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chartId1'));
    // 绘制图表
    var option = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          for (var i = 0; i < params.length; i++) {
            return (
              params[i].name +
              '</br>' +
              params[i].seriesName +
              ':' +
              (params[i].value * 100).toFixed(2) +
              '%'
            );
          }
        },
      },
      toolbox: {
        show: true,
        x: '90%',
        feature: {
          dataView: {
            show: true,
            readOnly: true,
          },
          saveAsImage: {
            show: true,
            name: 'Brinson归因-超额贡献图',
            excludeComponents: ['toolbox'],
            pixelRatio: 2,
          },
        },
      },
      legend: {
        data: ['超额贡献'],
      },
      itemStyle: {
        color: '#108ee9',
      },
      xAxis: {
        axisLabel: {
          rotate: 45,
        },
        data: xAxisData,
      },
      yAxis: {},
      series: [
        {
          name: '超额贡献',
          type: 'bar',
          data: yAxisData,
        },
      ],
    };
    myChart.setOption(option);
  };

  displayChart2 = (xAxisData, configData, stockcrossData) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chartId2'));

    var option = {
      toolbox: {
        show: true,
        x: '90%',
        feature: {
          dataView: {
            show: true,
            readOnly: true,
          },
          saveAsImage: {
            show: true,
            name: 'Brinson归因-行业配置等图',
            excludeComponents: ['toolbox'],
            pixelRatio: 2,
          },
        },
      },
      legend: {
        data: ['行业配置', '选股+交叉'],
      },
      itemStyle: {
        color: '#108ee9',
      },
      xAxis: {
        axisLabel: {
          rotate: 45,
        },
        data: xAxisData,
      },
      yAxis: {},
      series: [
        {
          name: '行业配置',
          type: 'bar',
          itemStyle: {
            color: '#108ee9',
          },
          data: configData,
          formatter: function(params) {
            for (var i = 0; i < params.length; i++) {
              return (
                params[i].name +
                '</br>' +
                params[i].seriesName +
                ':' +
                (params[i].value * 100).toFixed(2) +
                '%'
              );
            }
          },
        },
        {
          name: '选股+交叉',
          type: 'bar',
          itemStyle: {
            color: '#C0504D',
          },
          data: stockcrossData,
          formatter: function(params) {
            for (var i = 0; i < params.length; i++) {
              return (
                params[i].name +
                '</br>' +
                params[i].seriesName +
                ':' +
                (params[i].value * 100).toFixed(2) +
                '%'
              );
            }
          },
        },
      ],
    };
    myChart.setOption(option);
  };

  //替代锚点的方案
  //参考：https://blog.csdn.net/mrhaoxiaojun/article/details/79960792
  scrollToAnchor = anchorName => {
    if (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        $('#' + anchorName)
          .closest('.hide')
          .removeClass('hide');
        //并转跳
        anchorElement.scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        });
      }
    }
  };

  //下载
  downloadExcel = (id, excelName) => {
    var tableInnerHtml = $('#' + id)
      .find('table')
      .html();
    if (tableInnerHtml) {
      exportExcel.exprotTableHtmlExcel(tableInnerHtml, excelName);
    }
  };

  codeChangeHandle = (value)=>{
    //console.log("selectedValue:"+value);
    this.setState({
      index_code:value,
    });
  }

  render() {
    console.log(this.state);
    const { brinson, loading } = this.props;
    const { columns, tableData, columns2, tableData2, strategyInfo } = this.state;
    console.log('strategyInfo');
    console.log(strategyInfo);
    let strName = '';
    if(strategyInfo != undefined){
      strName = strategyInfo.strategy_name;
    }
    return (
      <Fragment>
        <NavigationBar currentKey={this.state.currentTabKey} />

        <Card loading={loading} bordered={true} style={{ textAlign: 'center' }}>
          <Row>
            <Col md={12} sm={12}>
              <p>
                策略：<span>{strName}</span>
              </p>
            </Col>
            <Col  md={12} sm={12}>
              <Select onChange={this.codeChangeHandle} defaultValue={this.state.index_code} style={{ width: 250 }}>
                <Option value="000300">沪深300</Option>
                <Option value="000905">中证500</Option>
                <Option value="000906">中证800</Option>
              </Select>
            </Col>
            <Col md={12} sm={12}>
              <p>
                日期：<span>
                  {this.state.begin_date}~{this.state.end_date}
                </span>
              </p>
            </Col>
          </Row>

          <Row>
            <Col md={12} sm={24}>
              <Button
                type="primary"
                icon="download"
                onClick={() => this.downloadExcel('table1', 'Brinson归因-超额贡献')}
              >
                导出Excel
              </Button>
            </Col>
            <Col md={12} sm={24}>
              <Button type="primary" icon="table" onClick={() => this.scrollToAnchor('table1')}>
                详细数据
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <div id="chartId1" style={{ width: '95%', height: 500 }} />
            </Col>
          </Row>
        </Card>
        <Card loading={loading} bordered={true} style={{ marginTop: 24, textAlign: 'center' }}>
          <Row>
            <Col md={12} sm={24}>
              <Button
                type="primary"
                icon="download"
                onClick={() => this.downloadExcel('table2', 'Brinson归因-行业配置等')}
              >
                导出Excel
              </Button>
            </Col>
            <Col md={12} sm={24}>
              <Button type="primary" icon="table" onClick={() => this.scrollToAnchor('table2')}>
                详细数据
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div id="chartId2" style={{ width: '95%', height: 500 }} />
            </Col>
          </Row>
        </Card>

        <Card
          className="hide"
          loading={loading}
          bordered={false}
          style={{ marginTop: 24, textAlign: 'center' }}
        >
          <Table
            rowKey={record => record.index}
            size="small"
            columns={columns}
            dataSource={tableData}
            pagination={{
              style: { marginBottom: 0 },
              pageSize: 100,
            }}
            id="table1"
          />
        </Card>

        <Card
          className="hide"
          loading={loading}
          bordered={false}
          style={{ marginTop: 24, textAlign: 'center' }}
        >
          <Table
            rowKey={record => record.index}
            size="small"
            columns={columns2}
            dataSource={tableData2}
            pagination={{
              style: { marginBottom: 0 },
              pageSize: 100,
            }}
            id="table2"
          />
        </Card>
      </Fragment>
    );
  }
}
