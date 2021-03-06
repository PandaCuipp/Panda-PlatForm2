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

    let strategy_id = common.getQueryVariable('stg_id');
    let index_code = common.getQueryVariable('index_code');
    let begin_date = common.getQueryVariable('startdate');
    let end_date = common.getQueryVariable('enddate');
    let usercode = common.getQueryVariable('usercode');
    let trade_date = common.getQueryVariable('trade_date');
    
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

			if(!columnsData || !indexData){
				return;
			}
			//表头
			const columns = [{
				title: '组合/行业',
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
