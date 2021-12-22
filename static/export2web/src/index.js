import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Layout, Menu ,Form , Radio , Input} from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Upload, Button } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

ReactDOM.render(
    <Layout>
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
                        labelCol={{span : 4}}
                        wrapperCol={{span : 4}}
                        // layout={formLayout}
                        layout='horizontal'
                        // form={form}
                        // initialValues={{ layout: formLayout }}
                        // onValuesChange={onFormLayoutChange}
                    >
                        <Form.Item label="Field A">
                            <Upload action={'https://www.mocky.io/v2/5cc8019d300000980a055e76'}>
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item label="Form Layout" name="layout">
                            <Radio.Group>
                                <Radio.Button value="horizontal">Horizontal</Radio.Button>
                                <Radio.Button value="vertical">Vertical</Radio.Button>
                                <Radio.Button value="inline">Inline</Radio.Button>
                            </Radio.Group>
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
    </Layout>,
    document.getElementById('container'),
);