import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, Avatar, Space } from "antd";
import { UploadOutlined, EyeInvisibleOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";

type AuthFormProps = {
    setAuthFormstate: React.Dispatch<React.SetStateAction<boolean>>;
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthForm = ({ setAuthFormstate, isLogin, setIsLogin }: AuthFormProps) => {
    const [avatarFile, setAvatarFile] = useState<string | null>(null);

    const handleAvatarUpload = (file: RcFile) => {
        const url = URL.createObjectURL(file);
        setAvatarFile(url);
        return false; // prevent auto upload
    };

    const handleClose = () => setAuthFormstate(false);

    return (
        <Modal
            open={true}
            onCancel={handleClose}
            footer={null}
            centered
            destroyOnClose
            width={isLogin ? 500 : 600}
            title={isLogin ? "Đăng nhập" : "Tạo tài khoản"}
        >
            {isLogin ? (
                <Form layout="vertical" onFinish={(values) => console.log("Login", values)}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập email" }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                    >
                        <Input.Password
                            placeholder="Password"
                            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Button type="primary" htmlType="submit">
                                Đăng nhập
                            </Button>
                            <Button type="default" onClick={handleClose}>
                                Đóng
                            </Button>
                        </Space>
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }}>
                        <a onClick={() => setIsLogin(false)}>Tạo tài khoản mới</a>
                    </Form.Item>
                </Form>
            ) : (
                <Form layout="vertical" onFinish={(values) => console.log("Signup", values)}>
                    {/* Avatar */}
                    <Form.Item label="Avatar">
                        <Space direction="vertical" align="center" style={{ width: "100%" }}>
                            <Avatar size={80} src={avatarFile || undefined} icon={!avatarFile && <UserOutlined />} />
                            <Upload
                                beforeUpload={handleAvatarUpload}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                            </Upload>
                        </Space>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập email" }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                    >
                        <Input.Password
                            placeholder="Password"
                            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Họ"
                        name="firstName"
                        rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                    >
                        <Input placeholder="First name" />
                    </Form.Item>

                    <Form.Item
                        label="Tên"
                        name="lastName"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                    >
                        <Input placeholder="Last name" />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Button type="primary" htmlType="submit">
                                Đăng ký
                            </Button>
                            <Button type="default" onClick={handleClose}>
                                Đóng
                            </Button>
                        </Space>
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }}>
                        <a onClick={() => setIsLogin(true)}>Đã có tài khoản</a>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default AuthForm;
