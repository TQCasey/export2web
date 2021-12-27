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
    Card, 
    List,
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

import { url_pre } from '../AppConfig'

export default class MovePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sheetname: "",
            requestings: [],
            downloadLink: "",
            downloadName: "",
            buttonText: "可以了，提交",

            infos : [],
        }

        this.formRef = React.createRef();

        for (var i = 0 ; i < 50 ; i ++) {
            this.state.infos.push ({
                name : "Key" + i,
            })
        }
    }

    renderSheetName() {

        if (this.state.sheetname == "" || !this.state.sheetname) {
            return;
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

    renderDownloadLink() {

        if (this.state.downloadName == "" || !this.state.downloadName) {
            return;
        }

        let downloadLink = url_pre + ("/download?file=" + this.state.downloadName);

        return (
            <Form.Item>
                <Button type="link" href={downloadLink} onClick={() => {
                    this.setState({ downloadName: "" })
                }}>点击下载 {this.state.downloadName}</Button>
            </Form.Item>
        )
    }

    onSubmitClick() {

        let maps = this.formRef.current.getFieldsValue();
        let formdata = new FormData();

        let requestings = this.state.requestings || [];

        requestings[0] = true;
        this.setState({
            requestings: requestings,
            buttonText: "正在处理，请稍后...",
        })

        // console.log (maps ["constr"]);

        formdata.append("constr", maps["constr"]);

        fetch(url_pre + ("/divfromdata/"), {
            method: "POST",
            headers: {
                // 'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                // 'Content-Type': 'multipart/form-data'
            },
            body: formdata,
        }).then(resp => {
            return resp.json()
        }).then(res => {
            console.log(res);

            if (res.ret == 0) {
                message.info("成功导出价格表")
            } else {
                message.error("导出价格表失败 : " + res.msg);
            }

            requestings[0] = false;
            this.setState({
                requestings: requestings,
                buttonText: "可以了，提交",
                downloadName: res.data,
            })

        }).catch(error => {
            // console.log (error);
            message.error(error);
        })
    }

    renderCards() {
        if (this.state.infos.length <= 0) {
            return ;
        }
        return (
            <div className="site-card-wrapper">
                <List
                    dataSource={this.state.infos}
                    size="small"
                    pagination={true}
                    bordered={true}
                    renderItem={(item,key) => {
                        return (
                            <List.Item>
                                <Card draggable={true}>
                                    {item.name}
                                </Card>
                            </List.Item>
                        )
                    }}
                />
            </div>
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
                        label="数据CSV文件"
                        name="src_file"
                        rules={[{ required: true, message: '请选择数据CSV文件' }]}
                    >
                        <Upload
                            multiple={false}
                            maxCount={1}
                            name='src_file'
                            disabled={this.state.requestings[0]}
                            rules={[{ required: true, message: '请选择数据CSV文件' }]}
                            accept=".csv"
                            action={url_pre + ("/datafileinfo/")}
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
                                        console.log(file.response);

                                        // this.setState({
                                        //     sheetname: file.response.data[0],
                                        // })

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

                    {this.renderDownloadLink()}

                    {/* <Form.Item>
                        <Button type="primary" htmlType="submit" loading={this.state.requestings[0]}>{this.state.buttonText}</Button>
                    </Form.Item> */}

                </Form>

                {this.renderCards ()}

            </div>
        )
    }
}