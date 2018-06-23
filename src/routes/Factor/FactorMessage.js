import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Divider, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './FactorMessage.less';

const FormItem = Form.Item;

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class FactorMessage extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="个人因子库">
              {getFieldDecorator('no')(<Input placeholder="模糊搜索" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary">新增因子</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForms() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门因子库">
              {getFieldDecorator('no')(<Input placeholder="模糊搜索" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      rule: { data },
      loading,
    } = this.props;

    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        code: 32,
        filename: '西湖区湖底公园1号',
        updatedAt: '20181111',
      },
      {
        key: '2',
        name: '胡彦斌',
        code: 32,
        filename: '西湖区湖底公园1号',
        updatedAt: '20181111',
      },
      {
        key: '3',
        name: '胡彦斌',
        code: 32,
        filename: '西湖区湖底公园1号',
        updatedAt: '20181111',
      },
      {
        key: '4',
        name: '胡彦斌',
        code: 32,
        filename: '西湖区湖底公园1号',
        updatedAt: '20181111',
      },
    ];

    const columns = [
      {
        title: '因子名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '因子代码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '文件名称',
        dataIndex: 'filename',
        key: 'filename',
      },
      {
        title: '上传时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a href="">修改</a>
            <Divider type="vertical" />
            <a href="">删除</a>
            <Divider type="vertical" />
            <a href="">提交到部门</a>
          </Fragment>
        ),
      },
    ];

    const dataSources = [
      {
        key: '1',
        name: '胡彦斌',
        code: 32,
        filename: '西湖区湖底公园1号',
        updatedAt: '20181111',
        updatedPeo: 'Alin',
      },
      {
        key: '2',
        name: '胡彦斌',
        code: 32,
        filename: '西湖区湖底公园1号',
        updatedAt: '20181111',
        updatedPeo: 'Alin',
      },
      {
        key: '3',
        name: '胡彦斌',
        code: 32,
        filename: '西湖区湖底公园1号',
        updatedAt: '20181111',
        updatedPeo: 'Alin',
      },
      {
        key: '4',
        name: '胡彦斌',
        code: 32,
        filename: '西湖区湖底公园1号',
        updatedAt: '20181111',
        updatedPeo: 'Alin',
      },
    ];

    const columnss = [
      {
        title: '因子名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '因子代码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '文件名称',
        dataIndex: 'filename',
        key: 'filename',
      },
      {
        title: '提交时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
      },
      {
        title: '上传人',
        dataIndex: 'updatedPeo',
        key: 'updatedPeo',
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a href="">修改</a>
            <Divider type="vertical" />
            <a href="">删除</a>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="单因子信息管理">
        <Card bordered={true}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </Card>

        <Card bordered={true} style={{ marginTop: 30 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForms()}</div>
            <Table dataSource={dataSources} columns={columnss} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
