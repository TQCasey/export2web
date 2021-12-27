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
    Select,
    Checkbox,
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

export default class ExportPage extends React.Component {

    constructor(props) {
        super (props);

        this.state = {
            price_sheetname : "",
            shop_sheetnames : [],
            requestings : [],
            downloadLink : "",
            downloadName : "",
            buttonText : "可以了，提交",
            errmsg : "",
        }
        
        this.formRef = React.createRef();

        this.children = [];
        for (let i = 'A'.charCodeAt(0); i < 'Z'.charCodeAt(0); i++) {
            this.children.push(<Select.Option key={String.fromCharCode (i)}>{String.fromCharCode (i)}</Select.Option>);
        }
    }

    renderPriceSheetName () {

        if (this.state.price_sheetname == "" || !this.state.price_sheetname) {
            return ;
        }

        return (
            <Form.Item label="表名" name="src_sheet_name" rules={[{ required: true, message: '请输入表名' }]}>
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

        let downloadLink = url_pre + ("/download?file=" + this.state.downloadName);

        return (
            <Form.Item>
                <Button type="link" href={downloadLink} >点击下载 {this.state.downloadName}</Button>
            </Form.Item>
        )
    }

    renderErrmsg () {
        if (this.state.errmsg == "" || !this.state.errmsg) {
            return;
        }

        return (
            <Form.Item label="警告信息">
                <Input.TextArea size='large' rows={8} showCount={true} value={this.state.errmsg} readOnly={true} bordered={true}/>
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

        formdata.append ("src_file",maps ["src_file"].file.originFileObj);
        formdata.append ("src_sheet_name",maps ["src_sheet_name"]);
        formdata.append ("src_name_column",maps ["src_name_column"]);
        formdata.append ("src_org_column",maps ["src_org_column"]);
        formdata.append ("src_now_column",maps ["src_now_column"]);

        formdata.append ("dest_file",maps ["dest_file"].file.originFileObj);
        formdata.append ("dest_sheet_name",maps ["dest_sheet_name"]);
        formdata.append ("dest_name_column",maps ["dest_name_column"]);
        formdata.append ("dest_org_column",maps ["dest_org_column"]);
        formdata.append ("dest_now_column",maps ["dest_now_column"]);

        fetch (url_pre + ("/export2shop/"),{
            method : "POST",
            headers: {
                // 'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                // 'Content-Type': 'multipart/form-data'
            },
            body : formdata,
        }).then (resp => {
            return resp.json ()
        }).then (res => {
            // console.log (res);

            if (res.ret == 0) {
                message.info ("成功导出价格表")
            } else {
                message.error ("导出价格表失败 : " + res.msg);
            }

            requestings [0] = false;

            let name = res.data.name;
            let errmsg = res.data.errmsg;

            this.setState ({
                requestings : requestings,
                buttonText : "可以了，提交",
                downloadName : name,
                errmsg : errmsg,
            })

        }).catch (error => {
            // console.log (error);
            message.error (error);
        })
    }

    renderShopSheetNames () {
        if (this.state.shop_sheetnames.length <= 0) {
            return ;
        }

        let options = [];
        this.state.shop_sheetnames.map((item,i) => {
            // return <Checkbox key={i} >{item}</Checkbox>
            options.push ({
                label : item,
                value : item,
            })
        })

        return (
            <Form.Item label="表名" name="dest_sheet_name" rules={[{ required: true, message: '请输入表名' }]}>
                <Checkbox.Group options={options} disabled={this.state.requestings[0]}/>
            </Form.Item>
        )
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
                                            price_sheetname: file.response.data[0],
                                        })

                                        this.formRef.current.setFieldsValue({
                                            src_sheet_name: file.response.data[0],
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

                    {this.renderPriceSheetName()}

                    <Form.Item
                        label="价格表-名字列"
                        rules={[{ required: true, message: '请选择价格表-表格名字列名' }]}
                        name="src_name_column"
                    >
                        <Select style={{ width: '100%' }} disabled={this.state.requestings[0]} placeholder="请选择价格表-表格名字列名" onChange={(evt) => {

                        }}>
                            {this.children}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="价格表-税前价格列"
                        name="src_org_column"
                        rules={[{ required: true, message: '请选择价格表-税前列名' }]}
                    >
                        <Select style={{ width: '100%' }} disabled={this.state.requestings[0]} placeholder="请选择价格表-税前列名" onChange={(evt) => {

                        }}>
                            {this.children}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="价格表-税后价格列"
                        name="src_now_column"
                        rules={[{ required: true, message: '请选择价格表-税后列名' }]}
                    >
                        <Select style={{ width: '100%' }} disabled={this.state.requestings[0]} placeholder="请选择价格表-税后列名" onChange={(evt) => {

                        }}>
                            {this.children}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="价格表文件"
                        name="dest_file"
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
                                            shop_sheetnames: file.response.data,
                                        })

                                        // this.formRef.current.setFieldsValue({
                                        //     sheet_name: file.response.data[0],
                                        // });

                                    } else {
                                        message.error(file.response.msg);
                                    }
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />} disabled={this.state.requestings[0]} >点击上传</Button>
                        </Upload>
                    </Form.Item>

                    {this.renderShopSheetNames()}

                    <Form.Item
                        label="采购表-名字列"
                        rules={[{ required: true, message: '请选择采购表-表格名字列名' }]}
                        name="dest_name_column"
                    >
                        <Select style={{ width: '100%' }} disabled={this.state.requestings[0]} placeholder="请选择采购表-表格名字列名" onChange={(evt) => {

                        }}>
                            {this.children}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="采购表-税前价格列"
                        name="dest_org_column"
                        rules={[{ required: true, message: '请选择采购表-税前列名' }]}
                    >
                        <Select style={{ width: '100%' }} disabled={this.state.requestings[0]} placeholder="请选择采购表-税前列名" onChange={(evt) => {

                        }}>
                            {this.children}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="采购表-税后价格列"
                        name="dest_now_column"
                        rules={[{ required: true, message: '请选择采购表-税后列名' }]}
                    >
                        <Select style={{ width: '100%' }} disabled={this.state.requestings[0]} placeholder="请选择采购表-税后列名" onChange={(evt) => {

                        }}>
                            {this.children}
                        </Select>
                    </Form.Item>

                    {this.renderErrmsg ()}
                    
                    {this.renderDownloadLink()}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={this.state.requestings[0]}>{this.state.buttonText}</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}