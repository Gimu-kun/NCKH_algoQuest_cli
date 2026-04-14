import { Outlet, useNavigate } from "react-router-dom";
import { HUD } from "../ui/HUD";
import { useBattleSocket } from "../../hooks/useBattleSocket";
import { usePlayerStore } from "../../store/playerStore";
import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Typography, Paper } from "@mui/material";
import { RocketLaunch as RocketIcon } from "@mui/icons-material";

export const MainLayout = () => {
    const navigate = useNavigate();
    const { connect, disconnect } = useBattleSocket();
    const { username } = usePlayerStore(); // Dùng username để định danh
    const [inviteData, setInviteData] = useState<any>(null);

    useEffect(() => {
        if (username) {
            // Kết nối socket với roomId là "GLOBAL" để trực chiến lời mời
            connect("GLOBAL", username, (msg) => {}, (client) => {
                console.log("Global listener started for:", username);
            });
        }

        const handleInviteEvent = (e: any) => setInviteData(e.detail);
        window.addEventListener('battleInviteReceived', handleInviteEvent);

        return () => {
            window.removeEventListener('battleInviteReceived', handleInviteEvent);
            disconnect();
        };
    }, [username, connect, disconnect]);

    const handleAccept = () => {
        const id = inviteData.roomId;
        setInviteData(null);
        navigate(`/v1/battle/lobby/${id}`);
    };

    return (
        <Box>
            <HUD />
            <Outlet />

            <Modal open={!!inviteData} onClose={() => setInviteData(null)}>
                <Paper sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: '#161b22', border: '2px solid #58a6ff', p: 4, borderRadius: 3, textAlign: 'center', color: '#fff'
                }}>
                    <RocketIcon sx={{ fontSize: 50, color: '#58a6ff', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>LỜI MỜI QUYẾT ĐẤU!</Typography>
                    <Typography sx={{ color: '#c9d1d9', mb: 4 }}>
                        <b>{inviteData?.sender}</b> mời bạn vào phòng <b>{inviteData?.roomId}</b>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="outlined" color="inherit" onClick={() => setInviteData(null)}>Bỏ qua</Button>
                        <Button variant="contained" color="primary" onClick={handleAccept}>Tham gia</Button>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
};