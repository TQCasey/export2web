import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { 
    Layout, 
    Menu, 
    Form, 
    Input, 
    message ,
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

import PricePage from './pages/PricePage';
import ExportPage from './pages/ExportPage';
import ParsePage from './pages/ParsePage';
import MovePage from './pages/MovePage';

const { Header, Content, Footer, Sider } = Layout;



export default class App extends React.Component {

    constructor(props) {
        super (props);

        this.state = {
            index : 0,
        }

        this.maps = [
            {comp : <PricePage/>,name : "价格表导出",ico : <VideoCameraOutlined/>},
            {comp : <ExportPage/>,name : "导出采购表",ico : <VideoCameraOutlined/>} ,
            {comp : <ParsePage/>,name : "连串导出数据",ico : <VideoCameraOutlined/>},
            {comp : <MovePage/>,name : "分类采购商品",ico : <VideoCameraOutlined/>},
        ]
    }

    renderPage () {
        let pagecomp = this.maps [this.state.index] || this.maps [0];
        return pagecomp.comp;
    }

    render() {
        return <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        // console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        // console.log(collapsed, type);
                    }}
                >
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.index.toString ()]} onChange={(evt) => {
                        
                        // console.log (evt);

                    }} onSelect={(evt) => {
                        // console.log (evt.key)
                        this.setState ({index : evt.key})
                    }} >
                        {this.maps.map ((item,key) => {
                            return (
                                <Menu.Item key={key} icon={item.ico}>
                                    {item.name}
                                </Menu.Item>
                            )
                        })}
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '24px 16px 0' }}>
                        {this.renderPage ()}
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Created By NB Team</Footer>
                </Layout>
            </Layout>
    }
}
