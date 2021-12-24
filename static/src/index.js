import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Layout, Menu, Form, Radio, Input, message } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Upload, Button } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

class RoomView extends React.Component {

    constructor(props) {
        super (props);
        this.state = {
            fileList:[]
        };
    }

    render() {
        return <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onChange={() => {

                    }}>
                        <Menu.Item key="1" icon={<UserOutlined />}>
                            {/* 价格表导出 */}
                            AAAAAA
                        </Menu.Item>
                        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                            {/* 导出采购表 */}
                            BBBBB
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Form
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 4 }}
                                // layout={formLayout}
                                layout='horizontal'
                            // form={form}
                            // initialValues={{ layout: formLayout }}
                            // onValuesChange={onFormLayoutChange}
                            >
                                <Form.Item label="上传文件">
                                    <Upload multiple={false} accept=".xlsx" action={"http://localhost:8000/sheetnames"} onChange={(evt) => {
                                        let fileList = evt.fileList;
                                        let file = evt.file;

                                        if (file.status == "success") {
                                            message.success ("成功")
                                        } else if (file.status == "error") {
                                            message.error ("失败");
                                        }

                                    }}>
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item label="Field A">
                                    <Input placeholder="input placeholder" />
                                </Form.Item>
                                <Form.Item label="Field B">
                                    <Input placeholder="input placeholder" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary">Submit</Button>
                                </Form.Item>
                            </Form>

                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Created By NB Team</Footer>
                </Layout>
            </Layout>
    }
}

ReactDOM.render(<RoomView />, document.getElementById('container'));