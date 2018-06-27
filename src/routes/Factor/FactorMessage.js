import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Divider, Table, Modal,Select,Upload, message,Icon,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import reqwest from 'reqwest';
import styles from './FactorMessage.less';
var common = require('../../utils/common');

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const CreateForm = Form.create()(props => {

  // this.state = {
  //   fileList: [],
  //   uploading: false,
  // }

  
  const { dispatch,parentThis,modalVisible,modalAction,confirmLoading,factorEntity, 
          form, handleAdd, handleModalVisible } = props;
  
  const { uploading,fileList } = parentThis.state;

  //点击确定按钮，验证表单，先上传文件，再调用父方法，上传因子数据
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      
      parentThis.setState({
        uploading: true,
        confirmLoading:true,
      });
      handleUpload((filepath)=>{
        
        if(filepath == ''){
          filepath = factorEntity.filepath;
        }
        //handleUpload();
        handleAdd(modalAction,{
          ...fieldsValue,
          authorcode:'currentUser',
          filepath:filepath,
          uploaddate:new Date().getTime(),
        });

        form.resetFields();  
      });
      
    });
  };

  //开始上传
  const handleUpload = (callback) => {
    const formData = new FormData();

    console.log(fileList);
    if(!fileList || fileList.length<=0){
      console.log("未选择上传的文件");
      callback('');
      return;
    }
    fileList.forEach((file) => {
      formData.append('file', file);
    });

    //常规方法：不行
    // dispatch({
    //   type:'factor_model/upload',
    //   payload:{
    //       file:formData,
    //   },
    // }).then(()=>{
    //   console.log(parentThis.props)
    //   parentThis.setState({
    //     uploading: false,
    //   });
    //   const{factor_model} = parentThis.props;
    //   if(!factor_model || !factor_model.filepath){
    //     parentThis.setState({
    //       uploading: false,
    //       confirmLoading:false,
    //     });
    //     message.error('因子文件上传失败');
    //     return;
    //   }
    //   callback(factor_model.filepath);
    // });


    reqwest({
      //url: '/api2/quant-policymanager/factorfile',
      url: 'https://quant-dev.phfund.com.cn/quant-policymanager/factorfile',
      method: 'POST',
      processData: false,
      data: formData,
      success: (data) => {
          console.log('success data');
          console.log(data);

          let filepath = data;
          if(!filepath){
            parentThis.setState({
              uploading: false,
              confirmLoading:false,
            });
            message.error('因子文件上传失败');
            return;
          }

          parentThis.setState({
            fileList:[],
            uploading: false,
          });
          callback(filepath);
      },
      error: (error) => {
        console.log('error');
        console.log(error);
        parentThis.setState({
            uploading: false,
            confirmLoading:false,
          });
          message.error('因子文件上传失败');
      },
    });

  }

  //添加上传文件
  const addFile=(file)=>{
    console.log('addFile:');
    console.log(file);
    console.log(message);
    if(file){
      if(fileList.filter(item=>item.name === file.name).length > 0){
        message.warn('【'+file.name+'】文件已添加');
      }
      fileList.push(file);
      let newfileList = fileList.slice();
      console.log(fileList);
      parentThis.setState({
          fileList:newfileList,
          uploading:false,
      });
    }
  };

  //上传控件属性设置
  const uploadProps = {
    accept:'.pyc',
    name:'name',
    showUploadList:true,
    //action: '/api2/quant-policymanager/factorfile',
    action:'https://quant-dev.phfund.com.cn/quant-policymanager/factorfile',
    headers: {
      enctype:"multipart/form-data",
      method:"POST",
    },
    onRemove: (file) => {
      parentThis.setState(({ fileList }) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList,
        };
      });
    },
    beforeUpload: (file) => {
      addFile(file);
      return false;
    },
    fileList: fileList,

  };
    //初始化弹框数据
  var title='';
  var okText = '';
  if(modalAction ===1){
    title='新增因子';
    okText = '新增';
    //form.resetFields();
  }else if(modalAction === 2){
    title='修改因子';
    okText = '修改';
    //form.setFieldsValue(factorEntity);
  }
  
  return (
    <Modal
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      confirmLoading={uploading || confirmLoading}
      onCancel={() => handleModalVisible()}
      okText={okText}
    >
      <FormItem>
        {form.getFieldDecorator('factorid', {
          initialValue:factorEntity.factorid,
        })(<Input type="hidden" placeholder="PE因子" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="因子名称">
        {form.getFieldDecorator('factorname', {
          rules: [{ required: true, message: '请输入因子名称' },
          { max:50, message: '因子名称长度不能超过50个中英文字' },],
          initialValue:factorEntity.factorname,
        })(<Input placeholder="PE因子" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="因子代码">
        {form.getFieldDecorator('factorcode', {
          initialValue:factorEntity.factorcode,
          rules: [{ required: true, message: '请输入因子代码' },
          { max:50, message: '因子代码长度不能超过50个中英文字' },
          { pattern:'^[a-zA-Z\'\"\?\,\.\<\>\/\;\:\[\]\|\\=\+\-\_\(\)\*\&\%\$\#\@\!\~\`]*$',message:'因子代码只能输入英文字母和特殊字符'},],
        })(<Input placeholder="PE" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="因子类型">
        {form.getFieldDecorator('type', {
            initialValue:factorEntity.type ?? 'marketvalue',
        })(
        <Select style={{ width: 250 }} disabled>
            <Option value="marketvalue">市值因子</Option>
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="因子范围">
        {form.getFieldDecorator('scope', {
          initialValue:factorEntity.scope ?? 'person',
        })(<Select style={{ width: 250 }} disabled>
            <Option value="person">个人因子</Option>
            <Option value="department">部门因子</Option>
          </Select>
          )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="因子说明">
        {form.getFieldDecorator('describe', {
          initialValue:factorEntity.describe,
          rules: [{ required: true, message: '请输入因子说明' }],
        })(<TextArea placeholder="因子说明内容" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="因子文件上传">
          <Upload {...uploadProps} >
          <Button>
            <Icon type="upload" />选择文件
          </Button>
        </Upload>
      </FormItem>
      <FormItem>
        {form.getFieldDecorator('filepath', {
          initialValue:factorEntity.filepath,
        })(<Input type="hidden" placeholder="文件路径" />)}
      </FormItem>

    </Modal>
  );

});


let timeout;

@connect(({ factor_model,rule, loading }) => ({
  factor_model,
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class FactorMessage extends PureComponent {
  state = {
    personDataList: [], //个人因子数据
    departmentDataList: [],//部分因子数据
    modalAction: 1, //1-新增；2-修改
    factorEntity:{},  //修改的factor实体
    modalVisible: false, //增加、修改框 是否显示
    confirmLoading: false,  //是否正在提交数据库
    fileList: [], //上传文件
    uploading: false, //是否正在上传文件
  };

  componentDidMount() {
    this.loadDataList();
  }

  loadDataList = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'factor_model/fetch',
    }).then(()=>{

      const {factorData}=this.props.factor_model;
      console.log("this.props");
      console.log(this.props);
      if(!factorData){
        return;
      }
      //dataSource
      const personDataList = factorData.filter(item => item.scope === "person");
      const departmentDataList = factorData.filter(item => item.scope === "department");
      this.setState({
        personDataList:personDataList,
        departmentDataList:departmentDataList,
      });
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

  //弹框隐藏
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };


  renderForm(fetch) {
    //const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="个人因子库">
              <Select
                mode="combobox"
                placeholder='模糊搜索'
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={(value)=>fetch(value,1)}
              >
              </Select>
            </FormItem>
            
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" onClick={()=>{this.showModal(1,{})}}>新增因子</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForms(fetch) {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门因子库">
              <Select
                mode="combobox"
                placeholder='模糊搜索'
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={(value)=>fetch(value,2)}
              >
              </Select>
            </FormItem>
            
          </Col>
        </Row>
      </Form>
    );
  }

  //flag:1-新增；2-修改
  showModal = (flag,entity) => {
    console.log("showModal");
    this.setState({
      modalAction:flag,
      factorEntity:entity,
      modalVisible: true,
      confirmLoading:false,
    });
  }

  
  //action:1-新增，2修改；
  //fields:弹出框字段
  handleAdd = (action,fields) => {
    console.log("handleAdd:");
    console.log(fields);
    
    // this.setState({
    //     confirmLoading: false,
    //   });

    if(action === 1){ //新增
        this.props.dispatch({
        type: 'factor_model/add',
        payload: {
          ...fields
        },}).then(()=>{
          const {currentFactorInfo} = this.props.factor_model;
          if(currentFactorInfo && currentFactorInfo.factorid !== ""){
            message.success('新增成功');
            this.setState({
              confirmLoading:false,
              modalVisible: false,
            });
            //新增成功，重新请求接口
            this.loadDataList();
          }else{
            message.success('新增失败');
          }

        });
    }else if(action === 2){ //修改
        this.props.dispatch({
        type: 'factor_model/update',
        payload: {
          ...fields
        },}).then(()=>{
          const {currentFactorInfo} = this.props.factor_model;
          if(currentFactorInfo && currentFactorInfo.factorid !== ""){
            message.success('修改成功');
            this.setState({
              confirmLoading:false,
              modalVisible: false,
            });
            //新增成功，重新请求接口
            this.loadDataList();
          }
          else{
            message.success('修改失败');
          }
        });
    }

    
  };


  handleDelete=(id)=>{
    const {dispatch} = this.props;
    dispatch({
        type: 'factor_model/delete',
        payload: { id },}).then(()=>{
          const {currentFactorInfo} = this.props.factor_model;
          if(currentFactorInfo && currentFactorInfo.factorid !== ""){
            message.success('删除成功');
          }else{
            message.success('删除失败');
          }
        });
  }

    //提交到部门
  submitToDepartment=(factorInfo)=>{
    const {dispatch} = this.props;
    var info = factorInfo;
    info.scope = 'department';
      dispatch({
          type: 'factor_model/update',
          payload: { ...info },}).then(()=>{
            const {currentFactorInfo} = this.props.factor_model;
            if(currentFactorInfo && currentFactorInfo.factorid !== ""){
              message.success('提交成功');
            }else{
              message.success('提交失败');
            }
          });
  }

  //模糊匹配
  fetchPerson=(key)=>{
    const {personDataList,departmentDataList} = this.state;

    personDataList.filter(item=>item)
  }

//==============
  //type:1-个人，2-部门
  fetch =(value,type) => {
    console.log('fetch:'+value);
    
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    //currentValue = value;
  timeout = setTimeout(()=>{this.fake(value,type)}, 500);
}

fake = (value,type) => {
  const {dispatch} = this.props;
      dispatch({
          type: 'factor_model/fetch',
        }).then(()=>{
            const {factorData}=this.props.factor_model;
            console.log("this.props");
            console.log(this.props);
            if(!factorData){
              return;
            }
            if(type === 1){
              var personDataList = factorData.filter(item => item.scope === "person");
              personDataList = personDataList.filter(item => (item.factorname && item.factorname.indexOf(value)>=0) 
                || (item.factorcode && item.factorcode.indexOf(value)>=0));
              //const departmentDataList = factorData.filter(item => item.scope === "department");
              this.setState({
                personDataList:personDataList,
              });
            }else if(type === 2){
              var departmentDataList = factorData.filter(item => item.scope === "department");
              departmentDataList = departmentDataList.filter(item => (item.factorname && item.factorname.indexOf(value)>=0) 
                || (item.factorcode && item.factorcode.indexOf(value)>=0));
              //const departmentDataList = factorData.filter(item => item.scope === "department");
              this.setState({
                departmentDataList:departmentDataList,
              });
            }
            
          });
    }
//==============


  render() {
    
    const {personDataList,departmentDataList} = this.state;
    const { modalVisible, confirmLoading, modalAction,factorEntity } = this.state;

    const columns = [
      {
        title: '因子名称',
        dataIndex: 'factorname',
        key: 'factorname',
      },
      {
        title: '因子代码',
        dataIndex: 'factorcode',
        key: 'factorcode',
      },
      {
        title: '文件名称',
        dataIndex: 'filepath',
        key: 'filepath',
      },
      {
        title: '上传时间',
        dataIndex: 'uploaddate',
        key: 'uploaddate',
        render:(text,record)=>{
          return new Date(record.uploaddate).Format('yyyy/MM/dd hh:mm');
        },
      },
      {
        title: '操作',
        render: (text,record) => (
          <Fragment>
            <a onClick={()=>{this.showModal(2,record)}}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除?" onConfirm={()=>{this.handleDelete(record.factorid)}}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="确定提交到部门?" onConfirm={()=>{this.submitToDepartment(record)}}>
              <a>提交到部门</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const columnss = [
      {
        title: '因子名称',
        dataIndex: 'factorname',
        key: 'factorname',
      },
      {
        title: '因子代码',
        dataIndex: 'factorcode',
        key: 'factorcode',
      },
      {
        title: '文件名称',
        dataIndex: 'filepath',
        key: 'filepath',
      },
      {
        title: '提交时间',
        dataIndex: 'uploaddate',
        key: 'uploaddate',
        render:(text,record)=>{
          return new Date(record.uploaddate).Format('yyyy/MM/dd hh:mm');
        },
      },
      {
        title: '上传人',
        dataIndex: 'authorcode',
        key: 'authorcode',
      },
      {
        title: '操作',
        render: (text,record) => (
          <Fragment>
            <a onClick={()=>{this.showModal(2,record)}}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除?" onConfirm={()=>{this.handleDelete(record.factorid)}}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      parentThis:this,
      dispatch:this.props.dispatch,
    };

    return (
      <PageHeaderLayout title="单因子信息管理">
        <Card bordered={true}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
                {this.renderForm(this.fetch)}
            </div>
            <Table rowKey={record => record.factorid} dataSource={personDataList} columns={columns} />
          </div>
        </Card>

        <Card bordered={true} style={{ marginTop: 30 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForms(this.fetch)}</div>
            <Table rowKey={record => record.factorid} dataSource={departmentDataList} columns={columnss} />
          </div>
        </Card>

        <div>

        <CreateForm {...parentMethods} factorEntity={factorEntity} modalAction={modalAction} modalVisible={modalVisible} confirmLoading={confirmLoading} />
      </div>

      </PageHeaderLayout>
    );
  }
}
