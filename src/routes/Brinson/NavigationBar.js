import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

export class NavigationBar extends Component{
	static defaultProps = {
    	currentKey:"1"
	}
	constructor (props) {
        super(props)
        //this.state = { isLiked: false }
    }
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
	    window.location.href = window.location.origin + url;
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
