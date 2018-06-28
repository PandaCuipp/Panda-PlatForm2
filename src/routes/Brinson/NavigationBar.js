import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';

var common = require('../../utils/common');
const { TabPane } = Tabs;
var $ = require('jquery');

@connect(({ brinson, loading }) => ({
  brinson,
  loading: loading.effects['brinson/getBrinson'],
}))
export class NavigationBar extends Component{
	static defaultProps = {
    	currentKey:"1"
	}
	constructor (props) {
        super(props)
        //this.state = { isLiked: false }
    }
    componentDidMount(){
    	//console.log("window");
    	//console.log(window.location);
    	//this.addUrlParamToMenu();

    	const strategy_id = common.getParamFromURLOrCookie('stg_id', true);
    	if(!strategy_id || strategy_id == ''){
      		this.props.dispatch({
	        type:'brinson/getUrlParamStr',
	      }).then(()=>{
	      	
	      });
	      return;
	    }else{
	      this.props.dispatch({
	        type:'brinson/getUrlParamStr',
	      }).then(()=>{

	      });
	      
	    }
    }

    addUrlParamToMenu = ()=>{
    	var query = window.location.href;
    	if(query.indexOf('?') >= 0){
    		$("#"+$("/brinson$Menu")).find("a").each(()=>{
    			var that = $this;
    			var rawUrl = that.attr("href");
    			if(!rawUrl && rawUrl.indexOf("?") < 0){
    				var newUrl = rawUrl + "?" + query.split("?")[1];
    			}
    		});
    	}
    };
    // componentWillMount(){
    // }
    handleTabChange = key => {
    	if(key == this.props.currentKey){
    		return;
    	}
	    
	    let url = '';
	    if(key == "1"){
	    	url = '#/brinson/list';
	    }else if(key == "2"){
	    	url = '#/brinson/detail';
	    }else if(key == "3"){
	    	url = '#/brinson/barra';
	    }else if(key == "4"){
	    	url = '#/brinson/barra_detail';
	    }else if(key == "5"){
	    	url = '#/brinson/barra_analysis';
	    }else{
	    	console.warn("自定义消息-NavigationBar Tab's key is invalid:"+key);
	    	return;
	    }

	    //console.log("gogogogogogggogogogogogogogogogogogogo");
      	//window.location.href = window.location.href.split("?")[0] + "?" + this.props.brinson.getUrlParamStr;
	    var query = window.location.href;
	    if(query.indexOf("?") >= 0){
	    	window.location.href = window.location.origin + url +"?"+query.split("?")[1];
	    }
	    else{
	    	this.props.dispatch({
		        type:'brinson/getUrlParamStr',
		      }).then(()=>{
		      	const{ urlParamStr } = this.props.brinson;
		      	if(urlParamStr){
		      		window.location.href = window.location.origin + url + urlParamStr;	
		      	}
		    	 else{
		    	 	window.location.href = window.location.origin + url;
		    	}
		      });	
	    		
	    }
  };
	render(){

		return (
            <Tabs size="large" defaultActiveKey="1" 
            	activeKey={this.props.currentKey} 
            	tabBarStyle={{ marginBottom: 24 }}
            	onChange={this.handleTabChange}>
              <TabPane tab="Brinson归因" key="1"></TabPane>
              <TabPane tab="Brinson归因明细" key="2"></TabPane>
              <TabPane tab="Barra多因子归因" key="3"></TabPane>
              <TabPane tab="Barra多因子归因明细" key="4"></TabPane>
              <TabPane tab="Barra风险分析" key="5"></TabPane>
            </Tabs>
		);
	};
}
