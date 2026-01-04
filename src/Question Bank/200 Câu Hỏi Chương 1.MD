Chương 1. 	Tổng quan về thuật toán và cấu trúc dữ liệu
Câu 1. [R]	Thuật toán có độ phức tạp thời gian là O(____) được gọi là tuyến tính, nghĩa là thời gian thực hiện tỷ lệ thuận với kích thước đầu vào.
[<A>]		n
Câu 2.
[R]	Độ phức tạp thời gian trong trường hợp tốt nhất của một thuật toán thực hiện đúng 1 thao tác bất kể đầu vào có kích thước bao nhiêu là: ___
[<A>]		O(1)
Câu 3.
[R]	Một thuật toán có độ phức tạp tuyến tính, thì số bước thực hiện theo kích thước đầu vào n được biểu diễn là: ___
[<A>]		O(n)
Câu 4.
[R]	Tổng số bước trong thuật toán có độ phức tạp bậc ba là: ___
[<A>]		O(n^3)
Câu 5.
[R]	Công thức biểu diễn độ phức tạp theo logarit nhị phân là: ___
[<A>]		log₂(n)
Câu 6.
[R]	Tổng số phép gán trong đoạn mã sau là:
for (int i = 0; i < n; ++i)
    count += 2;
Biểu thức cho tổng số phép gán là: ___
[<A>]		2n
Câu 7.
[R]	Nếu một thuật toán có số bước tăng gấp đôi mỗi khi kích thước đầu vào tăng 1, công thức mô tả là: ___
[<A>]		2^n
Câu 8.
[R]	Số bước thực hiện của vòng lặp lồng sau là:
for (int i = 0; i < n; ++i)
    for (int j = 0; j < n; ++j)
        count++;
Biểu thức cho tổng số bước là: ___
[<A>]		n^2
Câu 9.
[R]	Tổng số bước của thuật toán chia đôi đầu vào liên tiếp cho đến khi còn 1 phần tử là: ___
[<A>]		⌊log₂(n)⌋
Câu 10.
[R]	Tổng số bước thực hiện của đoạn mã sau là:
for (int i = 1; i <= n; ++i)
    for (int j = 1; j <= i; ++j)
        count++;
Biểu thức cho tổng số bước là: ___
[<A>]		n(n + 1)/2
Câu 11.
[U]	Khi một thuật toán có 2 vòng lặp lồng nhau, mỗi vòng chạy từ 1 đến n, tổng số bước thực hiện được ước lượng bằng công thức: ___
[<A>]		n^2
Câu 12.
[U]	Cho thuật toán thực hiện lặp liên tiếp với số bước gấp đôi ở mỗi vòng (1, 2, 4, 8, ..., n), tổng số bước có thể được ước lượng gần đúng bởi công thức: ___
[<A>]		2n-1
Câu 13.
[U]	Để ước lượng thời gian thực thi một thuật toán có độ phức tạp tuyến tính, công thức tổng quát cần điền vào là: ___
[<A>]		T(n) = an + b
Câu 14.
[U]	Nếu một thuật toán có độ phức tạp O(log2n), thì số bước sẽ tăng theo công thức: ___
[<A>]		T(n) = log₂(n)
Câu 15.
[U]	Một vòng lặp thực hiện tổng số bước là ∑_(i=1)^n▒i. Biểu thức tương đương của tổng này là: ___
[<A>]		n(n + 1)/2
Câu 16.
[U]	Độ phức tạp không gian của một thuật toán sử dụng một mảng kích thước n và một biến đếm là: ___
[<A>]		O(n)
Câu 17.
[U]	Số lần lặp trong một vòng lặp dạng:
for (int i = 1; i < n; i *= 2)
được ước lượng bởi công thức: ___
[<A>]		⌊log₂(n)⌋
Câu 18.
[U]	Khi biểu diễn thời gian thực thi thuật toán dưới dạng hàm bậc hai, biểu thức có dạng tổng quát là: ___
[<A>]		T(n) = an^2 + bn + c
Câu 19.
[U]	Giả sử một thuật toán cần chia dữ liệu làm 2 phần và xử lý cả hai phần, mỗi lần gọi đệ quy. Biểu thức đệ quy mô tả độ phức tạp là: ___
[<A>]		T(n) = 2·T(n/2) + cn
Câu 20.
[U]	Một thuật toán thực hiện công việc theo dạng:
for (int i = 0; i < n; ++i)
    for (int j = 0; j < log2(n); ++j)
        count++;
Tổng số bước thực hiện được ước lượng bằng biểu thức: ___
[<A>]		nlog₂(n)
Câu 21.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("Teacher Long...");
        }
    }
}
[<A>]		n2
Câu 22.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            printf("Hello");
        }
    }
}
[<A>]		n2
Câu 23.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("Outer loop");
        }
    }
    for (int k = 0; k < n; k++) {
        printf("Separate loop");
    }
}
[<A>]		n2
Câu 24.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    for (int i = 1; i < n; i = i * 2) {
        for (int j = 0; j < n; j++) {
            printf("Processing...");
        }
    }
}
[<A>]		nlogn
Câu 25.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            printf("Working...");
        }
    }
}
[<A>]		n2
Câu 26.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
int method(int n) {
    int sum = 0;
    int i = 0;
    while (i < n) {
        sum = sum + (i * 2);
        i = i + 1;
    }
    return sum;
}
[<A>]		n
Câu 27.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
int method(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            sum += i * j;
        }
    }
    return sum;
}
[<A>]		n2
Câu 28.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
int method(int n) {
    int sum = 0;
    int i = 1;
    while (i < n) {
        sum += i;
        i = i * 2;
    }
    return sum;
}
[<A>]		log2(n)
Câu 29.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
int method(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += i;
    }
    for (int j = 0; j < n; j++) {
        sum += j;
    }
    return sum;
}
[<A>]		n
Câu 30.
[AP]	Đoạn mã sau có độ phức tạp thời gian là O(____):
int method(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            sum += i * j;
        }
    }
    return sum;
}
[<A>]		n2
Câu 31.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    int i = 0;
    while (i < n) {
        int j = 0;
        while (j < n / 2) {
            sum += i + j;
            j++;
        }
        i++;
    }
    return sum;
}
[<A>]		n2
Câu 32.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j += 2) {
            sum += i * j;
        }
    }
    return sum;
}
[<A>]		n2
Câu 33.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) {
                sum += i + j;
            }
        }
    }
    return sum;
}
[<A>]		n
Câu 34.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    int i = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            sum += i * j;
            j++;
        }
        i++;
    }
    return sum;
}
[<A>]		n2
Câu 35.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    for (int i = 1; i < n; i *= 2) {
        for (int j = 0; j < n; j++) {
            sum += i + j;
        }
    }
    return sum;
}
[<A>]		nlogn
Câu 36.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = j; k < n; k++) {
                sum += i + j + k;
            }
        }
    }
    return sum;
}
[<A>]		n3
Câu 37.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    int i = 0;
    while (i < n) {
        sum += i;
        i += 3;
    }
    return sum;
}
[<A>]		n
Câu 38.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if ((i + j) % 3 == 0) {
                sum += i + j;
            }
        }
    }
    return sum;
}
[<A>]		n2
Câu 39.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += i;
        for (int j = i; j < n; j++) {
            sum += j;
        }
    }
    return sum;
}
[<A>]		n2
Câu 40.
[AN]	Đoạn mã sau có độ phức tạp thời gian là O(____):
void method(int n) {
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n / i; j++) {
            sum += i * j;
        }
    }
    return sum;
}
[<A>]		nlogn
Câu 41. [R]	Phương pháp thuật toán ___ xây dựng lời giải tối ưu bằng cách chọn từng bước tốt nhất tại mỗi thời điểm, không xét toàn cục.
[<A>]		tham lam
Câu 42.
[R]	Trong mô hình RAM, mỗi phép toán cơ bản như cộng, so sánh, hoặc gán được gán giá trị độ phức tạp bằng ___ đơn vị thời gian.
[<A>]		1
Câu 43.
[R]	Thuật toán có độ phức tạp thời gian ___ được coi là lý tưởng vì số bước không phụ thuộc kích thước đầu vào.
[<A>]		O(1)
Câu 44.
[R]	Giai đoạn đầu tiên trong quy trình thiết kế thuật toán là ___, nhằm xác định yêu cầu và đặc tả bài toán.
[<A>]		phân tích bài toán
Câu 45.
[R]	Để mô tả thuật toán trước khi lập trình, người ta thường sử dụng ___, là dạng ngôn ngữ giả gần với ngôn ngữ lập trình.
[<A>]		mã giả (hoặc pseudocode)
Câu 46.
[R]	Ký hiệu ___ dùng để mô tả giới hạn dưới (best case) của độ phức tạp thời gian.
[<A>]		omega (hoặc Ω)
Câu 47.
[R]	Phương pháp giải bài toán bằng cách chia nhỏ, lưu kết quả các bước con là ___.
[<A>]		quy hoạch động (hoặc “dynamic programming”)
Câu 48.
[R]	Ngoài thời gian thực thi, một tiêu chí quan trọng khác để đánh giá thuật toán là ___.
[<A>]		bộ nhớ (hoặc “không gian”)
Câu 49.
[R]	Kỹ thuật kiểm tra thuật toán bằng cách chạy thử với đầu vào cụ thể là ___.
[<A>]		kiểm thử (hoặc “testing”)
Câu 50.
[R]	Mô hình ___ giả định mỗi phép toán cơ bản có độ phức tạp bằng 1, thường dùng để phân tích thuật toán.
[<A>]		RAM (hoặc “mô hình RAM”)
Câu 51.
[U]	Ký hiệu ___ được dùng để mô tả độ phức tạp thời gian trong trường hợp xấu nhất của thuật toán.
[<A>]		O (hoặc “Big-O”)
Câu 52.
[U]	Phương pháp thiết kế thuật toán ___ sử dụng kết quả của các bài toán con đã giải để tránh tính toán lặp lại.
[<A>]		quy hoạch động (hoặc “dynamic programming”)
Câu 53.
[U]	Ký hiệu ___ biểu diễn độ phức tạp trung bình của thuật toán trong một không gian đầu vào xác suất đều.
[<A>]		Θ (Theta)
Câu 54.
[U]	Phân tích thuật toán theo ___ cho phép đánh giá thuật toán một cách tổng quát, không phụ thuộc phần cứng.
[<A>]		bậc độ phức tạp (hoặc “phân tích lý thuyết”)
Câu 55.
[U]	Một thuật toán được xem là hợp lệ nếu nó ___ sau một số bước hữu hạn.
[<A>]		kết thúc (hoặc “dừng”, hoặc “hoàn thành”)
Câu 56.
[U]	Chiến lược thuật toán ___ chia bài toán thành các phần nhỏ, giải từng phần và kết hợp lời giải.
[<A>]		chia để trị (hoặc "divide and conquer")
Câu 57.
[U]	Phân tích thuật toán trong trường hợp có đầu vào "xấu nhất" nhằm đảm bảo hiệu quả ổn định được gọi là phân tích theo ___.
[<A>]		trường hợp tệ nhất (hoặc “worst-case”)
Câu 58.
[U]	Trong bài toán mà lời giải tối ưu cục bộ dẫn đến tối ưu toàn cục, ta có thể áp dụng thuật toán ___.
[<A>]		tham lam (hoặc “greedy”)
Câu 59.
[U]	Một cách trực quan để mô tả luồng điều khiển của thuật toán là vẽ ___.
[<A>]		lưu đồ (hoặc “flowchart”)
Câu 60.
[U]	Trong các cấu trúc dữ liệu cơ bản, ___ là loại lưu trữ phần tử có chỉ số và cho phép truy cập trực tiếp theo chỉ số.
[<A>]		mảng (hoặc “array”)
Câu 61.
[AP]	Hãy xác định kiểu dữ liệu phù hợp của hàm dưới đây.
________ isNegative(int x) {
    return x < 0;
}
[<A>]		bool
Câu 62.
[AP]	Một thuật toán có thể được phân tích theo ba trường hợp: tốt nhất, trung bình, và ___.
[<A>]		tệ nhất (hoặc “worst-case”)
Câu 63.
[AP]	Trong một hàm, nếu nó gọi lại chính nó với đầu vào nhỏ hơn, kỹ thuật được dùng là ___.
[<A>]		đệ quy (hoặc “recursion”)
Câu 64.
[AP]	Độ phức tạp thời gian của thao tác này là: __________
int x = a + b;
[<A>]		O(1)
Câu 65.
[AP]	Để tính √x, bạn cần dùng hàm ___ trong thư viện cmath.
[<A>]		sqrt
Câu 66.
[AP]	Bạn cần lưu trạng thái có thể là READY, RUNNING, FINISHED. 
Kiểu dữ liệu phù hợp là: __________
[<A>]		enum
Câu 67.
[AP]	Khi bạn cần lặp đúng 100 lần, bạn chọn loại vòng lặp phù hợp trong C++ là  __________
[<A>]		for
Câu 68.
[AP]	Để kiểm tra hai điều kiện x > 0 và y > 0 đồng thời, bạn cần dùng phép toán logic phù hợp là __________.
[<A>]		&& (hoặc and)
Câu 69.
[AP]	Một thuật toán phải luôn tạo ra kết quả xác định sau khi thực hiện trên đầu vào hợp lệ. Tính chất đảm bảo thuật toán tạo ra kết quả rõ ràng là: __________.
[<A>]		xác định (hoặc “deterministic”)
Câu 70.
[AP]	Khi bạn chạy thử chương trình và theo dõi giá trị từng biến trong mỗi bước, bạn đang dùng phương pháp __________.
[<A>]		dò bước (hoặc “trace”)
Câu 71.
[AN]	Một thuật toán cho kết quả sai nếu dùng kiểu int, nhưng cho kết quả đúng nếu dùng float. Nguyên nhân là do thuật toán phụ thuộc vào yếu tố ___.
[<A>]		kiểu dữ liệu
Câu 72.
[AN]	Một thuật toán cho kết quả đúng nhưng tiêu tốn thời gian, bộ nhớ rất lớn. Thuật toán không đảm bảo tính: _________
[<A>]		hiệu quả
Câu 73.
[AN]	Một thuật toán xử lý một cách tuần tự từ đầu vào đến đầu ra, không có lặp hoặc phân nhánh. Đây là cấu trúc điều khiển dạng: __________.
[<A>]		tuần tự (hoặc “sequence”)
Câu 74.
[AN]	Trong một thuật toán, bạn kiểm tra một điều kiện và lựa chọn nhánh tương ứng. Đây là cấu trúc điều khiển: __________.
[<A>]		rẽ nhánh (hoặc “chọn lựa”, “selection”)
Câu 75.
[AN]	Một đoạn chương trình xử lý đầu vào kích thước lớn nhưng dùng thêm nhiều biến phụ và bộ nhớ. Khi phân tích thuật toán này, bạn cần xem xét độ phức tạp về __________.
[<A>]		không gian (hoặc “bộ nhớ”, “space”)
Câu 76.
[AN]	Khi phân tích một thuật toán, bạn thấy một số bước không cần thiết và có thể loại bỏ. Quá trình này gọi là: __________.
[<A>]		tối ưu hóa (hoặc "rút gọn thuật toán")
Câu 77.
[AN]	Một thuật toán được xây dựng nhằm áp dụng cho nhiều loại đầu vào, không phụ thuộc vào dạng cụ thể. Thuật toán như vậy được xem là có tính: __________
[<A>]		tổng quát (hoặc “đa năng”, “khái quát hóa”)
Câu 78.
[AN]	Bạn phân tích hai thuật toán cùng giải một bài toán, một cái chạy nhanh nhưng sử dụng nhiều bộ nhớ, cái kia chậm hơn nhưng tiết kiệm tài nguyên. Mối quan hệ giữa hai thuật toán này gọi là sự đánh đổi giữa thời gian và: __________.
[<A>]		không gian (hoặc "bộ nhớ")
Câu 79.
[AN]	Khi thiết kế thuật toán, bạn chọn cách __________ thay vì đệ quy để dễ kiểm soát bộ nhớ và luồng thực thi.
[<A>]		lặp (hoặc “vòng lặp”, “iterative”)
Câu 80.
[AN]	Bạn phân tích một thuật toán được mô tả bằng các bước rõ ràng, có đầu vào xác định và đầu ra rõ ràng. Tuy nhiên, một bước trong thuật toán lại sử dụng thông tin chưa được xác định từ trước. Thuật toán này vi phạm tính: __________.
[<A>]		rõ ràng (hoặc “xác định từng bước”, “xác định thao tác”)
Câu 81. [R]	Để khai báo một mảng nguyên gồm 100 phần tử, cú pháp đúng là:
int ___[100];
[<A>] 		a
Câu 82.
[R]	Để định nghĩa một hằng số nguyên có tên MAX với giá trị 500, dùng cú pháp:
#define ___ ___
[<A>] 		MAX 500
Câu 83.
[R]	Khai báo một hàm compute() trả về số nguyên và không có tham số, cú pháp đúng là:
___ compute() {
    return 0;
}
[<A>] 		int
Câu 84.
[R]	Để khởi tạo biến count có kiểu số nguyên và gán giá trị ban đầu là 0, ta viết:
___ count = 0;
[<A>] 		int
Câu 85.
[R]	Điền cú pháp đúng để lặp từ i = 0 đến i < n:
for (int i = 0; ___; i++) {
    // xử lý
}
[<A>] 		i < n
Câu 86.
[R]	Để kiểm tra xem biến x có bằng 0 hay không, dùng câu lệnh:
if (___)
    cout << "Zero";
[<A>] 		x == 0
Câu 87.
[R]	Dòng lệnh thực hiện cộng i vào biến sum trong mỗi bước lặp là:
sum ___ i;
[<A>] 		+=
Câu 88.
[R]	Để khai báo biến pi có giá trị 3.14 và kiểu số thực, viết:
___ pi = 3.14;
[<A>] 		float
Câu 89.
[R]	Giả sử đã khai báo #include <cmath>. Biểu thức tính log2(n) trong C++ là: 
log2(___);
[<A>] 		n
Câu 90.
[R]	Để in ra dòng chữ "Hello" bằng C++, viết:
___ << "Hello";
[<A>] 		cout
Câu 91.
[U]	Đoạn mã sau tính tổng từ 1 đến nnn. Hãy hoàn thiện biểu thức cộng dồn:
int sum = 0;
for (int i = 1; i <= n; i++) {
    sum ___ i;
}
[<A>] 		+=
Câu 92.
[U]	Hoàn thiện điều kiện lặp trong vòng for để duyệt toàn bộ mảng a có n phần tử:
for (int i = 0; ___; i++) {
    cout << a[i] << " ";
}
[<A>] 		i < n
Câu 93.
[U]	Phân tích đoạn mã sau, hãy hoàn thiện dòng chú thích thể hiện độ phức tạp thời gian:
for (int i = 0; i < n; ++i)
    for (int j = 0; j < n; ++j)
        cout << i << j << endl;

// Độ phức tạp: O(___)
[<A>] 		n^2
Câu 94.
[U]	Điền điều kiện để biến n giảm một nửa cho đến khi còn lại 1:
while (___) {
    n = n / 2;
    steps++;
}
[<A>] 		n > 1
Câu 95.
[U]	Hoàn thiện dòng khai báo hàm factorial(int n) sau:
___ factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
[<A>] 		int
Câu 96.
[U]	Hoàn thiện biểu thức để tính tổng bình phương từ 1 đến n:
int sum = 0;
for (int i = 1; i <= n; ++i)
    sum += ___;
[<A>] 		i * i
Câu 97.
[U]	Điền điều kiện kiểm tra xem biến n có chia hết cho 2 không:
if (n ___ 2 == 0)
    cout << "n la so chan";
[<A>] 		%
Câu 98.
[U]	Hoàn thiện dòng khai báo một hằng số nguyên MAX = 100:
___ int MAX = 100;
[<A>] 		const
Câu 99.
[U]	Cho biến n, hãy viết biểu thức C++ dùng hàm thư viện cmath để tính log2(n):
double res = ___;
[<A>] 		log2(n)
Câu 100.
[U]	Gọi hàm printSum(int a, int b) với các đối số x và y:
___;
[<A>] 		printSum(x, y)
Câu 101.
[AP]	Hoàn thiện vòng lặp để đếm số chữ số của một số nguyên dương n:
int count = 0;
while (n > 0) {
    n = n / 10;
    ___;
}
[<A>] 		count++
Câu 102.
[AP]	Điền điều kiện kiểm tra số chẵn:
int sum = 0;
for (int i = 1; i <= n; i++) {
    if (i ___ 2 == 0)
        sum += i;
}
[<A>] 		%
Câu 103.
[AP]	Hoàn thành câu lệnh tính trung bình của n phần tử trong mảng a[]:
int sum = 0;
for (int i = 0; i < n; ++i)
    sum += a[i];
double avg = ___;
[<A>] 		sum / (double)n
Câu 104.
[AP]	Hàm đã được định nghĩa: int squareSum(int n). Gọi hàm và gán kết quả: int result = ___;
[<A>] 		squareSum(n)
Câu 105.
[AP]	Hoàn thiện biểu thức để tính số bước chia đôi:
int steps = 0;
while (n > 1) {
    n = n / 2;
    steps = ___;
}
[<A>] 		steps + 1
Câu 106.
[AP]	Điền phần thân vòng lặp tính n!:
int fact = 1;
for (int i = 2; i <= n; ++i)
    fact ___;
[<A>] 		*= i
Câu 107.
[AP]	Đoạn chương trình sau có độ phức tạp gần đúng là:
for (int i = 0; i < n; ++i)
    for (int j = 0; j < log2(n); ++j)
        process++;
// Độ phức tạp: O(___)
[<A>] 		n log n
Câu 108.
[AP]	Điền phần cập nhật biến lặp để in các số lẻ từ 1 đến n:
for (int i = 1; i <= n; ___)
    cout << i << " ";
[<A>] 		i += 2
Câu 109.
[AP]	Viết cú pháp cấp phát mảng số nguyên động gồm n phần tử:
int* a = ___;
[<A>] 		new int[n]
Câu 110.
[AP]	Điền từ khóa khai báo cấu trúc Point gồm 2 tọa độ:
___ Point {
    int x, y;
};
[<A>] 		struct
Câu 111.
[AN]	Hãy điền điều kiện đúng vào vòng lặp while để đảm bảo thuật toán dừng đúng thời điểm.
int count = 0;
while (___) {
    n = n / 2;
    count++;
}
[<A>] 		n > 1
Câu 112.
[AN]	Hãy điền biểu thức cập nhật biến i trong vòng for sao cho mỗi phần tử mảng được xử lý đúng một lần.
int total = 0;
for (int i = 0; i < n; ___)
    total += a[i];
[<A>] 		i++
Câu 113.
[AN]	Hãy hoàn thiện điều kiện if để đảm bảo chỉ cộng các số lẻ.
int sum = 0;
for (int i = 1; i < n; i += 2)
    if (___)
        sum += i;
[<A>] 		i % 2 == 1
Câu 114.
[AN]	Đoạn mã tính tổng bình phương các số từ 0 đến n-1. Điền biểu thức còn thiếu để thực hiện đúng yêu cầu thuật toán.
for (int i = 0; i < n; i++)
    sum = sum + ___;
[<A>] 		i * i
Câu 115.
[AN]	Đây là một hàm đệ quy tính giai thừa n!. Mục tiêu là điền đúng biểu thức trả về ở bước đệ quy. Hãy hoàn thiện dòng return còn thiếu.
int factorial(int n) {
    if (n <= 1) return 1;
    return ___;
}
[<A>] 		n * factorial(n - 1)
Câu 116.
[AN]	Hai đoạn mã dưới đây có số bước thực hiện khác nhau. Hãy điền độ phức tạp đúng cho đoạn thứ nhất. Phân tích và điền vào độ phức tạp đúng theo Big-O.
// Đoạn 1
for (int i = 0; i < n; ++i)
    for (int j = 0; j < n; ++j)
        process1++;

// Đoạn 2
for (int i = 0; i < n; ++i)
    process2++;

// Độ phức tạp đoạn 1 là O(___), đoạn 2 là O(n)
[<A>] 		n^2
Câu 117.
[AN]	Thuật toán nhân nhanh bằng cách cộng và chia đôi, tăng gấp đôi. Điền dòng cập nhật b đúng để thực hiện chia đôi.
while (b > 0) {
    if (b % 2 == 1)
        result += a;
    a = a + a;
    b = ___;
}
[<A>] 		b / 2
Câu 118.
[AN]	Tính trung bình cộng cần dùng ép kiểu để tránh chia nguyên. Hoàn chỉnh dòng tính trung bình bằng cách ép kiểu chính xác.
int total = 15, count = 4;
double avg = ___;
[<A>] 		total / (double)count
Câu 119.
[AN]	In các giá trị theo lũy thừa 2, ví dụ: 1, 2, 4, 8, ... Hãy điền phần cập nhật biến i phù hợp.
for (int i = 1; i <= n; ___)
    cout << i << " ";
[<A>] 		i *= 2
Câu 120.
[AN]	Điền câu lệnh còn thiếu để trả về kết quả phép cộng.
int compute(int a, int b) {
    int result = a + b;
    ___;
}
[<A>] 		return result
Câu 121. [R]	Cho các hàm độ phức tạp sau: 1, log2n, n, nlog2n, n, n2.
Với n=8, giá trị gần đúng của các hàm là: ___
[<A>] 		1, 3, 8, 24, 64
Câu 122.
[R]	Giả sử một thuật toán có độ phức tạp O(n2). Với đầu vào có kích thước n = 1, 2, 3, 4, 5, số bước xấp xỉ lần lượt là: _____
[<A>] 		1, 4, 9, 16, 25
Câu 123.
[R]	Cho đoạn mã sau thực hiện tổng cộng bao nhiêu lần in ra màn hình với n = 1, 2, 3, 4:
for (int i = 0; i < n; ++i)
    cout << i;
[<A>] 		1, 2, 3, 4
Câu 124.
[R]	Với kích thước đầu vào n = 1, 2, 4, 8, số bước của thuật toán có độ phức tạp O(nlog2n)là: ___.
[<A>] 		0, 2, 8, 24
Câu 125.
[R]	Cho hàm độ phức tạp thời gian là O(2n). Với n=1, 2, 3, 4, 5 số bước là: ___
[<A>] 		2, 4, 8, 16, 32
Câu 126.
[R]	Với các kích thước dữ liệu n = 10, 20, 30, và thuật toán có thời gian thực thi tính theo công thức 3n+2, số bước thực hiện lần lượt là: ___
[<A>] 		32, 62, 92
Câu 127.
[R]	Một chương trình mất số bước bằng n(n−1)/2. Với n = 1, 2, 3, 4, số bước tương ứng lần lượt là: ___
[<A>] 		0, 1, 3, 6
Câu 128.
[R]	Giả sử một thuật toán có thời gian chạy là T(n)=n2+n. Với n = 1, 2, 3, 4, giá trị của T(n) lần lượt là: ___
[<A>] 		2, 6, 12, 20
Câu 129.
[R]	Giả sử một thuật toán thực hiện số bước là n+1. Với n = 0, 1, 2, 3, 4, số bước tương ứng lần lượt là: ___
[<A>] 		1, 2, 3, 4, 5
Câu 130.
[R]	Một thuật toán có độ phức tạp thời gian là T(n)=2n2−n. Với n = 1, 2, 3, số bước thực hiện lần lượt là: ___
[<A>] 		1, 6, 15
Câu 131.
[U]	Giả sử thuật toán thực hiện 3 thao tác: gán, so sánh và cộng. Mỗi thao tác mất 1 đơn vị thời gian. Tổng thời gian 5 lần lặp của mỗi thao tác lần lượt là: __________
for (int i = 0; i < 5; ++i) {
    x = i;     // gán
    y = x + 2; // cộng và gán
    if (y > 0) z++; // so sánh và gán
}
[<A>] 		5, 5, 5
Câu 132.
[U]	Dưới đây là dãy số mô phỏng giá trị biến sum sau mỗi bước khi thực hiện tính tổng từ 1 đến 4. Dãy đúng là: __________
int sum = 0;
for (int i = 1; i <= 4; ++i)
    sum += i;
[<A>] 		1, 3, 6, 10
Câu 133.
[U]	Với đoạn mã sau, hãy điền dãy chỉ số i được in ra màn hình.
for (int i = 0; i < 5; i += 2)
    cout << i << ", ";
[<A>] 		0, 2, 4
Câu 134.
[U]	Một thuật toán có độ phức tạp lũy thừa thực hiện các thao tác tại các kích thước n = 1, 2, 3. Số thao tác tương ứng là: __________ (giả sử số thao tác là 2n)
[<A>] 		2, 4, 8
Câu 135.
[U]	Khi trace đoạn chương trình sau, dãy giá trị của biến x qua từng vòng lặp là: __________
int x = 1;
for (int i = 0; i < 4; ++i)
    x *= 2;
[<A>] 		2, 4, 8, 16
Câu 136.
[U]	Giả sử bạn đang xây dựng bảng theo dõi số thao tác cho kích thước n = 1 đến n = 5 của thuật toán có độ phức tạp tuyến tính. Dãy số tương ứng là: __________
[<A>] 		1, 2, 3, 4, 5
Câu 137.
[U]	Đoạn mã sau thực hiện phép nhân x *= 3 4 lần. Hãy điền dãy giá trị của x.
int x = 1;
for (int i = 0; i < 4; ++i)
    x *= 3;
[<A>] 		3, 9, 27, 81
Câu 138.
[U]	Khi dùng kỹ thuật trace để kiểm tra đoạn mã sau, dãy giá trị in ra là: __________
int a = 0;
while (a < 10) {
    cout << a << ", ";
    a += 3;
}
[<A>] 		0, 3, 6, 9
Câu 139.
[U]	Đoạn mã sau in ra dãy số __________
for (int i = 1; i <= 5; ++i)
    cout << i * i << ", ";
[<A>] 		1, 4, 9, 16, 25
Câu 140.
[U]	Giả sử thuật toán có độ phức tạp O(n2), hãy điền dãy số thao tác tương ứng với n = 1 đến 4.
[<A>] 		1, 4, 9, 16
Câu 141.
[AP]	int x = 0;
for (int i = 0; i < 4; ++i) {
    x += i;
    cout << x << ", ";
}
Dãy số được in ra từ đoạn mã trên là: __________
[<A>] 		0, 1, 3, 6
Câu 142.
[AP]	int a = 1;
for (int i = 0; i < 5; ++i) {
    a *= 2;
    cout << a << ", ";
}
Dãy số được in ra từ đoạn mã trên là: __________
[<A>] 		2, 4, 8, 16, 32
Câu 143.
[AP]	for (int i = 10; i >= 2; i -= 2)
    cout << i << ", ";
Dãy số được in ra từ đoạn mã trên là: __________
[<A>] 		10, 8, 6, 4, 2
Câu 144.
[AP]	int f = 1;
for (int i = 2; i <= 5; ++i) {
    f *= i;
    cout << f << ", ";
}
Dãy số biểu diễn tích lũy giai thừa từ 2 đến 5 là: __________
[<A>] 		2, 6, 24, 120
Câu 145.
[AP]	int sum = 0;
for (int i = 1; i <= 5; ++i) {
    if (i % 2 == 0) sum += i;
    cout << sum << ", ";
}
Dãy giá trị của biến sum sau mỗi lần cộng số chẵn là: __________
[<A>] 		0, 2, 2, 6, 6
Câu 146.
[AP]	for (int i = 1; i <= 4; ++i)
    cout << i * i << ", ";
Dãy số được in ra là bình phương của các số từ 1 đến 4: __________
[<A>] 		1, 4, 9, 16
Câu 147.
[AP]	int a = 0;
while (a < 20) {
    cout << a << ", ";
    a += 7;
}
Dãy số in ra từ vòng lặp là: __________
[<A>] 		0, 7, 14
Câu 148.
[AP]	int x = 1;
for (int i = 0; i < 5; ++i) {
    x += i;
    cout << x << ", ";
}
Dãy giá trị của biến x sau mỗi vòng lặp là: __________
[<A>] 		1, 2, 4, 7, 11
Câu 149.
[AP]	int t = 3;
for (int i = 0; i < 4; ++i) {
    t *= i + 1;
    cout << t << ", ";
}
Dãy số được in ra biểu diễn tích lũy từ 3 là: __________
[<A>] 		3, 6, 18, 72
Câu 150.
[AP]	int s = 0;
for (int i = 5; i >= 1; --i) {
    s += i;
    cout << s << ", ";
}
Dãy tổng tích lũy ngược từ 5 về 1 là: __________
[<A>] 		5, 9, 12, 14, 15
Câu 151.
[AN]	int a = 2;
for (int i = 0; i < 4; ++i) {
    a = a + i;
    cout << a << ", ";
}
Dãy giá trị được in ra của biến a là: __________
[<A>] 		2, 3, 5, 8
Câu 152.
[AN]	int a = 5;
for (int i = 0; i < 5; ++i) {
    if (i % 2 == 0)
        a += i;
    else
        a -= i;
    cout << a << ", ";
}
Dãy giá trị của a sau mỗi vòng lặp là: __________
[<A>] 		5, 4, 6, 3, 7
Câu 153.
[AN]	int s = 1;
for (int i = 0; i < 4; ++i) {
    s = s * (i + 1);
    cout << s << ", ";
}
Dãy giá trị thể hiện biến s trong phép nhân lũy tiến là: __________
[<A>] 		1, 2, 6, 24
Câu 154.
[AN]	int x = 10;
for (int i = 0; i < 4; ++i) {
    x -= i;
    cout << x << ", ";
}
Dãy giá trị được in ra của x là: __________
[<A>] 		10, 9, 7, 4
Câu 155.
[AN]	int x = 1;
for (int i = 1; i <= 5; ++i) {
    if (i % 2 == 0)
        x *= 2;
    else
        x += 1;
    cout << x << ", ";
}
Dãy giá trị của x khi thực hiện lần lượt các điều kiện là: __________
[<A>] 		2, 4, 5, 10, 11
Câu 156.
[AN]	int a = 0;
for (int i = 1; i <= 5; ++i) {
    if (i % 3 == 0) continue;
    a += i;
    cout << a << ", ";
}
Dãy số biểu diễn giá trị a khi bỏ qua i chia hết cho 3 là: __________
[<A>] 		1, 3, 7, 12
Câu 157.
[AN]	int b = 0;
for (int i = 1; i <= 4; ++i) {
    for (int j = 1; j <= i; ++j) {
        b += 1;
        cout << b << ", ";
    }
}
Dãy số được in ra thể hiện tổng số bước lặp trong vòng lặp lồng là: __________
[<A>] 		1, 2, 3, 4, 5, 6, 7, 8, 9, 10
Câu 158.
[AN]	int v = 1;
for (int i = 0; i < 4; ++i) {
    v = v * 2 + 1;
    cout << v << ", ";
}
Dãy số được sinh ra theo quy luật nhân đôi rồi cộng 1 là: __________
[<A>] 		3, 7, 15, 31
Câu 159.
[AN]	int a = 0;
for (int i = 1; i <= 4; ++i) {
    if (i == 3) break;
    a += i;
    cout << a << ", ";
}
Dãy giá trị được in ra nếu vòng lặp bị dừng sớm là: __________
[<A>] 		1, 3
Câu 160.
[AN]	int x = 100;
for (int i = 0; i < 5; ++i) {
    x -= i * 3;
    cout << x << ", ";
}
Dãy số x bị giảm theo cấp số cộng có hệ số 3 lần i là: __________
[<A>] 		100, 100, 97, 91, 82
Câu 161. [R]	Với danh sách có  𝑛 = 10 phần tử, số phép so sánh trung bình của tìm kiếm tuyến tính là ____.
[<A>] 		5
Câu 162.
[R]	Một mảng có 𝑛 = 10 phần tử. Phần tử đầu tiên trong mảng có chỉ số (index) là ____.
[<A>] 		0
Câu 163.
[R]	Với n=5, số phép so sánh trong trường hợp tệ nhất của sắp xếp chọn (Selection Sort) là ____.
[<A>] 		5
Câu 164.
[R]	Trong cây nhị phân đầy đủ có n=15 nút, số nút lá là ____.
[<A>] 		8
Câu 165.
[R]	Với danh sách đã được sắp xếp (trường hợp tốt nhất) và n=10 phần tử, số phép so sánh của sắp xếp nổi bọt (Bubble Sort) trong một lượt duyệt là ____.
[<A>] 		9
Câu 166.
[R]	Với n=1024 phần tử, số lần kiểm tra tối đa trong tìm kiếm nhị phân là ____.
[<A>] 		1024
Câu 167.
[R]	Độ phức tạp thời gian trung bình của thuật toán tìm kiếm nhị phân là O(log₂n). Với n=256, số bước trung bình cần thực hiện là khoảng ____.
[<A>] 		8
Câu 168.
[R]	Thuật toán tìm kiếm tuần tự (linear search) có độ phức tạp thời gian tốt nhất là O(____), khi phần tử cần tìm nằm ở vị trí đầu tiên.
[<A>] 		1
Câu 169.
[R]	Thuật toán sắp xếp chọn (selection sort) có độ phức tạp thời gian là O(n²). Với n=10, số phép so sánh tối đa là ____.
[<A>] 		45
Câu 170.
[R]	Đối với thuật toán tìm kiếm nhị phân, số lần so sánh tối đa để tìm một phần tử trong mảng có 𝑛 = 128 phần tử là ____.
[<A>] 		7
Câu 171.
[U]	Khi thực hiện thuật toán tìm kiếm tuyến tính (Linear Search) trên một danh sách có n=10 phần tử và phần tử cần tìm nằm ở vị trí cuối cùng, số lần so sánh sẽ là ____.
[<A>] 		10
Câu 172.
[U]	Cho f(n) = 5n2 + 6n + 12. Với n = 1, % của chi phí do 5n2 là _____%
[<A>] 		21.74
Câu 173.
[U]	Cho f(n) = 5n2 + 6n + 12. Với n = 1, % của chi phí do 6n là _____%
[<A>] 		26.09
Câu 174.
[U]	Cho f(n) = 5n2 + 6n + 12. Với n = 1, % của chi phí do 12 là _____%
[<A>] 		52.17
Câu 175.
[U]	Cho f(n) = 3n2 + 2n + 5. Với n=2n = 2n=2, % của chi phí do 3n2 là _____%
[<A>] 		57.14
Câu 176.
[U]	Cho f(n) = 4n2 + 5n + 10. Với n = 3, % của chi phí do 4n2 là _____%
[<A>] 		59.02
Câu 177.
[U]	Khi đánh giá thời gian thực hiện của chương trình, các tác vụ cơ bản như phép +, -, *, /, %, ==, phép gán = cùng tốn _______ đơn vị thời gian.
[<A>] 		1
Câu 178.
[U]	Khi đánh giá thời gian thực hiện của chương trình, việc truy cập biến, mảng, các câu lệnh cơ bản như return, printf (hay cout), scanf (hay cin) cùng tốn _______ đơn vị thời gian.
[<A>] 		1
Câu 179.
[U]	Trong việc biểu diễn thuật toán bằng ngôn ngữ tự nhiên (English, Vietnamese...), lưu đồ (Flow chart,...), mã giả (Pseudocode), ngôn ngữ lập trình (C/C++, C#, Java, Python...), thì việc biểu diễn thuật toán bằng ngôn ngữ lập trình như C/C++, Python,... có độ chính xác cao hơn ngôn ngữ tự nhiên (English, Vietnamese,...) ____ cấp.
[<A>] 		3
Câu 180.
[U]	Trong việc biểu diễn thuật toán bằng ngôn ngữ tự nhiên (English, Vietnamese...), lưu đồ (Flow chart,...), mã giả (Pseudocode), ngôn ngữ lập trình (C/C++, C#, Java, Python...), thì việc biểu diễn thuật toán bằng ngôn ngữ tự nhiên (English, Vietnamese) dễ diễn đạt  hơn ngôn ngữ lập trình như C/C++, Python,... ____ cấp.
[<A>] 		3
Câu 181.
[AP]	Độ phức tạp thời gian của thuật toán trộn (Merge Sort) trong trường hợp tốt nhất với n=32 phần tử là O(nlog2n). Số bước xử lý cần thiết là khoảng ____.
[<A>] 		160
Câu 182.
[AP]	Độ phức tạp không gian (space complexity) của thuật toán trộn (Merge Sort) là O(n). Với mảng gồm n=20 phần tử, số lượng phần tử phụ cần cấp phát là ____.
[<A>] 		20
Câu 183.
[AP]	Với một thuật toán có độ phức tạp O(n³), nếu n=4, số bước thực hiện tối đa là ____.
[<A>] 		64
Câu 184.
[AP]	Cho một danh sách có 1024 phần tử. Số phép so sánh tối đa khi sử dụng tìm kiếm nhị phân là ____.
[<A>] 		10
Câu 185.
[AP]	Với một thuật toán có độ phức tạp thời gian O(n²), khi n=20, số phép xử lý tối đa là ____.
[<A>] 		400
Câu 186.
[AP]	Cho danh sách gồm 12 phần tử. Số phép so sánh tối đa trong sắp xếp chọn (Selection Sort) là ____.
[<A>] 		66
Câu 187.
[AP]	Độ phức tạp trung bình của sắp xếp nổi bọt (Bubble Sort) là O(n²). Nếu n=6, số phép so sánh trung bình gần đúng là ____.
[<A>] 		15
Câu 188.
[AP]	Với n=32, số phép so sánh cần thực hiện trong Merge Sort là khoảng ____.
[<A>] 		160
Câu 189.
[AP]	Thuật toán có độ phức tạp O(logn). Nếu n=512, số bước thực hiện là ____.
[<A>] 		9
Câu 190.
[AP]	Số bước thực hiện của thuật toán có độ phức tạp O(n³), với n=5, là ____.
[<A>] 		125
Câu 191.
[AN]	Cho đoạn mã chương trình như sau:
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        printf("x");
    }
}
Với n=5, số lần in ra "x" là ____.
[<A>] 		25
Câu 192.
[AN]	Cho đoạn mã chương trình như sau:
int sum = 0;
for (int i = 1; i <= n; i *= 2) {
    sum += i;
}
Với n=32, số lần vòng lặp chạy là ____.
[<A>] 		6
Câu 193.
[AN]	Cho đoạn mã chương trình như sau:
int count = 0;
for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++) {
        count++;
    }
}
Với n=5, giá trị cuối cùng của count là ____.
[<A>] 		10
Câu 194.
[AN]	Cho đoạn mã chương trình như sau:
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        for (int k = 0; k < n; k++) {
            // work
        }
    }
}
Với n=3, số lần thực hiện đoạn // work là ____.
[<A>] 		27
Câu 195.
[AN]	Cho đoạn mã chương trình như sau:
void func(int n) {
    if (n <= 1) return;
    func(n / 2);
    func(n / 2);
}
Số lời gọi hàm func(n) khi n = 8 là ____.
[<A>] 		15
Câu 196.
[AN]	Cho đoạn mã chương trình như sau:
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n/i; j++) {
        // work
    }
}
Với n=4, số lần thực hiện // work là ____.
[<A>] 		8
Câu 197.
[AN]	Cho đoạn mã chương trình như sau:
int i = 1;
while (i < n) {
    i *= 3;
}
Với n=100, số lần vòng lặp while chạy là ____.
[<A>] 		5
Câu 198.
[AN]	Cho đoạn mã chương trình như sau:
void func(int n) {
    for (int i = 0; i < n; i++) {
        func(n - 1);
    }
}
Với n=3, tổng số lần gọi func() là ____.
[<A>] 		13
Câu 199.
[AN]	Cho đoạn mã chương trình như sau:
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        // work
    }
}
Với n=4, số lần thực hiện // work là ____.
[<A>] 		10
Câu 200.
[AN]	Cho đoạn mã chương trình như sau:
int count = 0;
for (int i = 1; i < n; i *= 2) {
    for (int j = 0; j < i; j++) {
        count++;
    }
}
Với n=16, giá trị cuối cùng của count là ____.
[<A>] 		31
