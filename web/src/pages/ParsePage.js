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

export default class ParsePage extends React.Component {

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

        let downloadLink = "http://127.0.0.1:8000/download?file=" + this.state.downloadName;

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

        // console.log (maps ["constr"]);

        formdata.append ("constr",maps ["constr"]);

        fetch ("http://localhost:8000/divfromdata/",{
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
                        label="连串文字"
                        rules={[{ required: true, message: '请选择表格名字列名' }]}
                        name="constr"
                    >
                        <Input.TextArea size='large' rows={8} showCount={true}/>
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