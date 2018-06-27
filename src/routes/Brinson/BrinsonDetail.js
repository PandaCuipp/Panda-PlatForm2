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
  loading: loading.effects['brinson/getBrinson'],
}))
export default class BrinsonDetail extends Component {
  state = {
    currentTabKey: '2',
    columns: [],
    tableData: [],
    strategyInfo: {},
    index_code:'000300',
  };

  componentDidMount() {

    const strategy_id = common.getParamFromURLOrCookie('stg_id', true);
    let index_code = common.getParamFromURLOrCookie('index_code', true);
    const begin_date = common.getParamFromURLOrCookie('startdate', true);
    const end_date = common.getParamFromURLOrCookie('enddate', true);
    const usercode = common.getParamFromURLOrCookie('usercode', true);
    if(!strategy_id){
      return;
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
        payload: {
          strategy_id,
        },
      })
      .then(() => {
        this.setState({ strategyInfo: this.props.brinson.strategyInfo });
      });

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
        var indexData = brinsonData.index;
        var columnsData = brinsonData.columns; //行数据
        var dataData = brinsonData.data;
        if(!columnsData || !indexData){
          return;
        }
        //表头
        const columns = [
          {
            title: '行业/项目',
            dataIndex: 'col0',
            key: 'col0',
          },
        ];
        for (let i = 0; i < columnsData.length; i++) {
          columns.push({
            title: columnsData[i],
            dataIndex: 'col' + (i + 1),
            key: 'col' + (i + 1),
            className: styles.alignRight,
          });
        }

        //行数据
        const tableData = [];
        for (let i = 0; i < indexData.length; i++) {
          var item = {};
          item['index'] = i;
          item['col0'] = indexData[i];
          for (let j = 0; j < columnsData.length; j++) {
            item['col' + (j + 1)] = dataData[i][j];
          }
          tableData.push(item);
        }
        this.setState({
          columns: columns,
          tableData: tableData,
        });
      });
  }

  componentWillUnmount() {
    // const { dispatch } = this.brinson;
    // dispatch({
    //   type: 'brinson/clear',
    // });
  }

  //下载
  downloadExcel = (id,excelName)=>{
    var tableInnerHtml = $("#"+ id).find("table").html();
    exportExcel.exprotTableHtmlExcel(tableInnerHtml,excelName);
  }

  render() {
    const { brinson, loading } = this.props;
    const { strategyInfo } = brinson;
    const { columns, tableData } = this.state;

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
              <Button
                type="primary"
                icon="download"
                onClick={() => this.downloadExcel('table1', 'Brinson归因明细')}
              >
                导出Excel
              </Button>
            </Col>
            
          </Row>
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
      </Fragment>
    );
  }
}
