import { useParams } from "react-router-dom";
import { usePlayerStore } from "../../../store/playerStore";
import { TeamBattleLobby } from "../TeamBattleLobby/TeamBattleLobby";

const TeamBattleLobbyWrapper = () => {
    const { roomId } = useParams<{ roomId: string }>();
    
    // Thay vì lấy 'user', hãy lấy các thuộc tính trực tiếp từ store
    const { id, firstname, lastname } = usePlayerStore();

    if (!roomId || !id) return <div>Đang tải dữ liệu...</div>;

    return (
        <TeamBattleLobby 
            roomId={roomId} 
            // Gộp firstname và lastname thành name để truyền vào prop
            currentUser={{ 
                id: id, 
                name: `${firstname} ${lastname}`.trim() 
            }} 
        />
    );
};

export default TeamBattleLobbyWrapper;