import 'antd/dist/antd.css';

import React from 'react';
import ReactDOM from 'react-dom';

import '../index.css';
import {
    Layout,
    Menu,
    Form,
    Input,
    message,
    Select
} from 'antd';

import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';

import {
    Upload,
    Button
} from 'antd';

import {url_pre} from '../AppConfig'

export default class PricePage extends React.Component {

    constructor(props) {
        super (props);

        this.state = {
            sheetname : "",
            requestings : [],
            downloadLink : "",
            downloadName : "",
            buttonText : "可以了，提交",
        }
        
        this.formRef = React.createRef();

        this.children = [];
        for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
            this.children.push(<Select.Option key={String.fromCharCode (i)}>{String.fromCharCode (i)}</Select.Option>);
        }
    }

    renderSheetName () {

        if (this.state.sheetname == "" || !this.state.sheetname) {
            return ;
        }

        return (
            <Form.Item label="表名" name="sheet_name" rules={[{ required: true, message: '请输入表名' }]}>
                <Input 
                    placeholder="表名" 
                    disabled={true} 
                />
            </Form.Item>
        )
    }

    renderDownloadLink () {

        if (this.state.downloadName == "" || !this.state.downloadName) {
            return ;
        }

        let downloadLink = url_pre + ( "/download?file=" + this.state.downloadName);

        return (
            <Form.Item>
                <Button type="link" href={downloadLink}  onClick={() => {
                    this.setState ({downloadName : ""})
                }}>点击下载 {this.state.downloadName}</Button>
            </Form.Item>
        )
    }

    onSubmitClick () {

        let maps = this.formRef.current.getFieldsValue ();
        let formdata = new FormData ();

        let requestings  = this.state.requestings || [];

        requestings [0] = true;
        this.setState ({
            requestings : requestings,
            buttonText : "正在处理，请稍后...",
        })

        formdata.append ("name_column",maps ["name_column"]);
        formdata.append ("now_column",maps ["now_column"]);
        formdata.append ("org_column",maps ["org_column"]);
        formdata.append ("sheet_name",maps ["sheet_name"]);
        formdata.append ("src_file",maps ["src_file"].file.originFileObj);

        fetch (url_pre + ("/export_price/"),{
            method : "POST",
            headers: {
                // 'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                // 'Content-Type': 'multipart/form-data'
            },
            body : formdata,
        }).then (resp => {
            return resp.json ()
        }).then (res => {
            console.log (res);

            if (res.ret == 0) {
                message.info ("成功导出价格表")
            } else {
                message.error ("导出价格表失败 : " + res.msg);
            }

            requestings [0] = false;
            this.setState ({
                requestings : requestings,
                buttonText : "可以了，提交",
                downloadName : res.data,
            })

        }).catch (error => {
            // console.log (error);
            message.error (error);
        })
    }


    render() {
        return (
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 4 }}
                    ref={this.formRef}
                    // layout={formLayout}
                    layout='horizontal'
                    onFinish={this.onSubmitClick.bind(this)}
                >
                    <Form.Item
                        label="价格表文件"
                        name="src_file"
                        rules={[{ required: true, message: '请选择价格表文件' }]}
                    >
                        <Upload
                            multiple={false}
                            maxCount={1}
                            name='src_file'
                            disabled={this.state.requestings[0]}
                            rules={[{ required: true, message: '请选择价格表文件' }]}
                            accept=".xlsx"
                            action={url_pre + ("/sheetnames/")}
                            onChange={(evt) => {
                                let fileList = evt.fileList;
                                let file = evt.file;

                                if (file.status == "success") {
                                    // message.success ("成功")
                                } else if (file.status == "error") {
                                    message.error("上传文件失败");
                                } else if (file.status == "done") {
                                    // console.log (file.response);
                                    if (file.response.ret == 0) {
                                        // console.log (file.response);

                                        this.setState({
                                            sheetname: file.response.data[0],
                                        })

                                        this.formRef.current.setFieldsValue({
                                            sheet_name: file.response.data[0],
                                        });

                                    } else {
                                        message.error(file.response.msg);
                                    }
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />} disabled={this.state.requestings[0]} >点击上传</Button>
                        </Upload>
                    </Form.Item>

                    {this.renderSheetName()}

                    <Form.Item
                        label="名字列"
                        rules={[{ required: true, message: '请选择表格名字列名' }]}
                        name="name_column"
                    >
                        <Select style={{ width: '100%' }} disabled={this.state.requestings[0]} placeholder="请选择表格名字列名" onChange={(evt) => {

                        }}>
                            {this.children}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="税前价格列"
                        name="org_column"
                        rules={[{ required: true, message: '请选择税前列名' }]}
                    >
                        <Select style={{ width: '100%' }} disabled={this.state.requestings[0]} placeholder="请选择税前列名" onChange={(evt) => {

                        }}>
                            {this.children}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="税后价格列"
                        name="now_column"
                        rules={[{ required: true, message: '请选择税后列名' }]}
                    >
                        <Select style={{ width: '100%' }} disabled={this.state.requestings[0]} placeholder="请选择税后列名" onChange={(evt) => {

                        }}>
                            {this.children}
                        </Select>
                    </Form.Item>

                    {this.renderDownloadLink()}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={this.state.requestings[0]}>{this.state.buttonText}</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}