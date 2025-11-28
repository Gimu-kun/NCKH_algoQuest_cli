import { Layout, Row, Col, Typography, Space } from "antd";
import { GithubOutlined, TwitterOutlined, LinkedinOutlined } from "@ant-design/icons";
import Logo from "../assets/logo.png";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
    return (
        <AntFooter className="bg-gray-900 text-white py-10">
            <div className="max-w-7xl mx-auto px-6">
                <Row gutter={[32, 32]}>
                    {/* Logo + About */}
                    <Col xs={24} md={8}>
                        <div className="flex items-center mb-4">
                            <img src={Logo} alt="Logo" style={{ height: 60 }} />
                            <Title level={4} className="ml-2 text-white">Code & Play</Title>
                        </div>
                        <Text className="text-gray-300">
                            Học lập trình, cấu trúc dữ liệu và giải thuật thông qua các trò chơi thú vị.
                        </Text>
                    </Col>

                    {/* Quick Links */}
                    <Col xs={24} md={8}>
                        <Title level={5} className="text-white mb-4">Liên kết nhanh</Title>
                        <Space direction="vertical">
                            <Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link>
                            <Link href="/games" className="text-gray-300 hover:text-white">Trò chơi</Link>
                            <Link href="/contact" className="text-gray-300 hover:text-white">Liên hệ</Link>
                            <Link href="/about" className="text-gray-300 hover:text-white">Về chúng tôi</Link>
                        </Space>
                    </Col>

                    {/* Social */}
                    <Col xs={24} md={8}>
                        <Title level={5} className="text-white mb-4">Theo dõi chúng tôi</Title>
                        <Space size="large">
                            <a href="https://github.com" target="_blank" rel="noreferrer">
                                <GithubOutlined style={{ fontSize: 24, color: "white" }} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer">
                                <TwitterOutlined style={{ fontSize: 24, color: "white" }} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                                <LinkedinOutlined style={{ fontSize: 24, color: "white" }} />
                            </a>
                        </Space>
                    </Col>
                </Row>

                <div className="mt-10 text-center text-gray-400">
                    © {new Date().getFullYear()} Code & Play. Bản quyền thuộc về nhóm phát triển.
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;
