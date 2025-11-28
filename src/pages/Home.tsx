import { Button, Card, Row, Col, Typography, Badge } from "antd";
import { PlayCircleOutlined, TrophyOutlined } from "@ant-design/icons";
import heroGif from "../assets/gif.gif";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

const gamesData = [
    { id: 1, title: "Stack & Queue", description: "Học qua trò chơi về Stack và Queue." },
    { id: 2, title: "Linked List Challenge", description: "Giải thuật liên kết danh sách bằng mini game." },
    { id: 3, title: "Sorting Race", description: "Thử thách thuật toán sắp xếp nhanh nhất." },
    { id: 4, title: "Graph Explorer", description: "Điều hướng và giải bài toán Graph." },
];

const leaderboardData = [
    { id: 1, name: "Alice", score: 980 },
    { id: 2, name: "Bob", score: 950 },
    { id: 3, name: "Charlie", score: 900 },
];

const Home = () => {
    return (
        <main className="px-8 py-16 bg-gray-50 min-h-screen">
            <section
                className="text-center mb-20 p-16 rounded-xl"
                style={{
                    backgroundImage: `url(${heroGif})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "black",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Title level={1} className="text-5xl font-bold"
                    style={{color:"white", fontSize: 42, fontWeight: "bold"}}>
                        Code & Play
                    </Title>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <Paragraph style={{color:"white", fontSize: 28}}>
                        Học Cấu Trúc Dữ Liệu & Giải Thuật thông qua các trò chơi trực quan,
                        thú vị và dễ tiếp cận.
                    </Paragraph>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 120 }}
                >
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlayCircleOutlined />}
                        style={{
                            fontSize: 28,
                            padding: "30px",
                        }}
                    >
                        Bắt đầu chơi
                    </Button>
                </motion.div>

                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    style={{
                        fontSize: 18,
                        padding: "30px",
                        color: "white"
                    }}
                >
                    🌟 Học qua trò chơi – Nhanh hơn, vui hơn, dễ nhớ hơn 🌟
                </motion.div>
            </section>

            <section className="mb-16">
                <Title level={2} className="text-3xl mb-6 text-center">Các trò chơi</Title>
                <Row gutter={[24, 24]}>
                    {gamesData.map((game) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={game.id}>
                            <Card
                                hoverable
                                title={game.title}
                                extra={<PlayCircleOutlined className="text-blue-500" />}
                            >
                                <p>{game.description}</p>
                                <Button type="primary" block>
                                    Chơi ngay
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            <section className="mb-16">
                <Title level={2} className="text-3xl mb-6 text-center">Top người chơi</Title>
                <Row gutter={[16, 16]} justify="center">
                    {leaderboardData.map((player) => (
                        <Col xs={20} sm={12} md={8} lg={6} key={player.id}>
                            <Card bordered hoverable>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <TrophyOutlined className="text-yellow-500 text-xl" />
                                        <span className="font-semibold">{player.name}</span>
                                    </div>
                                    <Badge count={player.score} style={{ backgroundColor: '#52c41a' }} />
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* Call-to-action Footer Hero */}
            <section className="text-center py-16 bg-blue-600 text-white rounded-lg">
                <Title level={2} className="text-3xl mb-4">Sẵn sàng nâng cao kỹ năng lập trình?</Title>
                <Paragraph className="text-lg max-w-xl mx-auto mb-4">
                    Tham gia ngay các trò chơi và thử thách để trở thành lập trình viên thành thạo!
                </Paragraph>
                <Button type="primary" size="large" className="bg-white text-blue-600 font-bold">
                    Bắt đầu ngay
                </Button>
            </section>
        </main>
    );
};

export default Home;
