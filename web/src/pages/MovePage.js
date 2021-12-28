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
    Row,
    Col,
    List,
    Tag,
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

            infos: [],
            class_info: {
                "A": [
                    { name: "a1", color : "red",list: [] },
                    { name: "a2", list: [] },
                    { name: "a3", list: [] },
                    { name: "a4", list: [] },
                ],
                "B": [
                    { name: "a1", list: [] },
                    { name: "a2", list: [] },
                    { name: "a3", list: [] },
                    { name: "a4", list: [] },
                ],
                "C": [
                    { name: "a1", list: [] },
                    { name: "a2", list: [] },
                    { name: "a3", list: [] },
                    { name: "a4", list: [] },
                ],
                "D": [
                    { name: "a1", list: [] },
                    { name: "a2", list: [] },
                    { name: "a3", list: [] },
                    { name: "a4", list: [] },
                ],
                "E": [
                    { name: "a1", list: [] },
                    { name: "a2", list: [] },
                    { name: "a3", list: [] },
                    { name: "a4", list: [] },
                ],
                "F": [
                    { name: "a1", list: [] },
                    { name: "a2", list: [] },
                    { name: "a3", list: [] },
                    { name: "a4", list: [] },
                ],
                "G": [
                    { name: "a1", list: [] },
                    { name: "a2", list: [] },
                    { name: "a3", list: [] },
                    { name: "a4", list: [] },
                ],
            },
        }

        this.formRef = React.createRef();

        for (var i = 0; i < 50; i++) {
            this.state.infos.push({
                name: "Key" + i,
            })
        }
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
            return;
        }
        return (
            <div className="site-card-wrapper">
                <Tag color="#f50">原始数据</Tag>
                <List
                    dataSource={this.state.infos}
                    size="large"
                    // style={{minHeight : 500}}
                    pagination={true}
                    bordered={true}
                    renderItem={(item, key) => {
                        return (
                            <List.Item 
                                draggable={true} 
                                onDragStart={(e) => {
                                    console.log ("onDragStart");
                                    this.onDrageStart (e,item);
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault ();
                                }}
                                onDrop={(e) => {
                                    e.preventDefault ();
                                    let info = e.dataTransfer.getData ('data');
                                    console.log ("onDropEnd",info);
                                    message.info ("drop : " + JSON.stringify (info));
                                }}
                            >
                                {item.name}
                            </List.Item>
                        )
                    }}
                />
            </div>
        )
    }

    onDrageStart (e,info) {
        message.info ("drag : " + JSON.stringify (info));
        e.dataTransfer.setData ('data',JSON.stringify(info));
    }

    onDrageOverCallback (e) {
        console.log (e);
    }

    onDropCallback (e) {
        // console.log (e);
        console.log ("onDrop")
    }

    onDropOverCallback (e) {
        // console.log (e);
        console.log ("onDropOver")
    }

    renderSingleItem ({iteminfo}) {
        return (
            <div className="site-layout-background" style={{ padding: 24, minHeight: 400, minWidth: 200, marginBottom: 10 }}>
                <Tag color="#f50">#f50</Tag>
                <List
                    dataSource={this.state.infos}
                    size="small"
                    pagination={true}
                    bordered={true}
                    renderItem={(item, key) => {
                        return (
                            <List.Item 
                                draggable={true} 
                                onDragStart={(e) => {
                                    console.log ("onDragStart");
                                    this.onDrageStart (e,item);
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault ();
                                }}
                                onDrop={(e) => {
                                    e.preventDefault ();
                                    let info = e.dataTransfer.getData ('data');
                                    console.log ("onDropEnd",info);
                                    message.info ("drop : " + JSON.stringify (info));
                                }}
                            >
                                {item.name}
                            </List.Item>
                        )
                    }}
                />
            </div>
        )
    }

    renderContents() {

        let keys = Object.keys (this.state.class_info);

        return (
            <>
                <Col span={4} >
                    {this.renderSingleItem ({})}
                    {this.renderSingleItem ({})}
                </Col>

                <Col span={4} >
                    {this.renderSingleItem ({})}
                    {this.renderSingleItem ({})}
                </Col>

                <Col span={4} >
                    {this.renderSingleItem ({})}
                    {this.renderSingleItem ({})}
                </Col>

                <Col span={4} >
                    {this.renderSingleItem ({})}
                </Col>
            </>
        )
    }

    render() {
        return (

            <Row gutter={[8, 8]}>
                <Col span={4} >
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 660, minWidth: 460 }}>
                        <Form
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 4 }}
                            ref={this.formRef}
                            // layout={formLayout}
                            layout='horizontal'
                            onFinish={this.onSubmitClick.bind(this)}
                        >
                            <Form.Item
                                label="CSV文件"
                                name="src_file"
                                style={{ minWidth: 250 }}
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

                        </Form>

                        {this.renderCards()}

                    </div>
                </Col>

                {this.renderContents()}
            </Row>

        )
    }
}