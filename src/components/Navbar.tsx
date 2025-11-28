import {Layout, Menu, Button, Row, Col, Space, Image} from "antd";
import type { MenuProps } from "antd";
import Logo from "../assets/logo.png";
import React from "react";

const { Header } = Layout;

type NavbarProps = {
    setAuthFormstate: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ setAuthFormstate, setIsLogin }: NavbarProps) => {
    const items: MenuProps["items"] = [
        { key: "1", label: "Trang chủ" },
        { key: "2", label: "Sản phẩm" },
        { key: "3", label: "Liên hệ" },
    ];

    return (
        <Header style={{ background: "#fff", padding: "0 40px", height: 60 }}>
            <Row align="middle" justify="space-between" style={{ height: "100%" }}>
                <Col>
                    <Image src={Logo} className="cursor-pointer" style={{ height:60 }} preview={false} />
                </Col>
                <Col flex="auto">
                    <Menu
                        mode="horizontal"
                        items={items}
                        style={{ borderBottom: "none", justifyContent: "center", fontSize: 18, fontWeight: "bold" }}
                    />
                </Col>
                <Col>
                    <Space>
                        <Button
                            style={{
                                fontWeight: "bold",
                                fontSize: 18,
                            }}
                            type="default"
                            onClick={() => {
                                setIsLogin(true);
                                setAuthFormstate(true);
                            }}
                        >
                            Đăng nhập
                        </Button>

                        <Button
                            style={{
                                fontWeight: "bold",
                                fontSize: 18,
                            }}
                            type="primary"
                            onClick={() => {
                                setIsLogin(false);
                                setAuthFormstate(true);
                            }}
                        >
                            Đăng ký
                        </Button>
                    </Space>
                </Col>

            </Row>
        </Header>
    );
};

export default Navbar;
