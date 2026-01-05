Chương 3. 	Danh sách liên kết
Câu 1. [R]	Độ phức tạp thời gian của thao tác duyệt toàn bộ danh sách liên kết đơn có n phần tử là: ___
[<A>]	O(n)
Câu 2.
[R]	Độ phức tạp thời gian của thao tác thêm một nút vào đầu danh sách liên kết đơn là: ___
[<A>]	O(1)
Câu 3.
[R]	Độ phức tạp thời gian của thao tác thêm một nút vào cuối danh sách liên kết đơn khi không có con trỏ cuối là: ___
[<A>]	O(n)
Câu 4.
[R]	Độ phức tạp thời gian của thao tác thêm một nút vào cuối danh sách liên kết đơn khi có con trỏ cuối (tail) là: ___
[<A>]	O(1)
Câu 5.
[R]	Độ phức tạp thời gian của thao tác tìm một phần tử có giá trị cụ thể trong danh sách liên kết đơn có n phần tử là: ___
[<A>]	O(n)
Câu 6.
[R]	Giả sử mỗi nút trong danh sách liên kết đơn có 1 trường dữ liệu và 1 trường con trỏ, độ phức tạp không gian (theo số lượng nút n) là: ___
[<A>]	O(n)
Câu 7.
[R]	Trong danh sách liên kết đơn, để xoá nút cuối cùng, nếu không có con trỏ đến nút trước đó, độ phức tạp thời gian là: ___
[<A>]	O(n)
Câu 8.
[R]	Độ phức tạp thời gian của thao tác đảo ngược danh sách liên kết đơn có nnn phần tử là: ___
[<A>]	O(n)
Câu 9.
[R]	Độ phức tạp thời gian của thao tác chèn một phần tử vào đầu danh sách liên kết đôi (doubly linked list) là: ___
[<A>]	O(1)
Câu 10.
[R]	Độ phức tạp thời gian của thao tác chèn một nút vào sau một con trỏ đang trỏ đến nút hiện tại là: ___
[<A>]	O(1)
Câu 11.
[U]	Khi thêm một nút vào cuối danh sách liên kết đơn không có con trỏ tail, tổng số bước (theo số nút nnn) cần thực hiện để tìm nút cuối là: ___
[<A>]	n - 1
Câu 12.
[U]	Cho danh sách liên kết đơn có n phần tử, công thức ước lượng thời gian tìm phần tử thứ k (theo chỉ số, từ 0) là: ___
[<A>]	O(k)
Câu 13.
[U]	Trong danh sách liên kết đơn, nếu mỗi nút có kích thước bộ nhớ s, công thức biểu diễn tổng không gian bộ nhớ cấp phát cho n nút là: ___
[<A>]	n × s
Câu 14.
[U]	Trong danh sách liên kết đôi (doubly linked list), mỗi nút chứa 1 dữ liệu và 2 con trỏ. Nếu mỗi phần tử có kích thước dữ liệu là d và mỗi con trỏ tốn p, tổng bộ nhớ cho 1 nút là: ___
[<A>]	d + 2p
Câu 15.
[U]	Trong danh sách liên kết đơn có n phần tử, số lần gán con trỏ cần thực hiện khi đảo ngược danh sách là: ___
[<A>]	n
Câu 16.
[U]	Nếu chèn phần tử vào giữa danh sách liên kết đơn tại vị trí thứ k, tổng số bước (so sánh hoặc duyệt) là: ___
[<A>]	k
Câu 17.
[U]	Cho danh sách liên kết đơn có n phần tử, nếu mỗi thao tác đọc một nút mất t mili-giây, thì thời gian để duyệt toàn bộ danh sách là: ___
[<A>]	n × t
Câu 18.
[U]	Trong danh sách liên kết đôi, nếu thực hiện thao tác chèn giữa sau khi duyệt k nút, tổng thời gian (nếu mỗi bước duyệt mất t, chèn mất c) là: ___
[<A>]	k × t + c
Câu 19.
[U]	Số lượng liên kết (next) trong danh sách liên kết đơn gồm n phần tử là: ___
[<A>]	n
Câu 20.
[U]	Trong danh sách liên kết đôi có n phần tử, tổng số liên kết (next và prev) là: ___
[<A>]	2n
Câu 21.
[AP]	struct Node {
    int data;
    Node* next;
};

int countNodes(Node* head) {
    int count = 0;
    while (head != nullptr) {
        count++;
        head = head->next;
    }
    return count;
}
Giả sử danh sách có nnn nút, số lần thực hiện lệnh count++ được biểu diễn bằng biểu thức: ___
[<A>]	n
Câu 22.
[AP]	Node* findKth(Node* head, int k) {
    int i = 0;
    while (head != nullptr && i < k) {
        head = head->next;
        i++;
    }
    return head;
}
Số lần di chuyển con trỏ head = head->next trong trường hợp bình thường là: ___
[<A>]	k
Câu 23.
[AP]	Node* insertEnd(Node* head, int val) {
    Node* p = new Node{val, nullptr};
    if (head == nullptr) return p;
    Node* cur = head;
    while (cur->next != nullptr)
        cur = cur->next;
    cur->next = p;
    return head;
}
Độ phức tạp thời gian của hàm trên trong trường hợp danh sách có n phần tử là: ___
[<A>]	O(n)
Câu 24.
[AP]	Node* insertHead(Node* head, int val) {
    Node* p = new Node{val, head};
    return p;
}
Số phép gán con trỏ để chèn vào đầu danh sách là: ___
[<A>]	1
Câu 25.
[AP]	Node* reverse(Node* head) {
    Node* prev = nullptr;
    Node* cur = head;
    while (cur != nullptr) {
        Node* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}
Số phép gán con trỏ cur->next = prev thực hiện trong danh sách có n nút là: ___
[<A>]	n
Câu 26.
[AP]	bool search(Node* head, int x) {
    while (head != nullptr) {
        if (head->data == x)
            return true;
        head = head->next;
    }
    return false;
}
Số phép so sánh tối đa giữa head->data và x trong trường hợp x không tồn tại là: ___
[<A>]	n
Câu 27.
[AP]	Node* deleteHead(Node* head) {
    if (head == nullptr) return nullptr;
    Node* temp = head;
    head = head->next;
    delete temp;
    return head;
}
Số phép gán con trỏ thực hiện trong thao tác xoá đầu danh sách là: ___
[<A>]	2
Câu 28.
[AP]	int sumList(Node* head) {
    int sum = 0;
    while (head != nullptr) {
        sum += head->data;
        head = head->next;
    }
    return sum;
}
Số phép cộng thực hiện trong danh sách có n nút là: ___
[<A>]	n
Câu 29.
[AP]	int countEven(Node* head) {
    int count = 0;
    while (head != nullptr) {
        if (head->data % 2 == 0) count++;
        head = head->next;
    }
    return count;
}
Số phép chia dư head->data % 2 trong danh sách có n phần tử là: ___
[<A>]	n
Câu 30.
[AP]	Node* getLast(Node* head) {
    if (head == nullptr) return nullptr;
    while (head->next != nullptr)
        head = head->next;
    return head;
}
Số bước lặp để đến cuối danh sách liên kết đơn có n phần tử là: ___
[<A>]	n-1
Câu 31.
[AN]	int countNodes(Node* head) {
    int count = 0;
    while (head != nullptr) {
        count++;
        head = head->next;
    }
    return count;
}
Số lần thực hiện lệnh head = head->next được mô tả bởi công thức: ___
[<A>]	n
Câu 32.
[AN]	Node* findLast(Node* head) {
    while (head != nullptr && head->next != nullptr)
        head = head->next;
    return head;
}
Số lần gán con trỏ head = head->next trong danh sách có n phần tử là: __
[<A>]	n - 1
Câu 33.
[AN]	Node* reverseList(Node* head) {
    Node *prev = nullptr, *cur = head;
    while (cur != nullptr) {
        Node* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}
Tổng số phép gán con trỏ (bao gồm next, prev, cur) trong đoạn code trên là: ___
[<A>]	3n
Câu 34.
[AN]	int sum(Node* head) {
    int s = 0;
    while (head != nullptr) {
        s += head->data;
        head = head->next;
    }
    return s;
}
Số phép truy cập trường head->data trong danh sách có n nút là: ___
[<A>]	n
Câu 35.
[AN]	Node* insertAt(Node* head, int k, int val) {
    Node* p = new Node{val, nullptr};
    if (k == 0) {
        p->next = head;
        return p;
    }
    Node* cur = head;
    for (int i = 0; i < k - 1 && cur != nullptr; ++i)
        cur = cur->next;
    if (cur == nullptr) return head;
    p->next = cur->next;
    cur->next = p;
    return head;
}
Giả sử vị trí hợp lệ 0 ≤ k ≤ n, số phép duyệt cur = cur->next trong trường hợp chung là: ___
[<A>]	k - 1
Câu 36.
[AN]	bool contains(Node* head, int x) {
    while (head != nullptr) {
        if (head->data == x)
            return true;
        head = head->next;
    }
    return false;
}
Số lần so sánh tối đa giữa head->data và x là: ___
[<A>]	n
Câu 37.
[AN]	void deleteList(Node*& head) {
    while (head != nullptr) {
        Node* temp = head;
        head = head->next;
        delete temp;
    }
}
Số phép xóa bộ nhớ (delete) khi danh sách có n phần tử là: ___
[<A>]	n
Câu 38.
[AN]	int countDivisible(Node* head, int k) {
    int count = 0;
    while (head != nullptr) {
        if (head->data % k == 0)
            count++;
        head = head->next;
    }
    return count;
}
Số phép chia dư head->data % k trong danh sách có n phần tử là: ___
[<A>]	n
Câu 39.
[AN]	int compareLists(Node* a, Node* b) {
    while (a != nullptr && b != nullptr) {
        if (a->data != b->data)
            return 0;
        a = a->next;
        b = b->next;
    }
    return (a == nullptr && b == nullptr);
}
Số lần tối đa thực hiện so sánh a->data != b->data trong 2 danh sách có cùng kích thước n là: ___
[<A>]	n
Câu 40.
[AN]	int countEven(Node* head) {
    int c = 0;
    while (head != nullptr) {
        if (head->data % 2 == 0)
            c++;
        head = head->next;
    }
    return c;
}
Nếu danh sách có n phần tử, tổng số phép gán và kiểm tra (bao gồm head->data % 2 == 0) là: ___
[<A>]	2n
Câu 41. [R]	Điền từ khóa đúng để khai báo cấu trúc Node.
___ Node {
    int data;
    Node* next;
};
[<A>]	struct
Câu 42.
[R]	Điền cú pháp cấp phát động đúng trong C++ để tạo một nút mới.
Node* newNode = ___ Node;
[<A>]	new
Câu 43.
[R]	Hoàn chỉnh câu lệnh gán con trỏ liên kết tới NULL.
newNode->next = ___;
[<A>]	NULL
Câu 44.
[R]	Điền toán tử phù hợp để truy cập trường data từ con trỏ temp
cout << temp ___ data;
[<A>]	->
Câu 45.
[R]	Điền giá trị phù hợp để biến head trỏ tới danh sách rỗng.
Node* head = ___;
[<A>]	NULL
Câu 46.
[R]	Điền điều kiện đúng để kiểm tra danh sách có rỗng không.
if (head ___ NULL)
    cout << "Danh sach rong.";
[<A>]	==
Câu 47.
[R]	Bạn cần khai báo một con trỏ temp dùng để duyệt danh sách từ đầu.
Node* head = NULL;
// thêm phần tử ...
___* temp = head;
[<A>]	Node
Câu 48.
[R]	Bạn muốn in toàn bộ danh sách liên kết, lặp đến khi temp là NULL.
while (temp ___ NULL) {
    cout << temp->data << " ";
    temp = temp->next;
}
[<A>]	!=
Câu 49.
[R]	Cho con trỏ temp trỏ đến một nút trong danh sách, bạn cần giải phóng nút đó.
___ temp;
[<A>]	delete
Câu 50.
[R]	Sau khi tạo một nút mới trong danh sách liên kết đơn, bạn cần gán một giá trị cho trường data.
Node* newNode = new Node;
___ = 100;
newNode->next = NULL;
[<A>]	newNode->data
Câu 51.
[U]	Hoàn thiện điều kiện để duyệt đến nút cuối trong danh sách liên kết đơn.
struct Node {
    int data;
    Node* next;
};
Node* temp = head;
while (temp->next ___ NULL) {
    temp = temp->next;
}
[<A>]	!=
Câu 52.
[U]	Sau khi duyệt đến cuối danh sách, bạn cần gán next của nút cuối trỏ đến newNode.
struct Node {
    int data;
    Node* next;
};
temp->___ = newNode;
[<A>]	next
Câu 53.
[U]	Sau khi xoá nút đầu tiên, bạn cần cập nhật con trỏ head về nút tiếp theo.
struct Node {
    int data;
    Node* next;
};
Node* temp = head;
head = head->___;
delete temp;
[<A>]	next
Câu 54.
[U]	Bạn cần điều kiện đúng để xác định danh sách chỉ có 1 phần tử.
struct Node {
    int data;
    Node* next;
};
if (head != NULL && head->___ == NULL) {
    // danh sách có đúng 1 phần tử
}
[<A>]	next
Câu 55.
[U]	Trong đoạn code giải phóng danh sách, bạn cần cập nhật temp sang nút tiếp theo trước khi xoá.
struct Node {
    int data;
    Node* next;
};
Node* temp = head;
while (temp != NULL) {
    Node* nextNode = temp->___;
    delete temp;
    temp = nextNode;
}
[<A>]	next
Câu 56.
[U]	Viết lệnh liên kết nút mới vào đầu danh sách:
struct Node {
    int data;
    Node* next;
};

Node* newNode = new Node;
newNode->data = 10;
newNode->___ = head;
head = newNode;
[<A>]	next
Câu 57.
[U]	Bạn cần in dữ liệu từ mỗi nút trong danh sách:
struct Node {
    int data;
    Node* next;
};

Node* temp = head;
cout << ___ << endl;
[<A>]	temp->data
Câu 58.
[U]	Gán giá trị cho nút mới khi tạo:
struct Node {
    int data;
    Node* next;
};

Node* newNode = new Node;
___ = 100;
newNode->next = NULL;
[<A>]	newNode->data
Câu 59.
[U]	Viết vòng lặp in danh sách, duyệt đến khi hết danh sách:
struct Node {
    int data;
    Node* next;
};

Node* temp = head;
while (___) {
    cout << temp->data << " ";
    temp = temp->next;
}
[<A>]	temp != NULL
Câu 60.
[U]	Bạn cần viết đoạn chương trình đếm số nút trong danh sách liên kết đơn. Hãy hoàn thành điều kiện trong vòng lặp:
struct Node {
    int data;
    Node* next;
};

int count = 0;
Node* temp = head;
while (___) {
    ++count;
    temp = temp->next;
}
cout << "So nut trong danh sach: " << count;
[<A>]	temp != NULL
Câu 61.
[AP]	Viết đoạn mã để thêm newNode vào cuối danh sách liên kết đơn đã có head. Hoàn chỉnh điều kiện vòng lặp.
struct Node {
    int data;
    Node* next;
};

Node* temp = head;
while (temp->___) {
    temp = temp->next;
}
temp->next = newNode;
newNode->next = NULL;
[<A>]	next != NULL
Câu 62.
[AP]	Hoàn chỉnh thao tác thêm một newNode vào đầu danh sách:
struct Node {
    int data;
    Node* next;
};

newNode->next = ___;
head = newNode;
[<A>]	head
Câu 63.
[AP]	Viết đoạn mã xoá nút đầu tiên trong danh sách liên kết:
struct Node {
    int data;
    Node* next;
};

Node* temp = head;
head = head->next;
___;
[<A>]	delete temp
Câu 64.
[AP]	Hoàn thành vòng lặp để duyệt toàn bộ danh sách liên kết đơn và in các phần tử:
struct Node {
    int data;
    Node* next;
};

Node* temp = head;
while (temp ___ NULL) {
    cout << temp->data << " ";
    temp = temp->next;
}
[<A>]	!=
Câu 65.
[AP]	Viết đoạn mã tạo một nút mới và gán giá trị, hoàn chỉnh phần gán dữ liệu:
struct Node {
    int data;
    Node* next;
};

Node* newNode = new Node;
___ = 20;
newNode->next = NULL;
[<A>]	newNode->data
Câu 66.
[AP]	Viết đoạn mã tìm phần tử có giá trị x và in ra thông báo nếu tìm thấy:
struct Node {
    int data;
    Node* next;
};

Node* temp = head;
while (temp != NULL) {
    if (temp->___ == x) {
        cout << "Tim thay";
        break;
    }
    temp = temp->next;
}
[<A>]	data
Câu 67.
[AP]	Viết đoạn mã chèn newNode sau nút có data == k. Hoàn thiện điều kiện:
struct Node {
    int data;
    Node* next;
};

Node* temp = head;
while (temp != NULL && temp->data != k) {
    temp = temp->next;
}
if (temp != NULL) {
    newNode->next = temp->next;
    temp->___ = newNode;
}
[<A>]	next
Câu 68.
[AP]	Viết đoạn mã xoá nút sau nút có giá trị x. Hoàn chỉnh lệnh cập nhật liên kết:
struct Node {
    int data;
    Node* next;
};

Node* temp = head;
while (temp != NULL && temp->data != x) {
    temp = temp->next;
}
if (temp != NULL && temp->next != NULL) {
    Node* delNode = temp->next;
    temp->next = delNode->___;
    delete delNode;
}
[<A>]	next
Câu 69.
[AP]	Viết đoạn mã đảo ngược danh sách liên kết đơn. Hoàn chỉnh phép gán con trỏ:
struct Node {
    int data;
    Node* next;
};

Node* prev = NULL;
Node* curr = head;
while (curr != NULL) {
    Node* next = curr->next;
    curr->next = ___;
    prev = curr;
    curr = next;
}
head = prev;
[<A>]	prev
Câu 70.
[AP]	Bạn cần viết đoạn mã để thêm newNode vào cuối danh sách. Nếu head == NULL thì newNode trở thành head, ngược lại duyệt đến cuối và thêm vào. Hoàn chỉnh câu lệnh điều kiện:
struct Node {
    int data;
    Node* next;
};

if (head == NULL) {
    head = newNode;
} else {
    Node* temp = head;
    while (temp->___) {
        temp = temp->next;
    }
    temp->next = newNode;
}
newNode->next = NULL;
[<A>]	next != NULL
Câu 71.
[AN]	Khi thêm một nút mới vào danh sách rỗng, nếu không gán head = newNode; thì danh sách vẫn rỗng. Hoàn chỉnh điều kiện:
struct Node {
    int data;
    Node* next;
};

if (___) {
    head = newNode;
    newNode->next = NULL;
}
[<A>]	head == NULL
Câu 72.
[AN]	Trong đoạn mã dưới đây, nếu temp là NULL, việc truy cập temp->data sẽ gây lỗi. Điền điều kiện an toàn:
struct Node {
    int data;
    Node* next;
};

if (___) {
    cout << temp->data;
}
[<A>]	temp != NULL
Câu 73.
[AN]	Để xoá nút sau temp, bạn phải kiểm tra tồn tại nút đó trước. Hoàn chỉnh điều kiện:
struct Node {
    int data;
    Node* next;
};

if (temp != NULL && ___) {
    Node* delNode = temp->next;
    temp->next = delNode->next;
    delete delNode;
}
[<A>]	temp->next != NULL
Câu 74.
[AN]	Nếu không lưu con trỏ next trước khi xoá curr, bạn sẽ mất liên kết danh sách. Hoàn chỉnh dòng lưu liên kết:
struct Node {
    int data;
    Node* next;
};

Node* next = curr->___;
delete curr;
curr = next;
[<A>]	next
Câu 75.
[AN]	Thêm một nút mới vào đầu danh sách liên kết đôi. Nếu không cập nhật head->prev, liên kết sẽ sai chiều.
struct DNode {
    int data;
    DNode* next;
    DNode* prev;
};

newNode->next = head;
newNode->prev = NULL;
if (head != NULL) {
    ___ = newNode;
}
head = newNode;
[<A>]	head->prev
Câu 76.
[AN]	Khi chèn newNode sau một nút giữa danh sách, nếu không cập nhật next->prev, danh sách sẽ đứt chiều ngược.
newNode->next = curr->next;
newNode->prev = curr;
if (curr->next != NULL) {
    ___ = newNode;
}
curr->next = newNode;
[<A>]	curr->next->prev
Câu 77.
[AN]	Viết vòng lặp duyệt ngược danh sách liên kết đôi từ tail về head.
struct DNode {
    int data;
    DNode* next;
    DNode* prev;
};
DNode* temp = tail;
while (temp != NULL) {
    cout << temp->data << " ";
    temp = ___;
}
[<A>]	temp->prev
Câu 78.
[AN]	Khi xoá một nút ở giữa danh sách liên kết đôi, bạn cần cập nhật 2 chiều liên kết. Hoàn chỉnh cập nhật liên kết ngược.
struct DNode {
    int data;
    DNode* next;
    DNode* prev;
};

if (curr->prev != NULL) {
    curr->prev->next = curr->next;
}
if (curr->next != NULL) {
    curr->next->___ = curr->prev;
}
delete curr;
[<A>]	prev
Câu 79.
[AN]	Viết điều kiện kiểm tra danh sách liên kết đôi chỉ chứa duy nhất một nút.
struct DNode {
    int data;
    DNode* next;
    DNode* prev;
};

if (head != NULL && head->next == NULL && head->___ == NULL) {
    cout << "Danh sách chỉ có 1 nút.";
}
[<A>]	prev
Câu 80.
[AN]	Khi thêm nút vào cuối danh sách liên kết đôi, nếu không cập nhật tail, bạn sẽ không thể duyệt từ cuối về đầu sau này. Hoàn chỉnh đoạn code sau.
struct DNode {
    int data;
    DNode* next;
    DNode* prev;
};

newNode->next = NULL;
newNode->prev = tail;
if (tail != NULL) {
    tail->next = newNode;
}
___ = newNode;
[<A>]	tail
Câu 81. [R]	Trong danh sách liên kết đơn (singly linked list), mỗi nút có bao nhiêu con trỏ?
[<A>]	1
Câu 82.
[R]	Trong danh sách liên kết đôi (doubly linked list), mỗi nút có bao nhiêu con trỏ?
[<A>]	2
Câu 83.
[R]	Trong danh sách liên kết đơn có 5 nút, số bước cần đi qua để truy cập nút cuối là ____.
[<A>]	4
Câu 84.
[R]	Trong danh sách liên kết vòng đơn (circular singly linked list) có 6 nút, sau khi đi qua 6 bước từ nút đầu tiên, ta quay lại nút đầu tiên đúng ____ lần.
[<A>]	1
Câu 85.
[R]	Số nút cần kiểm tra tối đa để tìm một phần tử trong danh sách liên kết đơn có n=7 phần tử là ____.
[<A>]	7
Câu 86.
[R]	Số phép gán con trỏ cần thiết khi chèn một nút mới vào đầu danh sách liên kết đơn là ____.
[<A>]	2
Câu 87.
[R]	Trong danh sách liên kết đôi có 4 nút, số liên kết tổng cộng là ____
[<A>]	6
Câu 88.
[R]	Số phép so sánh tối đa khi tìm một phần tử trong danh sách liên kết đơn gồm 10 phần tử là ____.
[<A>]	10
Câu 89.
[R]	Khi xóa một nút giữa danh sách liên kết đơn, ta cần cập nhật bao nhiêu con trỏ?
[<A>]	1
Câu 90.
[R]	Với danh sách liên kết đơn rỗng, sau khi thêm 3 phần tử, số nút trong danh sách là ____.
[<A>]	3
Câu 91.
[U]	Một danh sách liên kết đơn có 5 phần tử. Nếu thực hiện duyệt từ đầu đến cuối và in từng phần tử, số lần truy cập biến con trỏ next là ____.
[<A>]	4
Câu 92.
[U]	Trong một danh sách liên kết đơn có 6 nút, để chèn 1 phần tử vào giữa (sau nút thứ 3), số phép gán con trỏ là ____.
[<A>]	2
Câu 93.
[U]	Giả sử danh sách liên kết đơn có 4 phần tử và ta muốn chèn một phần tử vào cuối danh sách. Số bước duyệt cần thiết là ____.
[<A>]	4
Câu 94.
[U]	Trong danh sách liên kết đôi có 3 nút, để xóa nút giữa, ta cần cập nhật ____ con trỏ.
[<A>]	2
Câu 95.
[U]	Trong một danh sách liên kết đơn có 7 phần tử, nếu thực hiện duyệt danh sách từ đầu đến cuối để tìm một phần tử có giá trị ở giữa, số bước duyệt trung bình là ____.
[<A>]	4
Câu 96.
[U]	Khi chuyển một danh sách liên kết đơn có n=5n = 5n=5 phần tử sang danh sách liên kết vòng đơn, số con trỏ cần thay đổi là ____.
[<A>]	1
Câu 97.
[U]	Khi sử dụng danh sách liên kết đơn để biểu diễn ngăn xếp (stack), để thực hiện thao tác push, số phép gán con trỏ cần thiết là ____.
[<A>]	2
Câu 98.
[U]	Giả sử có danh sách liên kết đơn với n=6 nút, bạn cần đếm số lượng phần tử chẵn. Nếu mỗi phép kiểm tra giá trị cần 1 bước, số bước duyệt tối thiểu để hoàn tất là ____.
[<A>]	6
Câu 99.
[U]	Trong một danh sách liên kết đôi có 4 phần tử, bạn muốn duyệt danh sách theo chiều ngược lại. Số bước cần thực hiện là ____.
[<A>]	3
Câu 100.
[U]	Trong danh sách liên kết đơn, để chèn phần tử vào sau nút có con trỏ p, ta cần bao nhiêu phép gán nếu không dùng thư viện?
[<A>]	2
Câu 101.
[AP]	struct Node {
    int data;
    Node* next;
};

int count(Node* head) {
    int cnt = 0;
    while (head != NULL) {
        cnt++;
        head = head->next;
    }
    return cnt;
}
Cho danh sách có 5 nút, giá trị trả về của hàm count(head) là ____.
[<A>]	5
Câu 102.
[AP]	void insertHead(Node* &head, int x) {
    Node* newNode = new Node{x, head};
    head = newNode;
}
Sau khi gọi insertHead() 3 lần trên danh sách ban đầu rỗng, số nút trong danh sách là ____.
[<A>]	3
Câu 103.
[AP]	int sum(Node* head) {
    int s = 0;
    while (head != NULL) {
        s += head->data;
        head = head->next;
    }
    return s;
}
Cho danh sách liên kết có các giá trị lần lượt là {1, 2, 3, 4}, khi gọi hàm sum() thì giá trị trả về là ____.
[<A>]	10
Câu 104.
[AP]	int countEven(Node* head) {
    int c = 0;
    while (head) {
        if (head->data % 2 == 0) c++;
        head = head->next;
    }
    return c;
}
Với danh sách liên kết có các giá trị lần lượt là {1, 4, 6, 7, 8}, khi gọi hàm countEven() giá trị trả về là ____.
[<A>]	3
Câu 105.
[AP]	void deleteHead(Node* &head) {
    if (head != NULL) {
        Node* temp = head;
        head = head->next;
        delete temp;
    }
}
Cho danh sách ban đầu có 4 nút, sau 2 lần gọi deleteHead(head), danh sách còn lại có ____ nút.
[<A>]	2
Câu 106.
[AP]	int countCircular(Node* head) {
    if (!head) return 0;
    Node* temp = head;
    int cnt = 1;
    while (temp->next != head) {
        cnt++;
        temp = temp->next;
    }
    return cnt;
}
Cho danh sách vòng có 6 nút, giá trị trả về khi gọi hàm countCircular() là ____.
[<A>]	6
Câu 107.
[AP]	int stepsToLast(Node* head) {
    int steps = 0;
    while (head && head->next != NULL) {
        steps++;
        head = head->next;
    }
    return steps;
}
Với danh sách có 7 phần tử, khi gọi hàm stepsToLast() thì số bước đến phần tử cuối là ____.
[<A>]	6
Câu 108.
[AP]	void insertTail(Node* &head, int x) {
    Node* newNode = new Node{x, NULL};
    if (!head) head = newNode;
    else {
        Node* temp = head;
        while (temp->next != NULL) temp = temp->next;
        temp->next = newNode;
    }
}
Nếu gọi hàm insertTail() 4 lần trên danh sách rỗng, danh sách có ____ nút.
[<A>]	4
Câu 109.
[AP]	int countGreater(Node* head) {
    int cnt = 0;
    while (head) {
        if (head->data > 5) cnt++;
        head = head->next;
    }
    return cnt;
}
Cho danh sách liên kết có các giá trị lần lượt là {2, 8, 5, 6, 1}, khi gọi hàm countGreater() thì giá trị trả về là ____.
[<A>]	2
Câu 110.
[AP]	struct Node {
    int data;
    Node* prev;
    Node* next;
};
Với danh sách liên kết đôi gồm 5 nút, có tổng cộng ____ con trỏ trỏ đến NULL.
[<A>]	2
Câu 111.
[AN]	int countToValue(Node* head, int x) {
    int steps = 0;
    while (head != NULL && head->data != x) {
        steps++;
        head = head->next;
    }
    return steps;
}
Cho danh sách {2, 4, 6, 8, 10}, gọi countToValue(head, 8). Giá trị trả về là ____.
[<A>]	3
Câu 112.
[AN]	void insertMiddle(Node* head, int pos, int x) {
    Node* newNode = new Node{x, NULL};
    Node* temp = head;
    for (int i = 1; i < pos - 1 && temp != NULL; i++) {
        temp = temp->next;
    }
    if (temp != NULL) {
        newNode->next = temp->next;
        temp->next = newNode;
    }
}
Cho danh sách liên kết ban đầu có 4 nút, sau khi gọi hàm insertMiddle() chèn vào vị trí thứ 3, số nút là ____.
[<A>]	5
Câu 113.
[AN]	void deleteAfter(Node* head, int x) {
    while (head && head->data != x) {
        head = head->next;
    }
    if (head && head->next) {
        Node* temp = head->next;
        head->next = temp->next;
        delete temp;
    }
}
Cho danh sách liên kết có các giá trị lần lượt là {1, 2, 3, 4, 5}, sau khi gọi deleteAfter(head, 3), phần tử bị xóa có giá trị là ____.
[<A>]	4
Câu 114.
[AN]	int countDiv3(Node* head) {
    int cnt = 0;
    while (head) {
        if (head->data % 3 == 0) cnt++;
        head = head->next;
    }
    return cnt;
}
Cho danh sách liên kết có các giá trị lần lượt là {3, 5, 6, 7, 9}, khi gọi hàm countDiv3()thì kết quả là ____.
[<A>]	3
Câu 115.
[AN]	void deleteHead(Node* &head) {
    if (head) {
        Node* temp = head;
        head = head->next;
        delete temp;
    }
}
Cho danh sách có 6 phần tử, sau 2 lần gọi deleteHead(head), số phần tử còn lại là ____.
[<A>]	4
Câu 116.
[AN]	int reverseTraverse(Node* tail) {
    int count = 0;
    while (tail != NULL) {
        count++;
        tail = tail->prev;
    }
    return count;
}
Nếu danh sách đôi có 5 nút, hàm trên trả về ____.
[<A>]	5
Câu 117.
[AN]	Node* reverseList(Node* head) {
    Node* prev = NULL, *curr = head, *next = NULL;
    while (curr != NULL) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
Cho danh sách có 4 nút, số lần gán curr->next = prev được thực hiện là ____.
[<A>]	4
Câu 118.
[AN]	int search(Node* head, int x) {
    int steps = 0;
    while (head != NULL) {
        steps++;
        if (head->data == x) break;
        head = head->next;
    }
    return steps;
}
Cho danh sách liên kết có các giá trị lần lượt là {1, 3, 5}, khi gọi search(head, 9) thì giá trị trả về là ____.
[<A>]	3
Câu 119.
[AN]	int countSkipped(Node* head, int x) {
    int count = 0;
    while (head && head->data != x) {
        count++;
        head = head->next;
    }
    return count;
}
Cho danh sách {10, 20, 30, 40}, gọi countSkipped(head, 30) trả về ____.
[<A>]	2
Câu 120.
[AN]	void insertIfEmpty(Node* &head, int x) {
    if (!head) head = new Node{x, NULL};
}
Gọi insertIfEmpty(head, 10) hai lần liên tiếp trên danh sách rỗng ban đầu. Sau đó, danh sách có ____ nút.
[<A>]	1
Câu 121. [R]	Câu hỏi: Cho danh sách liên kết đơn ban đầu chứa các phần tử theo thứ tự: 5 -> 10 -> 15. Sau khi chèn thêm phần tử 20 vào cuối danh sách, dãy giá trị các nút là: ______.
[<A>]	5,10,15,20
Câu 122.
[R]	Cho danh sách liên kết đơn chứa các phần tử: 2 -> 4 -> 6 -> 8. Nếu ta duyệt danh sách từ đầu đến cuối và in ra giá trị các phần tử, dãy số in ra là: ______.
[<A>]	2,4,6,8
Câu 123.
[R]	Cho danh sách liên kết đơn chứa các phần tử: 1 -> 3 -> 5 -> 7. Nếu xóa phần tử đầu danh sách, dãy giá trị còn lại là: ______.
[<A>]	3,5,7
Câu 124.
[R]	Danh sách liên kết đơn chứa các giá trị 9 -> 7 -> 5 -> 3 -> 1. Nếu ta đảo ngược danh sách này, dãy số sau khi đảo là: ______.
[<A>]	1,3,5,7,9
Câu 125.
[R]	Cho danh sách liên kết đơn chứa các phần tử chẵn từ 2 đến 10. Khi thêm các phần tử theo thứ tự tăng dần, dãy giá trị là: ______.
[<A>]	2,4,6,8,10
Câu 126.
[R]	Cho danh sách liên kết đơn chứa các phần tử: 4 -> 8 -> 12. Nếu chèn thêm phần tử 2 vào đầu danh sách, dãy số trở thành: ______.
[<A>]	2,4,8,12
Câu 127.
[R]	Danh sách liên kết đơn ban đầu là 10 -> 20 -> 30 -> 40. Nếu xóa phần tử cuối cùng, danh sách còn lại là: ______.
[<A>]	10,20,30
Câu 128.
[R]	Cho danh sách liên kết đơn được tạo bởi việc chèn tuần tự các số lẻ từ 1 đến 9 vào đầu danh sách, dãy kết quả sau cùng là: ______.
[<A>]	9,7,5,3,1
Câu 129.
[R]	Cho danh sách liên kết chứa: 3 -> 6 -> 9 -> 12. Sau khi thêm 15 vào giữa hai phần tử 12 và NULL, danh sách trở thành: ______.
[<A>]	3,6,9,12,15
Câu 130.
[R]	Cho danh sách liên kết đơn 1 -> 2 -> 3 -> 4 -> 5. Nếu ta in ra các phần tử có chỉ số chẵn (bắt đầu từ 0), dãy số in ra là: ______.
[<A>]	1,3,5
Câu 131.
[U]	Cho danh sách liên kết 2 -> 4 -> 6 -> 8 -> 10. Sau khi xóa phần tử có giá trị chẵn lớn nhất, danh sách còn lại là: ______.
[<A>]	2,4,6,8
Câu 132.
[U]	Cho danh sách liên kết 1 -> 3 -> 5 -> 7 -> 9. Sau khi thêm phần tử 6 vào vị trí sau phần tử 5, dãy mới là: ______.
[<A>]	1,3,5,6,7,9
Câu 133.
[U]	Duyệt danh sách 5 -> 10 -> 15 -> 20 và chỉ in ra các phần tử chia hết cho 10. Dãy kết quả là: ______.
[<A>]	10,20
Câu 134.
[U]	Cho danh sách liên kết 100 -> 80 -> 60 -> 40 -> 20. Sau khi loại bỏ tất cả các phần tử nhỏ hơn 50, danh sách còn lại là: ______.
[<A>]	100,80,60
Câu 135.
[U]	Cho danh sách 1 -> 2 -> 3 -> 4 -> 5 -> 6. Nếu ta đảo thứ tự các phần tử lẻ trong danh sách nhưng giữ nguyên vị trí phần tử chẵn, dãy kết quả là: ______.
[<A>]	5,2,3,4,1,6
Câu 136.
[U]	Cho danh sách liên kết 9 -> 7 -> 5 -> 3 -> 1. Sau khi sắp xếp lại danh sách theo thứ tự tăng dần, dãy kết quả là: ______.
[<A>]	1,3,5,7,9
Câu 137.
[U]	Cho danh sách liên kết 2 -> 3 -> 4 -> 5 -> 6 -> 7. Nếu xóa các phần tử ở vị trí lẻ (đếm từ 0), dãy kết quả là: ______.
[<A>]	2,4,6
Câu 138.
[U]	Cho danh sách 11 -> 22 -> 33 -> 44 -> 55. Nếu chỉ in ra các phần tử có chỉ số chia hết cho 2 (vị trí: 0, 2, 4...), dãy kết quả là: ______.
[<A>]	11,33,55
Câu 139.
[U]	Cho danh sách 1 -> 2 -> 3 -> 4 -> 5 -> 6. Nếu loại bỏ các phần tử có giá trị chia hết cho 3, danh sách còn lại là: ______.
[<A>]	1,2,4,5
Câu 140.
[U]	Cho danh sách 8 -> 6 -> 7 -> 3 -> 9. Sau khi chèn phần tử 5 vào giữa 6 và 7, danh sách trở thành: ______.
[<A>]	8,6,5,7,3,9
Câu 141.
[AP]	Cho danh sách liên kết rỗng, thực hiện các thao tác: chèn 3 vào đầu, chèn 5 vào đầu, chèn 7 vào đầu. Sau các thao tác, dãy kết quả là: ______.
[<A>]	7,5,3
Câu 142.
[AP]	Cho danh sách 1 -> 2 -> 3. Thực hiện thao tác: chèn 4 sau nút có giá trị 2, sau đó chèn 5 sau nút có giá trị 4. Dãy kết quả là: ______.
[<A>]	1,2,4,5,3
Câu 143.
[AP]	Cho danh sách 10 -> 20 -> 30 -> 40. Thực hiện các thao tác: xóa nút đầu, chèn 15 vào đầu, xóa nút cuối. Dãy kết quả là: ______.
[<A>]	15,20,30
Câu 144.
[AP]	Viết hàm tính tổng các phần tử trong danh sách 5 -> 10 -> 15 -> 20. Giá trị cần in ra là: ______.
[<A>]	50
Câu 145.
[AP]	Cho danh sách 4 -> 6 -> 8 -> 10. Viết đoạn code lặp để nhân đôi giá trị mỗi phần tử. Dãy kết quả sau phép nhân là: ______.
[<A>]	8,12,16,20
Câu 146.
[AP]	Xác định dãy số in ra sau khi chương trình sau chạy.
typedef struct Node {
    int data;
    struct Node *next;
} Node;

void printList(Node *head) {
    while (head != NULL) {
        printf("%d,", head->data);
        head = head->next;
    }
}

int main() {
    Node a = {3, NULL};
    Node b = {2, &a};
    Node c = {1, &b};
    printList(&c);
    return 0;
}
Dãy số được in ra là: ______.
[<A>]	1,2,3
Câu 147.
[AP]	Sau khi thực hiện thao tác thêm nút mới vào giữa danh sách, dãy giá trị in ra là _____.
Node *head = malloc(sizeof(Node));
head->data = 1;
head->next = malloc(sizeof(Node));
head->next->data = 3;
head->next->next = NULL;

// Chèn giá trị 2 sau head
Node *temp = malloc(sizeof(Node));
temp->data = 2;
temp->next = head->next;
head->next = temp;

printList(head);
[<A>]	1,2,3
Câu 148.
[AP]	Đoạn code sau thực hiện thêm 3 phần tử vào đầu danh sách. Dãy số được in ra là: ______.
Node *head = NULL;

for (int i = 1; i <= 3; i++) {
    Node *newNode = malloc(sizeof(Node));
    newNode->data = i;
    newNode->next = head;
    head = newNode;
}

printList(head);
[<A>]	3,2,1
Câu 149.
[AP]	Tính tổng các phần tử trong danh sách sau. Kết quả in ra là: ______.
Node *a = malloc(sizeof(Node));
a->data = 10;
a->next = malloc(sizeof(Node));
a->next->data = 20;
a->next->next = malloc(sizeof(Node));
a->next->next->data = 30;
a->next->next->next = NULL;

int sum = 0;
Node *p = a;
while (p != NULL) {
    sum += p->data;
    p = p->next;
}

printf("%d\n", sum);
[<A>]	60
Câu 150.
[AP]	Sau khi xóa nút đầu tiên, dãy số còn lại trong danh sách là ________.
Node *head = malloc(sizeof(Node));
head->data = 5;
head->next = malloc(sizeof(Node));
head->next->data = 10;
head->next->next = malloc(sizeof(Node));
head->next->next->data = 15;
head->next->next->next = NULL;

// Xoá nút đầu
Node *temp = head;
head = head->next;
free(temp);

printList(head);
[<A>]	10,15
Câu 151.
[AN]	Dãy số được in ra ở đoạn chương trình sau là: ______.
Node *head = malloc(sizeof(Node));
head->data = 1;
head->next = malloc(sizeof(Node));
head->next->data = 2;
head->next->next = malloc(sizeof(Node));
head->next->next->data = 3;
head->next->next->next = NULL;

// Đảo danh sách
Node *prev = NULL, *curr = head, *next;
while (curr != NULL) {
    next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
}

printList(prev); // In danh sách sau khi đảo
[<A>]	3,2,1
Câu 152.
[AN]	Phân tích kết quả sau khi xoá phần tử có giá trị lớn nhất.
Node *head = createList(4, 9, 2, 7); // Tạo danh sách: 4 -> 9 -> 2 -> 7
deleteMax(&head);
printList(head);
Dãy số còn lại là: ______.
[<A>]	4,2,7
Câu 153.
[AN]	Xác định dãy kết quả sau khi thực hiện đoạn chương trình sau. 
Node *head = createList(1,2,3,4,5,6); // 1 -> 2 -> 3 -> 4 -> 5 -> 6
deleteIfEven(&head);
printList(head);
Dãy số còn lại là: ______.
[<A>]	1,3,5
Câu 154.
[AN]	Hãy xác định dãy kết quả in ra sau khi chạy đoạn chương trình sau.
Node *head = malloc(sizeof(Node));
head->data = 10;
head->next = malloc(sizeof(Node));
head->next->data = 20;
head->next->next = malloc(sizeof(Node));
head->next->next->data = 30;
head->next->next->next = NULL;

Node *temp = head->next;
Node *toDelete = temp->next;
temp->next = toDelete->next;
free(toDelete);

printList(head);
Dãy số được in ra là: ______.
[<A>]	10,20
Câu 155.
[AN]	Hãy xác định dãy kết quả in ra sau khi chạy đoạn chương trình sau.
Node *head = malloc(sizeof(Node));
head->data = 5;
head->next = malloc(sizeof(Node));
head->next->data = 15;
head->next->next = malloc(sizeof(Node));
head->next->next->data = 10;
head->next->next->next = malloc(sizeof(Node));
head->next->next->next->data = 20;
head->next->next->next->next = NULL;

Node *curr = head, *prev = NULL;
while (curr != NULL) {
    if (curr->data > 10) {
        Node *toDelete = curr;
        if (prev == NULL) {
            head = curr->next;
        } else {
            prev->next = curr->next;
        }
        curr = curr->next;
        free(toDelete);
    } else {
        prev = curr;
        curr = curr->next;
    }
}

printList(head);
Dãy số được in ra là: ______.
[<A>]	5,10
