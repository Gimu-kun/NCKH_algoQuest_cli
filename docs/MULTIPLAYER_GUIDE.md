# 🎮 HƯỚNG DẪN SỬ DỤNG MULTIPLAYER

## 🚀 BẮT ĐẦU NHANH

### 1. **Tạo Phòng**

1. Vào Menu chính → Click "Đấu Trường"
2. Click "Tạo Phòng Mới"
3. Nhập tên phòng (ví dụ: "Phòng của Tân")
4. Chọn trò chơi: **Tháp Hà Nội**
5. Chọn độ khó (số đĩa): 3-8
6. Click "Tạo Phòng"
7. **Lưu lại Room Code** (6 ký tự, ví dụ: ABC123)

### 2. **Tham Gia Phòng**

1. Vào Menu chính → Click "Đấu Trường"
2. Click "Tham Gia Phòng"
3. Nhập tên của bạn
4. Nhập Room Code (6 ký tự)
5. Click "Tham Gia"
6. Đợi host bắt đầu game

### 3. **Chơi Game**

1. Trong Waiting Room:
   - Guest: Click "Sẵn Sàng"
   - Host: Đợi tất cả ready → Click "Bắt Đầu Game"

2. Trong Game Arena:
   - Chơi Tháp Hà Nội như bình thường
   - Xem scoreboard bên phải để theo dõi đối thủ
   - Người hoàn thành nhanh nhất + ít bước nhất = WIN!

---

## 💡 MẸO HAY

### **Cho Host (Người Tạo Phòng)**
- ✅ Chia sẻ Room Code qua chat/voice
- ✅ Đợi tất cả players ready trước khi start
- ✅ Có thể kick players nếu cần (future feature)

### **Cho Guest (Người Tham Gia)**
- ✅ Nhập đúng Room Code (phân biệt hoa thường)
- ✅ Click "Sẵn Sàng" khi đã hiểu luật
- ✅ Có thể "Hủy Sẵn Sàng" nếu cần thêm thời gian

### **Trong Game**
- ✅ Focus vào game của mình, đừng lo đối thủ
- ✅ Dùng "Gợi ý" nếu bí (nhưng mất điểm)
- ✅ Xem scoreboard để biết vị trí của mình

---

## ⚠️ LƯU Ý QUAN TRỌNG

### **Yêu Cầu Kỹ Thuật**
- ✅ Browser hỗ trợ BroadcastChannel API (Chrome, Firefox, Edge)
- ✅ Cùng mạng WiFi/LAN (hoặc cùng máy, khác tab)
- ✅ Không block JavaScript

### **Giới Hạn Hiện Tại**
- ❌ Không support cross-device (khác mạng)
- ❌ Tối đa 4 người/phòng
- ❌ Room mất khi tất cả players leave
- ❌ Chỉ có Tháp Hà Nội (các game khác sắp ra mắt)

### **Troubleshooting**
- **Không kết nối được?** → Kiểm tra cùng mạng WiFi
- **Room Code sai?** → Kiểm tra lại 6 ký tự (ABC123)
- **Lag/Delay?** → Refresh trang và join lại
- **Scoreboard không update?** → Kiểm tra connection status (góc dưới phải)

---

## 🎯 CHIẾN THUẬT THẮNG

### **Tháp Hà Nội**

**Số bước tối ưu:**
- 3 đĩa: 7 bước (2³ - 1)
- 4 đĩa: 15 bước (2⁴ - 1)
- 5 đĩa: 31 bước (2⁵ - 1)
- 6 đĩa: 63 bước (2⁶ - 1)
- 7 đĩa: 127 bước (2⁷ - 1)
- 8 đĩa: 255 bước (2⁸ - 1)

**Mẹo:**
1. Luôn di chuyển đĩa nhỏ nhất trước
2. Đĩa nhỏ nhất di chuyển theo pattern: A → C → B → A (với 3 cọc)
3. Các đĩa khác di chuyển theo luật: chỉ đặt lên đĩa lớn hơn
4. Nếu bí, dùng "Gợi ý" (nhưng mất điểm)

**Chiến lược:**
- **Beginner (3-4 đĩa)**: Chơi chậm, đúng luật, tránh sai
- **Intermediate (5-6 đĩa)**: Học pattern, tăng tốc độ
- **Advanced (7-8 đĩa)**: Thuộc lòng pattern, chơi nhanh

---

## 🏆 BẢNG XẾP HẠNG

### **Cách Tính Điểm**

```
Rank = (Completed, FinishTime, Moves)

Ưu tiên:
1. Hoàn thành (Completed = true)
2. Thời gian nhanh (FinishTime sớm)
3. Số bước ít (Moves thấp)
```

### **Ví Dụ**

```
Player A: Completed, 45s, 31 moves
Player B: Completed, 50s, 31 moves
Player C: Not completed, -, 20 moves
Player D: Not completed, -, 15 moves

Rank:
#1 Player A (hoàn thành nhanh nhất)
#2 Player B (hoàn thành chậm hơn)
#3 Player C (chưa xong, nhiều moves hơn)
#4 Player D (chưa xong, ít moves nhất)
```

---

## 🎨 GIAO DIỆN

### **Màu Sắc**
- **Cyan/Teal**: Chủ đạo, năng động
- **Mint Green**: Thành công, hoàn thành
- **Amber**: Host, quan trọng
- **Sky Blue**: Nền, dễ chịu

### **Trạng Thái**
- **Xanh lá**: Sẵn sàng
- **Xám**: Đang chờ
- **Vàng**: Host
- **Xanh dương**: Đang chọn

---

## 📞 HỖ TRỢ

### **Báo Lỗi**
Nếu gặp lỗi, vui lòng cung cấp:
1. Browser và version (Chrome 120, Firefox 121, etc.)
2. Hành động gây lỗi (tạo phòng, join, chơi game)
3. Screenshot nếu có
4. Console log (F12 → Console tab)

### **Góp Ý**
Chúng tôi luôn lắng nghe! Gửi góp ý về:
- Tính năng mới
- Cải thiện UI/UX
- Game modes mới
- Bug reports

---

## 🔮 SẮP RA MẮT

### **Phase 2**
- [ ] Cross-device support (WebSocket)
- [ ] Chat trong phòng
- [ ] Spectator mode
- [ ] Replay system

### **Phase 3**
- [ ] Sorting Race
- [ ] Pathfinding Challenge
- [ ] Tree Traversal Puzzle
- [ ] Tournament mode

### **Phase 4**
- [ ] Leaderboards toàn cầu
- [ ] Achievements
- [ ] Ranked matches
- [ ] Custom game modes

---

## 🎓 HỌC TẬP

### **Tháp Hà Nội - Thuật Toán**

**Đệ quy (Recursive):**
```
function hanoi(n, from, to, aux):
    if n == 0: return
    
    hanoi(n-1, from, aux, to)  // Chuyển n-1 đĩa sang aux
    move(from, to)              // Chuyển đĩa lớn nhất
    hanoi(n-1, aux, to, from)  // Chuyển n-1 đĩa từ aux sang to
```

**Complexity:**
- Time: O(2^n)
- Space: O(n) (call stack)

**Ứng dụng:**
- Học đệ quy
- Hiểu divide-and-conquer
- Problem solving skills

---

Chúc bạn chơi vui vẻ! 🎉
