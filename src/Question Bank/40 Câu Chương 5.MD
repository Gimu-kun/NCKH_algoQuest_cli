Chương 5. 	Cây nhị phân tìm kiếm
Câu 1. [R]	Số lượng con tối đa mà một nút trong cây nhị phân tìm kiếm có thể có là: ___
[<A>]	2
Câu 2.
[R]	Trong cây nhị phân tìm kiếm, số lượng phép so sánh tối đa cần để tìm một phần tử trong cây có chiều cao h=5 là: ___
[<A>]	5
Câu 3.
[R]	Cây nhị phân tìm kiếm với 1 nút có bao nhiêu lá? ___
[<A>]	1
Câu 4.
[R]	Cây nhị phân tìm kiếm đầy đủ (full) với 3 tầng sẽ có tổng số nút là: ___

[<A>]	7
Câu 5.
[R]	Trong phép duyệt in-order cây nhị phân tìm kiếm, nếu cây có 6 phần tử, số phần tử được in ra là: ___
[<A>]	6
Câu 6.
[R]	Trong cây nhị phân tìm kiếm, mỗi nút có giá trị nhỏ hơn gốc nằm ở cây con bên: ___ (theo quy ước: trái là 0, phải là 1)
[<A>]	0
Câu 7.
[R]	Số lượng cách hoán vị khác nhau để tạo ra cùng một cây BST với 3 phần tử (1, 2, 3) là: ___
[<A>]	5
Câu 8.
[R]	Trong cây BST chứa 15 phần tử duy nhất, số lượng phần tử tối đa có thể là lá là: ___
[<A>]	8
Câu 9.
[R]	Trong cây BST rỗng, số bước cần để tìm một phần tử bất kỳ là: ___
[<A>]	0
Câu 10.
[R]	Chiều cao tối thiểu của một cây BST có 31 nút là: ___
[<A>]	5
Câu 11.
[U]	Trong cây nhị phân tìm kiếm, số phép so sánh tối đa cần thực hiện để tìm một nút trong cây có dạng hoàn toàn cân bằng và chứa 15 nút là: ___
[<A>]	4
Câu 12.
[U]	Trong một cây BST, nếu thực hiện phép duyệt in-order, thì phần tử nhỏ nhất sẽ được in ra ở vị trí thứ: ___
[<A>]	1
Câu 13.
[U]	Cho một cây BST chứa các phần tử duy nhất: 50, 30, 70, 20, 40, 60, 80. Khi duyệt theo in-order, phần tử thứ 5 được in ra là: ___
[<A>]	60
Câu 14.
[U]	Trong một cây BST gồm 7 nút được tạo từ dãy [10, 5, 15, 2, 7, 12, 17], số lượng nút có chỉ một con là: ___
[<A>]	0
Câu 15.
[U]	Khi chèn dãy giá trị: [8, 3, 10, 1, 6, 14, 4, 7, 13] vào một cây BST, số lượng nút không có cây con bên trái là: ___
[<A>]	4
Câu 16.
[U]	Trong cây BST có 3 tầng (root là tầng 0), số nút tối đa có thể có ở tầng thứ 2 là: ___
[<A>]	4
Câu 17.
[U]	Một cây BST có 31 nút và hoàn toàn cân bằng. Số lượng nút lá trong cây là: ___
[<A>]	16
Câu 18.
[U]	Trong cây BST, số phép so sánh cần thực hiện để tìm phần tử nhỏ nhất trong cây có chiều cao 4 là: ___
[<A>]	4
Câu 19.
[U]	Một cây BST gồm 15 nút có thể có tối đa bao nhiêu nút lá? ___
[<A>]	8
Câu 20.
[U]	Cho cây BST được tạo bởi dãy chèn: [30, 20, 40, 10, 25, 35, 50]. Số nút có cả hai cây con (trái và phải) là: ___
[<A>]	3
Câu 21.
[AP]	struct Node {
    int data;
    Node* left;
    Node* right;
};

int countNodes(Node* root) {
    if (!root) return 0;
    return 1 + countNodes(root->left) + countNodes(root->right);
}
// Cây BST: 30, 20, 40, 10, 25

Số lượng nút trong cây là: ___
[<A>]	5
Câu 22.
[AP]	int height(Node* root) {
    if (!root) return 0;
    return 1 + max(height(root->left), height(root->right));
}
// Cây BST từ: 50, 30, 20, 40, 70, 60

Chiều cao của cây là: ___
[<A>]	3
Câu 23.
[AP]	bool search(Node* root, int x, int& count) {
    count = 0;
    while (root) {
        count++;
        if (x == root->data) return true;
        if (x < root->data) root = root->left;
        else root = root->right;
    }
    return false;
}
// Cây BST: 100, 50, 150, 30, 70
// Tìm x = 70

Số phép so sánh thực hiện là: ___
[<A>]	3
Câu 24.
[AP]	int countLeaf(Node* root) {
    if (!root) return 0;
    if (!root->left && !root->right) return 1;
    return countLeaf(root->left) + countLeaf(root->right);
}
// Cây BST từ: 20, 10, 30, 5, 15, 25

Số lá trong cây là: ___
[<A>]	3
Câu 25.
[AP]	void inOrder(Node* root) {
    if (root) {
        inOrder(root->left);
        cout << root->data << " ";
        inOrder(root->right);
    }
}
// Cây từ: 40, 20, 60, 10, 30, 50

Số nguyên được in ra thứ ba là: ___
[<A>]	30
Câu 26.
[AP]	int countGreater(Node* root, int x) {
    if (!root) return 0;
    if (root->data > x)
        return 1 + countGreater(root->left, x) + countGreater(root->right, x);
    else
        return countGreater(root->right, x);
}
// Cây BST: 50, 30, 70, 60, 80
// x = 55

Số nút có giá trị lớn hơn 55 là: ___
[<A>]	3
Câu 27.
[AP]	int countInternal(Node* root) {
    if (!root || (!root->left && !root->right)) return 0;
    return 1 + countInternal(root->left) + countInternal(root->right);
}
// Cây BST từ: 40, 20, 60, 10, 30, 50, 70

Số nút nội bộ (có ít nhất 1 con) là: ___
[<A>]	3
Câu 28.
[AP]	void insert(Node*& root, int val) {
    if (!root) {
        root = new Node{val, nullptr, nullptr};
        return;
    }
    if (val < root->data)
        insert(root->left, val);
    else
        insert(root->right, val);
}

Sau khi chèn các số: 50, 25, 75, 20, 30, giá trị tại root->left->right là: ___
[<A>]	30
Câu 29.
[AP]	void deleteNode(Node*& root, int val); // Xóa nút BST
Cây BST: 40, 20, 60, 10, 30. Sau khi xóa 20, cây còn ___ nút.
[<A>]	4
Câu 30.
[AP]	void preOrder(Node* root) {
    if (root) {
        cout << root->data << " ";
        preOrder(root->left);
        preOrder(root->right);
    }
}

Cây BST: 15, 10, 20, 5, 12. Số đầu tiên in ra là: ___
[<A>]	15
Câu 31.
[AN]	// Chèn vào BST: 50, 30, 70, 20, 40, 60, 80
// Hàm đếm số phép gọi đệ quy trong in-order traversal

int count = 0;
void inOrder(Node* root) {
    if (root) {
        inOrder(root->left);
        count++;
        inOrder(root->right);
    }
}
Sau khi gọi inOrder(root), giá trị của count là: ___
[<A>]	7
Câu 32.
[AN]	// Cây BST: 100, 50, 150, 25, 75, 125, 175
int maxDepth(Node* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}
Độ sâu tối đa của cây là: ___
[<A>]	3
Câu 33.
[AN]	// Cây BST: 60, 40, 20, 50, 80, 70, 90
// Đếm số nút có đúng 1 con

int countOneChild(Node* root) {
    if (!root) return 0;
    int left = countOneChild(root->left);
    int right = countOneChild(root->right);
    if ((root->left && !root->right) || (!root->left && root->right))
        return 1 + left + right;
    return left + right;
}
Số nút có đúng 1 con là: ___
[<A>]	0
Câu 34.
[AN]	// Cây BST: 50, 30, 70, 20, 40, 60, 80
// Duyệt pre-order, vị trí thứ 5 in ra là:

void preOrder(Node* root) {
    if (root) {
        cout << root->data << " ";
        preOrder(root->left);
        preOrder(root->right);
    }
}
Giá trị thứ 5 được in ra là: ___
[<A>]	60
Câu 35.
[AN]	// Cây BST: 15, 10, 20, 5, 12, 17, 25
// Hàm đếm tổng số nút có giá trị > 12

int countGreater(Node* root, int val) {
    if (!root) return 0;
    int count = (root->data > val) ? 1 : 0;
    return count + countGreater(root->left, val) + countGreater(root->right, val);
}
Giá trị trả về của countGreater(root, 12) là: ___
[<A>]	4
Câu 36.
[AN]	// Cây BST: 30, 20, 40, 10, 25, 35, 50
// Đếm số phép so sánh khi tìm kiếm giá trị 25

int search(Node* root, int x) {
    int cmp = 0;
    while (root) {
        cmp++;
        if (x == root->data) break;
        if (x < root->data) root = root->left;
        else root = root->right;
    }
    return cmp;
}
Số phép so sánh khi tìm 25 là: ___
[<A>]	3
Câu 37.
[AN]	// Cây BST: 60, 40, 80, 30, 50, 70, 90

void deleteNode(Node*& root, int key);
Xóa nút 40 (có 2 con bằng hàm deleteNode(). Sau khi xóa, giá trị thay thế node 40 là: ___
[<A>]	50
Câu 38.
[AN]	// Cây BST: 100, 50, 150, 25, 75
// Tổng các nút ở tầng 2 (gốc tầng 0)

int sumLevel(Node* root, int level) {
    if (!root) return 0;
    if (level == 0) return root->data;
    return sumLevel(root->left, level - 1) + sumLevel(root->right, level - 1);
}
Tổng các giá trị ở tầng 2 là: ___
[<A>]	100
Câu 39.
[AN]	// Cây BST: 10, 5, 1, 7, 15, 12, 20
// Số nút có giá trị nằm trong đoạn [6, 18]

int countInRange(Node* root, int low, int high) {
    if (!root) return 0;
    int cnt = 0;
    if (root->data >= low && root->data <= high) cnt++;
    cnt += countInRange(root->left, low, high);
    cnt += countInRange(root->right, low, high);
    return cnt;
}
Kết quả countInRange(root, 6, 18) là: ___
[<A>]	4
Câu 40.
[AN]	// Cây BST: 100, 50, 25, 75, 150, 125, 175
// Đếm số nút có đúng 2 con

int countFull(Node* root) {
    if (!root) return 0;
    int left = countFull(root->left);
    int right = countFull(root->right);
    if (root->left && root->right)
        return 1 + left + right;
    return left + right;
}
Giá trị trả về của countFull(root) là: ___
[<A>]	3
