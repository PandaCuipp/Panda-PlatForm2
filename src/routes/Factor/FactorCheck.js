import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, Table, Button, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FactorCheck.less';

var $ = require('jquery');
var common = require('../../utils/common');

export default class FactorCheck extends Component {
  render() {
    return (
      <PageHeaderLayout title="单因子检验">
      </PageHeaderLayout>
    );
  }
}
