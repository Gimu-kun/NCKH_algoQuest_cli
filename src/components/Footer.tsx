/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHÂN TRANG (Footer)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * MỤC ĐÍCH:
 * Hiển thị thông tin chân trang của ứng dụng web.
 * 
 * NỘI DUNG:
 * - Logo và giới thiệu ngắn.
 * - Liên kết nhanh (Home, Games, About).
 * 
 * @component Footer
 * @category Components / Layout
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { Layout, Row, Col, Typography, Space } from "antd";
import Logo from "../assets/logo.png";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
    return (
        <AntFooter className="bg-gray-900 text-white py-10">
            <div className="max-w-7xl mx-auto px-6">
                <Row gutter={[32, 32]}>
                    {/* Logo + Giới thiệu */}
                    <Col xs={24} md={8}>
                        <div className="flex items-center mb-4">
                            <img src={Logo} alt="Logo" style={{ height: 60 }} />
                            <Title level={4} className="ml-2 text-white">Code & Play</Title>
                        </div>
                        <Text className="text-gray-300">
                            Học lập trình, cấu trúc dữ liệu và giải thuật thông qua các trò chơi thú vị.
                        </Text>
                    </Col>

                    {/* Liên kết nhanh */}
                    <Col xs={24} md={8}>
                        <Title level={5} className="text-white mb-4">Liên kết nhanh</Title>
                        <Space direction="vertical">
                            <Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link>
                            <Link href="/games" className="text-gray-300 hover:text-white">Trò chơi</Link>
                            <Link href="/contact" className="text-gray-300 hover:text-white">Liên hệ</Link>
                            <Link href="/about" className="text-gray-300 hover:text-white">Về chúng tôi</Link>
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
