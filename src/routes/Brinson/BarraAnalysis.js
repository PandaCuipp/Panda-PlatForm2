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

@connect(({
	chart,
	loading
}) => ({
	chart,
	loading: loading.effects['chart/fetch'],
}))
export default class BarraAnalysis extends Component {
	state = {
		currentTabKey: '5',
	};
	//生命周期 - 初始化
	componentDidMount() {
		this.props.dispatch({
			type: 'chart/fetch', //获取模拟的data数据
		}).then(() => {

			const {
				barraAnalysisData
			} = this.props.chart;
			if(!barraAnalysisData) {
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
				tableData: tableData,
			});
		});

		this.props.dispatch({
			type: 'chart/getStrategyInfo', //获取策略详情：根据策略ID获取策略详情，传入id待解决
		}).then(() => {
			console.log(this.props.chart.strategyInfo);
		})

		const strategy_id = common.getParamFromURLOrCookie('strategy_id', true);
		const index_code = common.getParamFromURLOrCookie('index_code', true);
		var trade_date = '2018-02-28';
		//获取链接中的参数值
		this.setState({
			strategy_id: strategy_id,
			index_code: index_code,
			begin_date: common.getParamFromURLOrCookie('begin_date', true),
			end_date: common.getParamFromURLOrCookie('end_date', true),
			value: moment(trade_date),
			selectedValue: trade_date,
		});

	}

	//生命周期--注销
	componentWillUnmount() {
		const {
			dispatch
		} = this.props;
		dispatch({
			type: 'chart/clear',
		});
	}

	//下载
	downloadExcel = (id, excelName) => {
		var tableInnerHtml = $("#" + id).find("table").html();
		exportExcel.exprotTableHtmlExcel(tableInnerHtml, excelName);
	}

	//选择日期
	onChange = (date, dateString) => {
		console.log("onChange");
		console.log(date);
		console.log(dateString);
		this.setState({
			value: date,
			selectedValue: dateString,
		});

		//BarraRiskDetails(strategy_id, index_code, date);
	}
	render() {

		const {
			chart,
			loading
		} = this.props;
		const {
			strategyInfo
		} = chart;
		const {
			columns,
			tableData,
			selectedValue,
			value
		} = this.state;
		const dateFormat = 'YYYY-MM-DD';
		return(
			<Fragment>
        <NavigationBar currentKey={this.state.currentTabKey} />
        <Card loading={loading} bordered={true} style={{ textAlign:'center' }}>
	        <Row>
	          <Col md={8} sm={24}>
	            <p>策略：<span>{strategyInfo.strategy_name}</span></p>
	          </Col>
	          <Col md={8} sm={24}>
	            日期：<DatePicker defaultValue={value} format={dateFormat} onChange={this.onChange } />
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
