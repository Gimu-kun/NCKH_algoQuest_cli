PHẦN 1: CƠ SỞ LÝ THUYẾT VÀ PHÂN TÍCH GIẢI THUẬT
Chương 1: Tổng quan và Độ phức tạp thuật toán
1.1. Khái niệm nền tảng
• Giải thuật (Algorithm): Là phương pháp, cách thức giải quyết vấn đề với đầu vào (Input) và đầu ra (Output) xác định. Giải thuật phải thỏa mãn 5 tiêu chuẩn: Tính đúng đắn (kết quả đúng với mọi bộ dữ liệu), tính xác định (không gây nhầm lẫn), tính hữu hạn (phải dừng sau số bước hữu hạn), tính hiệu quả (tối ưu tài nguyên) và tính tổng quát,,.
• Cấu trúc dữ liệu (Data Structure): Cách tổ chức và lưu trữ dữ liệu (đại lượng, ký tự, tín hiệu điện) để máy tính xử lý hiệu quả. Mối quan hệ: Chương trình = Cấu trúc dữ liệu + Giải thuật,.
• Kiểu dữ liệu trừu tượng (ADT): Mô hình dữ liệu định nghĩa các thao tác (như thêm, xóa) mà không quan tâm đến cài đặt chi tiết bên dưới (ví dụ: Stack, Queue, List).
1.2. Phân tích độ phức tạp (Complexity Analysis)
• Mục tiêu: Đánh giá thời gian thực hiện T=f(N) dựa trên kích thước dữ liệu N, độc lập với tốc độ phần cứng máy tính,.
• Các ký hiệu tiệm cận (Asymptotic Notations):
    ◦ Big-O (O): Đánh giá cận trên (trường hợp xấu nhất - Worst Case). Ví dụ: f(n)≤c⋅g(n) với mọi n≥n 
0
​
 .
    ◦ Big-Omega (Ω): Đánh giá cận dưới (trường hợp tốt nhất - Best Case). f(n)≥c⋅g(n).
    ◦ Big-Theta (Θ): Đánh giá trường hợp trung bình (Average Case), kẹp giữa cận trên và cận dưới.
• Các lớp độ phức tạp phổ biến (xếp theo thứ tự tăng dần):
    ◦ Hằng số O(1): Truy xuất mảng, phép tính cơ bản.
    ◦ Logarit O(logN): Tìm kiếm nhị phân.
    ◦ Tuyến tính O(N): Duyệt mảng, tìm kiếm tuyến tính.
    ◦ O(NlogN): Merge Sort, Heap Sort, Quick Sort (trung bình).
    ◦ Đa thức O(N 
2
 ),O(N 
3
 ): Sắp xếp nổi bọt, vòng lặp lồng nhau,.
    ◦ Hàm mũ O(2 
N
 ),O(N!): Bài toán tháp Hà Nội, liệt kê hoán vị (Rất chậm khi N lớn, gọi là "sự ép buộc thô bạo"),.
1.3. Phương pháp tính toán cụ thể
• Vòng lặp (Loops): Tổng thời gian thân vòng lặp × số lần lặp. Vòng lặp lồng nhau = Tích các kích thước vòng lặp,.
• Đệ quy (Recursion): Sử dụng Phương pháp thay thế (Back Substitution) hoặc Cây đệ quy (Recursion Tree) để giải phương trình truy hồi. Ví dụ: T(n)=n+T(n−1) dẫn đến O(N 
2
 ),.

--------------------------------------------------------------------------------
PHẦN 2: CÁC THUẬT TOÁN TÌM KIẾM (SEARCHING)
Chương 2: Tìm kiếm trên cấu trúc mảng
2.1. Tìm kiếm tuyến tính (Linear Search)
• Nguyên lý: Duyệt từ i=0 đến N−1, so sánh a[i] với x. Nếu bằng thì trả về vị trí, ngược lại trả về -1.
• Cải tiến - Kỹ thuật Lính canh (Sentinel Linear Search):
    ◦ Đặt phần tử cần tìm x vào cuối mảng: a[N]=x.
    ◦ Vòng lặp while không cần kiểm tra điều kiện i < N, chỉ cần kiểm tra a[i] != x.
    ◦ Giảm bớt 1 phép so sánh trong mỗi lần lặp, tăng tốc độ thực thi,.
• Độ phức tạp: Tốt nhất O(1), Xấu nhất O(N).
2.2. Tìm kiếm nhị phân (Binary Search)
• Điều kiện: Dãy số phải được sắp xếp trước (tăng dần hoặc giảm dần).
• Giải thuật (Chia để trị):
    1. Khởi tạo left = 0, right = n-1.
    2. Tính mid = (left + right) / 2.
    3. Nếu a[mid] == x: Tìm thấy.
    4. Nếu a[mid] > x: Tìm ở nửa trái (right = mid - 1).
    5. Nếu a[mid] < x: Tìm ở nửa phải (left = mid + 1).
    6. Lặp lại cho đến khi left > right (không tìm thấy),,.
• Độ phức tạp: O(log 
2
​
 N), hiệu quả hơn nhiều so với tuyến tính trên tập dữ liệu lớn.

--------------------------------------------------------------------------------
PHẦN 3: CÁC THUẬT TOÁN SẮP XẾP (SORTING)
Chương 3: Nhóm thuật toán đổi chỗ và chèn
3.1. Interchange Sort (Đổi chỗ trực tiếp)
• Cơ chế: Dùng 2 vòng lặp. Vòng ngoài i từ 0→N−2, vòng trong j từ i+1→N−1. Nếu a[j]<a[i] (nghịch thế) thì đổi chỗ ngay lập tức.
• Đánh giá: Đơn giản nhưng số lần hoán vị nhiều. Độ phức tạp O(N 
2
 ).
3.2. Bubble Sort (Nổi bọt)
• Cơ chế: Duyệt từ cuối mảng về đầu mảng (hoặc ngược lại). So sánh cặp kề nhau (j,j−1), nếu nghịch thế thì đổi chỗ. Phần tử nhỏ nhất sẽ "nổi" lên đầu sau mỗi lần duyệt.
• Đặc điểm: Phần tử nhỏ về vị trí đúng rất nhanh, nhưng phần tử lớn di chuyển về cuối rất chậm (vấn đề "rùa và thỏ").
3.3. Shaker Sort (Sắp xếp rung)
• Cải tiến: Khắc phục nhược điểm của Bubble Sort bằng cách duyệt 2 chiều.
    ◦ Chiều đi (Trái → Phải): Đưa phần tử lớn nhất về cuối.
    ◦ Chiều về (Phải → Trái): Đưa phần tử nhỏ nhất về đầu.
    ◦ Thu hẹp phạm vi Left và Right sau mỗi lần duyệt.
3.4. Insertion Sort (Chèn trực tiếp)
• Cơ chế: Chia mảng làm 2 phần: đã sắp xếp và chưa sắp xếp. Lấy phần tử a[i] từ phần chưa sắp xếp, tìm vị trí thích hợp trong phần đã sắp xếp và chèn vào (bằng cách dời các phần tử lớn hơn về sau),.
• Binary Insertion Sort: Cải tiến bước tìm vị trí chèn bằng thuật toán Tìm kiếm nhị phân, giảm số lần so sánh nhưng số lần dời chỗ vẫn giữ nguyên,.
3.5. Shell Sort (Sắp xếp độ dài bước giảm dần)
• Ý tưởng: Cải tiến Insertion Sort. Thay vì so sánh các phần tử kề nhau, Shell Sort so sánh các phần tử cách nhau một khoảng h (bước nhảy).
• Quy trình:
    ◦ Chọn dãy h giảm dần (ví dụ: 5, 3, 1).
    ◦ Sắp xếp các dãy con cách nhau h vị trí bằng Insertion Sort.
    ◦ Bước cuối cùng (h=1) đảm bảo mảng được sắp xếp hoàn toàn. Giúp phần tử di chuyển xa nhanh hơn về vị trí đúng,,.
Chương 4: Nhóm thuật toán chọn và phân hoạch
4.1. Selection Sort (Chọn trực tiếp)
• Cơ chế: Tìm phần tử nhỏ nhất trong mảng chưa sắp xếp và đổi chỗ nó về vị trí đầu tiên. Lặp lại với phần còn lại. Số lần hoán vị ít hơn Interchange Sort.
4.2. Quick Sort (Sắp xếp nhanh)
• Cơ chế (Chia để trị):
    ◦ Chọn phần tử chốt (Pivot) (thường là phần tử giữa hoặc ngẫu nhiên).
    ◦ Phân hoạch (Partition): Chia mảng thành 2 phần: Phần 1 gồm các số ≤ Pivot, Phần 2 gồm các số > Pivot. Dùng 2 con trỏ Left và Right chạy từ 2 đầu để hoán vị các phần tử sai vị trí,.
    ◦ Gọi đệ quy Quick Sort cho 2 mảng con.
• Độ phức tạp: Trung bình O(NlogN). Xấu nhất O(N 
2
 ) nếu chọn Pivot không tốt (rơi vào min/max).
4.3. Heap Sort (Sắp xếp vun đống)
• Cấu trúc Heap: Coi mảng như một cây nhị phân hoàn chỉnh. Max-Heap là cây mà mọi nút cha đều lớn hơn các nút con: M[i]≥M[2i+1] và M[i]≥M[2i+2].
• Quy trình:
    1. Build Heap: Hiệu chỉnh mảng ban đầu thành Max-Heap (phần tử lớn nhất nằm ở gốc a).
    2. Sort: Hoán vị gốc a với phần tử cuối mảng. Cắt phần tử cuối (đã đúng vị trí). Vun lại đống (Heapify) cho phần còn lại,,.
• Độ phức tạp: O(NlogN) ổn định.
4.4. Merge Sort (Sắp xếp trộn)
• Cơ chế: Chia đôi mảng liên tục cho đến khi còn 1 phần tử. Sau đó trộn (Merge) 2 mảng con đã sắp xếp thành 1 mảng lớn hơn theo thứ tự đúng,.
• Độ phức tạp: O(NlogN) nhưng tốn bộ nhớ phụ để trộn.
4.5. Radix Sort (Sắp xếp cơ số)
• Đặc điểm: Không so sánh trực tiếp giá trị. Phân loại các số vào các "lô" (bucket) dựa trên từng chữ số (hàng đơn vị, hàng chục...).
• Quy trình: Phân phối vào lô → Thu gom lại → Tăng hàng số lên. Lặp lại cho đến hàng lớn nhất.

--------------------------------------------------------------------------------
PHẦN 4: CẤU TRÚC DỮ LIỆU ĐỘNG
Chương 5: Danh sách liên kết (Linked List)
5.1. Danh sách liên kết đơn (Singly Linked List)
• Cấu trúc Node: Gồm Data (Info) và con trỏ Next. Quản lý bằng pHead và pTail.
• Thao tác cơ bản:
    ◦ Tạo Node: Cấp phát động new Node.
    ◦ Thêm đầu (AddHead): NewNode->Next = Head; Head = NewNode.
    ◦ Thêm cuối (AddTail): Tail->Next = NewNode; Tail = NewNode,.
    ◦ Thêm sau nút Q: Cập nhật liên kết để chèn vào giữa (NewNode->Next = Q->Next; Q->Next = NewNode).
    ◦ Hủy nút (Delete): Cô lập nút, cập nhật liên kết của nút trước đó, giải phóng bộ nhớ (delete). Các trường hợp: Xóa đầu, Xóa cuối, Xóa sau Q, Xóa theo giá trị X,.
    ◦ Tìm kiếm: Duyệt tuần tự qua con trỏ Next.
5.2. Danh sách liên kết kép (Doubly Linked List)
• Cấu trúc: Mỗi nút có thêm con trỏ Pre (trước). Cho phép duyệt xuôi và ngược.
• Thao tác: Tương tự DSLK đơn nhưng phải cập nhật cả Next và Pre. Xóa nút dễ dàng hơn vì truy xuất được nút trước nó,.
5.3. Danh sách liên kết vòng (Circular List)
• Đặc điểm: Nút cuối (Tail) trỏ ngược về nút đầu (Head) tạo thành vòng tròn. Các thao tác thêm/xóa phải cập nhật lại liên kết vòng này,.
Chương 6: Ngăn xếp (Stack) & Hàng đợi (Queue)
6.1. Ngăn xếp (Stack)
• Nguyên lý: LIFO (Last In First Out) - Vào sau ra trước.
• Thao tác: Push (Thêm vào đỉnh), Pop (Lấy khỏi đỉnh), Top (Xem đỉnh), isEmpty.
• Cài đặt: Dùng mảng 1 chiều hoặc DSLK đơn (thêm/xóa đều ở đầu Head để tối ưu O(1)),.
• Ứng dụng:
    ◦ Đổi cơ số (Thập phân → Nhị phân).
    ◦ Khử đệ quy (Tháp Hà Nội, Giai thừa),.
    ◦ Ký pháp nghịch đảo Ba Lan (Tính giá trị biểu thức: Chuyển trung tố Infix → hậu tố Postfix rồi tính toán),.
6.2. Hàng đợi (Queue)
• Nguyên lý: FIFO (First In First Out) - Vào trước ra trước.
• Thao tác: EnQueue (Thêm vào cuối - Rear), DeQueue (Lấy ra ở đầu - Front).
• Ứng dụng:
    ◦ Bộ đệm (Buffer) hệ thống, hàng đợi máy in.
    ◦ Kiểm tra chuỗi Palindrome,.
    ◦ Demerging: Tổ chức lại dữ liệu (ví dụ tách và gộp danh sách Nam/Nữ từ file dữ liệu nhân sự mà vẫn giữ thứ tự thời gian),.

--------------------------------------------------------------------------------
PHẦN 5: CẤU TRÚC DỮ LIỆU CÂY
Chương 7: Cây Nhị Phân (Binary Tree)
• Định nghĩa: Mỗi nút có tối đa 2 con (Left, Right). Các khái niệm: Gốc, Lá, Mức, Chiều cao,.
• Duyệt cây (Traversal):
    ◦ NLR (Pre-order): Gốc → Trái → Phải.
    ◦ LNR (In-order): Trái → Gốc → Phải (Dùng cho BST để lấy dãy tăng dần).
    ◦ LRN (Post-order): Trái → Phải → Gốc (Dùng để hủy cây).
• Thao tác: Đếm số nút, đếm nút lá, tính chiều cao cây (dùng đệ quy),.
Chương 8: Cây Nhị Phân Tìm Kiếm (BST) & AVL
8.1. Binary Search Tree (BST)
• Quy tắc: Khóa(Con Trái) < Khóa(Gốc) < Khóa(Con Phải).
• Thao tác:
    ◦ Tìm kiếm: Tương tự Binary Search (O(logN)). So sánh với Gốc để rẽ trái hoặc phải.
    ◦ Thêm nút: Luôn thêm vào vị trí lá để đảm bảo quy tắc BST.
    ◦ Hủy nút: Xử lý 3 trường hợp:
        1. Nút lá: Xóa trực tiếp.
        2. Nút có 1 con: Nối cha với con của nó.
        3. Nút có 2 con: Dùng phần tử thế mạng (nút cực phải của cây con trái hoặc cực trái của cây con phải) để thay thế giá trị, sau đó xóa nút thế mạng,.
8.2. Cây Cân Bằng (AVL Tree)
• Vấn đề của BST: Có thể bị lệch (thành danh sách liên kết) nếu thêm dữ liệu đã sắp xếp (O(N)),.
• Giải pháp AVL: Đảm bảo độ cao cây con trái và phải chênh lệch không quá 1 tại mọi nút (Chỉ số cân bằng ∈{−1,0,1}).
• Kỹ thuật quay (Rotation): Sử dụng 4 phép quay để tái cân bằng khi thêm/xóa làm mất cân bằng:
    ◦ Quay đơn: Left-Left (LL) - Quay phải, Right-Right (RR) - Quay trái.
    ◦ Quay kép: Left-Right (LR) - Quay trái rồi phải, Right-Left (RL) - Quay phải rồi trái.
8.3. B-Tree
• Cấu trúc cây đa nhánh, tự cân bằng, tối ưu cho lưu trữ ngoài (ổ đĩa). Node có thể chứa nhiều khóa và nhiều con,.