import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, Table, Button, Icon } from 'antd';
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
var exportExcel = require('../../utils/exportExcel');
var common = require('../../utils/common');

@connect(({ brinson, loading }) => ({
  brinson,
  loading: loading.effects['brinson/getBarraData'],
}))
export default class BarraList extends Component {
  state = {
    currentTabKey: '3',
    columns: [],
    tableData: [],
    columns2: [],
    tableData2: [],
    columns3: [],
    tableData3: [],
    strategyInfo: {},
    index_code:'000300',
  };

  componentDidMount() {
    let strategy_id = common.getQueryVariable('stg_id');
    let index_code = common.getQueryVariable('index_code');
    let begin_date = common.getQueryVariable('startdate');
    let end_date = common.getQueryVariable('enddate');
    let usercode = common.getQueryVariable('usercode');
    
    if(!strategy_id || strategy_id == ''){
      const{urlParamStr} = this.props.brinson;
      if(urlParamStr){
        window.location.href = window.location.href +"?"+urlParamStr;
      }else{
        return;
      }
    }else{
      this.props.dispatch({
        type:'brinson/getUrlParamStr',
      });     
    }
    
    if(index_code == ''){
      index_code = this.state.index_code;
    }
    this.setState({
      begin_date: begin_date,
      end_date: end_date,
    });


    this.props
      .dispatch({
        type: 'brinson/getStrategyInfo',
        payload: { strategy_id },
      })
      .then(() => {
        this.setState({ strategyInfo: this.props.brinson.strategyInfo });
      });


    this.props
      .dispatch({
        type: 'brinson/getBarraData',
        payload: { strategy_id, index_code, begin_date, end_date },
      }).then(() => {
        const { barraData } = this.props.brinson;
        if (barraData == undefined || barraData.Error != undefined) {
          return;
        }
        const ExContribution = [];
        const ComContribution = [];
        var BarraDetailData = barraData;
        var index = BarraDetailData.index;
        var columns = BarraDetailData.columns; //行数据
        var dataArray = BarraDetailData.data;
        if(!dataArray){
          return;
        }
        
        for (var i = 0; i < dataArray.length; i++) {
          for (var j = 0; j < columns.length; j++) {
            if (columns[j] == '超额贡献') {
              ExContribution.push(dataArray[i][j]);
            }
            if (columns[j] == '组合贡献') {
              ComContribution.push(dataArray[i][j]);
            }
          }
        }
        //绘制Brinson绩效归因柱状图
        this.DrawExContributionBar(index, ExContribution);
        this.DrawComContributionBar(index, ComContribution);

        const columns = [
          {
            title: '组合/行业',
            dataIndex: 'col0', //列少的情况下，就简单用col0……等代替
            key: 'col0',
          },
          {
            title: '组合贡献',
            dataIndex: 'col1',
            key: 'col1',
            //sorter: (a, b) => a.count - b.count,
            className: styles.alignRight,
          },
        ];
        const columns2 = [
          {
            title: '组合/行业',
            dataIndex: 'col0',
            key: 'col0',
          },
          {
            title: '超额贡献',
            dataIndex: 'col1',
            key: 'col1',
            //sorter: (a, b) => a.count - b.count,
            className: styles.alignRight,
          },
        ];
        const tableData = []; //数据
        for (let i = 0; i < index.length; i++) {
          tableData.push({
            index: i + 1, //每行数据的key值
            col0: index[i],
            col1: ExContribution[i],
          });
        }
        const tableData2 = []; //数据
        for (let i = 0; i < index.length; i++) {
          tableData2.push({
            index: i + 1, //每行数据的key值
            col0: index[i],
            col1: ComContribution[i],
          });
        }

        //3 合并
        const tableData3 = []; //组合贡献和超额贡献
        for (let i = 0; i < index.length; i++) {
          tableData3.push({
            index: i + 1,
            "col0": index[i],
            "col1": ComContribution[i],
            "col2": ExContribution[i],
          });
        }

        //console.log(tableData3);
        const columns3 = [
          {
            title: '组合/行业',
            dataIndex: 'col0',
            key: 'col0',
          },
          {
            title: '组合贡献',
            dataIndex: 'col1',
            key: 'col1',
            //sorter: (a, b) => a.count - b.count,
            className: styles.alignRight,
          },
          {
            title: '超额贡献',
            dataIndex: 'col2',
            key: 'col2',
            //sorter: (a, b) => a.count - b.count,
            className: styles.alignRight,
          },
        ];

        this.setState({
          columns: columns,
          columns2: columns2,
          tableData: tableData,
          tableData2: tableData2,
          columns3: columns3,
          tableData3: tableData3,
        });
      });

  }

  componentWillUnmount() {
  }

  //绘制图表1
  DrawExContributionBar = function(xAxisData, yAxisData) {
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
            name: 'Barra归因-超额贡献图',
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
  //绘制图表2
  DrawComContributionBar = (xAxisData, yAxisData) => {
    var myChart = echarts.init(document.getElementById('chartId2'));

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
            name: 'Barra归因-组合贡献图',
            excludeComponents: ['toolbox'],
            pixelRatio: 2,
          },
        },
      },
      legend: {
        data: ['组合贡献'],
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
          name: '组合贡献',
          type: 'bar',
          data: yAxisData,
        },
      ],
    };
    myChart.setOption(option);
  };

  //替代锚点的方案
  scrollToAnchor = anchorName => {
    if (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        $('#' + anchorName)
          .closest('.hide')
          .removeClass('hide');
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
    exportExcel.exprotTableHtmlExcel(tableInnerHtml, excelName);
  };

  render() {
    const { loading } = this.props;
    const { columns, columns2, tableData, tableData2,columns3, tableData3,strategyInfo } = this.state;

    let strategy_name = '';
    if(strategyInfo != undefined){
      strategy_name = strategyInfo.strategy_name;
    }
    return (
      <Fragment>
        <NavigationBar currentKey={this.state.currentTabKey} />
        <Card loading={loading} bordered={true} style={{ textAlign: 'center' }}>
          <Row>
            <Col md={12} sm={24}>
              <p>
                策略：<span>{strategy_name}</span>
              </p>
            </Col>
            <Col md={12} sm={24}>
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
                onClick={() => this.downloadExcel('table1', 'Barra多因子归因-组合贡献')}
              >
                导出Excel
              </Button>
            </Col>
            <Col md={12} sm={24}>
              <Button type="primary" icon="table" onClick={() => this.scrollToAnchor('table3')}>
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
                onClick={() => this.downloadExcel('table2', 'Barra多因子归因-超额贡献')}
              >
                导出Excel
              </Button>
            </Col>
            <Col md={12} sm={24}>
              <Button type="primary" icon="table" onClick={() => this.scrollToAnchor('table3')}>
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

        <Card className="hide" loading={loading} bordered={false} style={{ marginTop: 24 }}>
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

        <Card className="hide" loading={loading} bordered={false} style={{ marginTop: 24 }}>
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
        <Card
          className="hide"
          loading={loading}
          bordered={false}
          style={{ marginTop: 24, textAlign: 'center' }}
        >
          <Table
            rowKey={record => record.index}
            size="small"
            columns={columns3}
            dataSource={tableData3}
            pagination={{
              style: { marginBottom: 0 },
              pageSize: 100,
            }}
            id="table3"
          />
        </Card>
      </Fragment>
    );
  }
}
