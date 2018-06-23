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

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class BarraList extends Component {
  state = {
    currentTabKey: '3',
    //display1:display1,
  };

  componentDidMount() {
    this.props
      .dispatch({
        type: 'chart/fetch',
      })
      .then(() => {
        const { barraData } = this.props.chart;
        if (!barraData) {
          return;
        }

        const ExContribution = [];
        const ComContribution = [];
        var BarraDetailData = barraData;
        var index = BarraDetailData.index;
        var columns = BarraDetailData.columns; //行数据
        var dataArray = BarraDetailData.data;

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
            title: '项目',
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
            title: '项目',
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

        this.setState({
          columns: columns,
          columns2: columns2,
          tableData: tableData,
          tableData2: tableData2,
        });
      });

    this.props
      .dispatch({
        type: 'chart/getStrategyInfo',
      })
      .then(() => {
        //console.log(this.props.chart.strategyInfo);
      });

    //获取链接或cookie中的参数
    this.setState({
      strategy_id: common.getParamFromURLOrCookie('strategy_id', true),
      index_code: common.getParamFromURLOrCookie('index_code', true),
      begin_date: common.getParamFromURLOrCookie('begin_date', true),
      end_date: common.getParamFromURLOrCookie('end_date', true),
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
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
    const { columns, columns2, tableData, tableData2 } = this.state;
    const { strategyInfo } = this.props.chart;

    return (
      <Fragment>
        <NavigationBar currentKey={this.state.currentTabKey} />
        <Card loading={loading} bordered={true} style={{ textAlign: 'center' }}>
          <Row>
            <Col md={12} sm={24}>
              <p>
                策略：<span>{strategyInfo.strategy_name}</span>
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
                onClick={() => this.downloadExcel('table2', 'Barra多因子归因-超额贡献')}
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
      </Fragment>
    );
  }
}
