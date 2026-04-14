import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Paper, Avatar, IconButton, 
    RadioGroup, FormControlLabel, Radio, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField,
    Grid
} from '@mui/material';
import { 
    Person as PersonIcon, 
    SwapHoriz as SwapIcon, 
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { useBattleSocket } from '../../../hooks/useBattleSocket';
import { usePlayerStore } from '../../../store/playerStore';

interface Player {
    id: string;
    name: string;
    status: 'Ready' | 'Empty';
    team: 'A' | 'B';
    isHost: boolean;
}

export const TeamBattleLobby = ({ roomId, currentUser }: { roomId: string, currentUser: any }) => {
    const { firstname, lastname, username } = usePlayerStore();
    const fullName = `${firstname} ${lastname}`;
    const { connect, sendMessage, disconnect, connected } = useBattleSocket();

    // Khởi tạo danh sách trống, chờ Server trả về
    const [players, setPlayers] = useState<Player[]>([]);
    const [difficulty, setDifficulty] = useState('MEDIUM');
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteName, setInviteName] = useState('');

    // Xác định vai trò dựa trên danh sách từ Server
    const me = players.find(p => p.name === fullName); 
    const isHost = me?.isHost || false;

    useEffect(() => {
        if (roomId && username) {
            connect(roomId, username, (msg) => {
                // Khi bất kỳ ai JOIN hoặc UPDATE, Server gửi lại toàn bộ danh sách
                if (msg.additionalData && msg.additionalData.players) {
                    console.log("Danh sách người chơi mới:", msg.additionalData.players);
                    setPlayers(msg.additionalData.players);
                }
                
                if (msg.level) setDifficulty(msg.level);
                // ... các xử lý khác
            }, (client) => {
                // Ngay khi kết nối, báo danh với Server
                sendMessage(`battle/${roomId}`, { 
                    type: 'JOIN', 
                    sender: fullName, 
                    roomId 
                }, client);
            });
        }
        return () => disconnect();
    }, [roomId, username]);

    const handleAction = (type: string, payload?: any) => {
        sendMessage(`battle/${roomId}`, { type, sender: fullName, roomId, ...payload });
    };

    const sendInvite = () => {
        if (!inviteName.trim()) return;
        sendMessage('invite', { type: 'INVITE', sender: fullName, content: inviteName, roomId });
        setInviteDialogOpen(false);
        setInviteName('');
    };

    const readyPlayers = players.filter(p => p.status === 'Ready').length;

    return (
        <Box sx={{ maxWidth: 1000, margin: 'auto', mt: 10, p: 4, bgcolor: '#0d1117', color: '#c9d1d9', borderRadius: 4, border: '1px solid #30363d', position: 'relative' }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    PHÒNG CHỜ
                </Typography>
                <Typography variant="h6" sx={{ color: '#8b949e' }}>ID: {roomId}</Typography>

                {isHost && (
                    <Paper variant="outlined" sx={{ display: 'inline-flex', alignItems: 'center', gap: 3, p: '8px 24px', mt: 3, bgcolor: '#161b22', borderColor: '#30363d', color: '#fff', borderRadius: 10 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>ĐỘ KHÓ:</Typography>
                        <RadioGroup row value={difficulty} onChange={(e) => handleAction('CONFIG', { level: e.target.value })}>
                            <FormControlLabel value="EASY" control={<Radio size="small" color="success" />} label="Dễ" />
                            <FormControlLabel value="MEDIUM" control={<Radio size="small" color="primary" />} label="Vừa" />
                            <FormControlLabel value="HARD" control={<Radio size="small" color="error" />} label="Khó" />
                        </RadioGroup>
                    </Paper>
                )}
            </Box>

            <Grid container spacing={4} sx={{ mb: 6 }}>
                {['A', 'B'].map((teamId) => (
                    <Grid size={{ xs: 12, md: 6 }} key={teamId}>
                        <Paper sx={{ bgcolor: '#161b22', borderRadius: 4, border: '2px solid', borderColor: teamId === 'A' ? '#1f6feb' : '#f85149', overflow: 'hidden' }}>
                            <Box sx={{ py: 1, textAlign: 'center', bgcolor: teamId === 'A' ? '#1f6feb' : '#f85149', color: '#fff' }}>
                                <Typography variant="button" sx={{ fontWeight: 'bold' }}>ĐỘI {teamId === 'A' ? 'XANH' : 'ĐỎ'}</Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                {[0, 1].map((idx) => {
                                    const teamPlayers = players.filter(pl => pl.team === teamId);
                                    console.log(teamPlayers)
                                    const p = teamPlayers[idx];
                                    return (
                                        <Paper key={idx} variant="outlined" sx={{ mt: idx === 0 ? 0 : 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#0d1117', borderColor: '#30363d', minHeight: 70 }}>
                                            {p ? (
                                                <>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: p.isHost ? '#f1e05a' : '#30363d' }}><PersonIcon /></Avatar>
                                                        <Typography sx={{ fontWeight: 'bold', color: '#ffffff' }}>{p.name} {p.isHost ? '(Host)' : ''}</Typography>
                                                    </Box>
                                                    <Box>
                                                        {p.name === fullName && (
                                                            <IconButton onClick={() => handleAction('CHANGE_TEAM', { team: p.team === 'A' ? 'B' : 'A' })} color="primary"><SwapIcon /></IconButton>
                                                        )}
                                                        {isHost && p.name !== fullName && (
                                                            <IconButton onClick={() => handleAction('KICK', { content: p.name })} color="error"><CancelIcon /></IconButton>
                                                        )}
                                                    </Box>
                                                </>
                                            ) : (
                                                <Button fullWidth variant="outlined" onClick={() => setInviteDialogOpen(true)} sx={{ borderStyle: 'dashed', color: '#8b949e' }}>Mời +</Button>
                                            )}
                                        </Paper>
                                    );
                                })}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ textAlign: 'center' }}>
                <Button 
                    variant="contained" 
                    disabled={players.length < 2 || !isHost} 
                    onClick={() => handleAction('START_REQUEST')}
                    sx={{ px: 8, py: 1.5, fontSize: '1.1rem', bgcolor: '#238636' }}
                >
                    {isHost ? (players.length < 2 ? 'CẦN THÊM NGƯỜI' : 'BẮT ĐẦU') : 'ĐỢI CHỦ PHÒNG...'}
                </Button>
            </Box>

            <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
                <DialogTitle>Mời người chơi</DialogTitle>
                <DialogContent>
                    <TextField autoFocus fullWidth label="Username người chơi" variant="standard" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInviteDialogOpen(false)}>Hủy</Button>
                    <Button onClick={sendInvite} variant="contained">Gửi</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};