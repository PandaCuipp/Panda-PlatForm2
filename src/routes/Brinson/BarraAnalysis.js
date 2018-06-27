import React, {
	Component,
	Fragment
} from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, Table, Button, Icon, DatePicker } from 'antd';
import moment from 'moment';
import { NavigationBar } from './NavigationBar';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import "echarts/lib/component/toolbox";
require("echarts/lib/component/legendScroll");
import styles from './BrinsonList.less';

var $ = require("jquery");
var exportExcel = require('../../utils/exportExcel');
var common = require('../../utils/common');

@connect(({brinson,loading}) => ({
	brinson,
	loading: loading.effects['brinson/getBarraAnalysisData'],
}))
export default class BarraAnalysis extends Component {
	state = {
		currentTabKey: '5',
		strategyInfo:{},
		columns:[],
		tableData:[],
		value: moment(new Date().Format("yyyyMMdd")),
		selectedValue: new Date().Format("yyyyMMdd"),
		index_code:'000300',
	};
	//生命周期 - 初始化
	componentDidMount() {

	const strategy_id = common.getParamFromURLOrCookie('stg_id', true);
    let index_code = common.getParamFromURLOrCookie('index_code', true);
    const begin_date = common.getParamFromURLOrCookie('startdate', true);
    const end_date = common.getParamFromURLOrCookie('enddate', true);
    const usercode = common.getParamFromURLOrCookie('usercode', true);
    var trade_date = common.getParamFromURLOrCookie('trade_date', true);
    if(!strategy_id){
      return;
    }
    if(index_code == ''){
      index_code = this.state.index_code;
    }

    if(trade_date || trade_date === ""){
    	trade_date = begin_date;
    }
    //获取链接中的参数值
	this.setState({
		strategy_id: strategy_id,
		index_code: index_code,
		value: moment(trade_date),
		selectedValue: trade_date,
	});

	this.refrushData(strategy_id,index_code,trade_date);

    this.props
      .dispatch({
        type: 'brinson/getStrategyInfo',
        payload: { strategy_id },
      })
      .then(() => {
        this.setState({ strategyInfo: this.props.brinson.strategyInfo });
      });

	}

	//生命周期--注销
	componentWillUnmount() {
		// const {
		// 	dispatch
		// } = this.props;
		// dispatch({
		// 	type: 'brinson/clear',
		// });
	}

	refrushData = (strategy_id,index_code,trade_date)=>{
		
		this.props.dispatch({
			type: 'brinson/getBarraAnalysisData', //获取模拟的data数据
			payload: { strategy_id, index_code, trade_date },
		}).then(() => {

			const { barraAnalysisData } = this.props.brinson;
			if (barraAnalysisData == undefined || barraAnalysisData.Error != undefined) {
	          return;
    		}

			var indexData = barraAnalysisData.index;
			var columnsData = barraAnalysisData.columns; //行数据
			var dataData = barraAnalysisData.data;

			//表头
			const columns = [{
				title: '行业/项目',
				dataIndex: 'col0',
				key: 'col0',
			}, ];
			for(let i = 0; i < columnsData.length; i++) {
				columns.push({
					title: columnsData[i],
					dataIndex: 'col' + (i + 1),
					key: 'col' + (i + 1),
					className: styles.alignRight,
				});
			}

			//行数据
			const tableData = [];
			for(let i = 0; i < indexData.length; i++) {
				var item = {};
				item["index"] = i;
				item["col0"] = indexData[i]
				for(let j = 0; j < columnsData.length; j++) {
					item["col" + (j + 1)] = dataData[i][j];
				}
				tableData.push(item);
			}
			this.setState({
				columns: columns,
				tableData: tableData
			});
		});
	}

	//下载
	downloadExcel = (id, excelName) => {
		var tableInnerHtml = $("#" + id).find("table").html();
		exportExcel.exprotTableHtmlExcel(tableInnerHtml, excelName);
	}

	//选择日期
	onChange = (date, dateString) => {
		this.setState({
			value: date,
			selectedValue: dateString,
		});
		const {strategy_id, index_code} = this.state;
		this.refrushData(strategy_id, index_code,dateString);
	}
	render() {

		const {
			brinson,
			loading
		} = this.props;
		const {
			strategyInfo,
			columns,
			tableData,
			selectedValue,
			value
		} = this.state;

	    let strategy_name = '';
	    if(strategyInfo != undefined){
	      strategy_name = strategyInfo.strategy_name;
	    }

		const dateFormat = 'YYYYMMDD';
		return(
			<Fragment>
        <NavigationBar currentKey={this.state.currentTabKey} />
        <Card loading={loading} bordered={true} style={{ textAlign:'center' }}>
	        <Row>
	          <Col md={8} sm={24}>
	            <p>策略：<span>{strategy_name}</span></p>
	          </Col>
	          <Col md={8} sm={24}>
	            日期：<DatePicker allowClear={false} value={value} format={dateFormat} onChange={this.onChange } />
	          </Col>
	          <Col md={8} sm={24}>
	            	<Button type="primary" icon="download" onClick={() => this.downloadExcel('table1', 'Barra风险分析')}>导出Excel</Button>
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
