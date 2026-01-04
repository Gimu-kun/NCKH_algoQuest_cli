Chương 2. 	Tìm kiếm và sắp xếp
Câu 1. [R]	Độ phức tạp thời gian trung bình của thuật toán tìm kiếm tuyến tính trong một mảng không sắp xếp có kích thước n là: ___
[<A>]	O(n)
Câu 2.
[R]	Độ phức tạp thời gian tốt nhất của tìm kiếm nhị phân là: ___
[<A>]	O(1)
Câu 3.
[R]	Độ phức tạp thời gian tệ nhất của tìm kiếm nhị phân là: ___
[<A>]	O(log₂ n)
Câu 4.
[R]	Độ phức tạp thời gian trung bình của thuật toán Bubble Sort là: ___
[<A>]	O(n²)
Câu 5.
[R]	Thuật toán tìm kiếm tuyến tính hoạt động trên danh sách có số lượng phần tử là n. Trường hợp trung bình, thuật toán cần thực hiện khoảng ____ lần so sánh.
[<A>]	n/2
Câu 6.
[R]	Độ phức tạp thời gian trung bình của thuật toán Insertion Sort là: ___
[<A>]	O(n²)
Câu 7.
[R]	Độ phức tạp thời gian trung bình của Merge Sort là: ___
[<A>]	O(nlog₂n)
Câu 8.
[R]	Độ phức tạp thời gian tệ nhất của Quick Sort là: ___
[<A>]	O(n²)
Câu 9.
[R]	Số lần so sánh tối đa khi thực hiện tìm kiếm tuyến tính trong mảng có n phần tử là: ___
[<A>]	n
Câu 10.
[R]	Số bước chia tối đa trong tìm kiếm nhị phân trên mảng kích thước n là: ___
[<A>]	⌊log₂ n⌋ + 1
Câu 11.
[U]	Nếu một thuật toán sắp xếp sử dụng phương pháp chia để trị, có độ phức tạp là T(n)=2T(n/2)+cn, thì độ phức tạp thời gian tổng thể là: ___
[<A>]	O(nlog₂n)
Câu 12.
[U]	Trong thuật toán sắp xếp đổi chỗ trực tiếp (Interchange Sort), độ phức tạp thời gian trong trường hợp tệ nhất được biểu diễn bằng O(____).
[<A>]	n2
Câu 13.
[U]	Cho thuật toán tìm kiếm nhị phân trên mảng có kích thước n. Số bước tối đa để tìm một phần tử (hoặc xác nhận không tồn tại) có thể được biểu diễn bằng công thức: ___
[<A>]	⌊log₂(n)⌋ + 1
Câu 14.
[U]	Số phép so sánh trong thuật toán Bubble Sort khi sắp xếp mảng có kích thước n (không tối ưu hóa) được biểu diễn bằng công thức: ___
[<A>]	n(n - 1)/2
Câu 15.
[U]	Trong thuật toán Insertion Sort, nếu dãy đầu vào đã được sắp xếp, số lần so sánh trong toàn bộ quá trình được mô tả bởi công thức: ___
[<A>]	n - 1
Câu 16.
[U]	Thuật toán Merge Sort chia dãy thành hai nửa, sau đó trộn lại. Độ phức tạp thời gian được mô tả bởi công thức đệ quy: ___
[<A>]	T(n) = 2T(n/2) + cn
Câu 17.
[U]	Trong trường hợp tệ nhất của Quick Sort, độ sâu của cây đệ quy là nnn. Độ phức tạp tổng thể là: ___
[<A>]	T(n) = T(n - 1) + cn
Câu 18.
[U]	Độ phức tạp thời gian của thuật toán sắp xếp phân đoạn (Quick Sort) trong trường hợp tốt nhất, khi phần tử chốt (pivot) luôn chia danh sách thành hai phần bằng nhau, được biểu diễn bằng O(____).
[<A>]	nlogn
Câu 19.
[U]	Độ phức tạp thời gian của thuật toán sắp xếp phân đoạn (Quick Sort) trong trường hợp tệ nhất, khi khi phần tử chốt (pivot) luôn chia danh sách không cân bằng, được biểu diễn bằng O(____).
[<A>]	n2
Câu 20.
[U]	Giả sử bạn thực hiện tìm kiếm tuyến tính trong mảng có kích thước nnn, trung bình phải duyệt qua một nửa dãy. Số phép so sánh trung bình là: ___
[<A>]	n / 2
Câu 21.
[AP]	int linearSearch(int a[], int n, int x) {
    for (int i = 0; i < n; ++i)
        if (a[i] == x) return i;
    return -1;
}
Số phép so sánh trong trường hợp tệ nhất được mô tả bằng biểu thức: ___
[<A>]	n
Câu 22.
[AP]	int binarySearch(int a[], int n, int x) {
    int l = 0, r = n - 1;
    while (l <= r) {
        int m = (l + r) / 2;
        if (a[m] == x) return m;
        if (a[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}
Số lần lặp tối đa của vòng while được ước lượng bởi công thức: ___
[<A>]	⌊log₂(n)⌋ + 1
Câu 23.
[AP]	void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i)
        for (int j = 0; j < n - i - 1; ++j)
            if (a[j] > a[j + 1])
                swap(a[j], a[j + 1]);
}
Tổng số phép so sánh được thực hiện (trong trường hợp trung bình) được biểu diễn bởi công thức: ___
[<A>]	n(n - 1)/2
Câu 24.
[AP]	void insertionSort(int a[], int n) {
    for (int i = 1; i < n; ++i) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}
Số phép so sánh trong trường hợp tệ nhất của thuật toán này được ước lượng bằng công thức: ___
[<A>]	n(n - 1)/2
Câu 25.
[AP]	void merge(int a[], int l, int m, int r) {
    // Gộp hai mảng con từ a[l..m] và a[m+1..r]
}
void mergeSort(int a[], int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSort(a, l, m);
        mergeSort(a, m + 1, r);
        merge(a, l, m, r);
    }
}
Độ phức tạp thời gian trung bình của thuật toán này được mô tả bởi biểu thức: ___
[<A>]	O(nlog₂n)
Câu 26.
[AP]	int countComparisons(int a[], int n, int x) {
    int count = 0;
    for (int i = 0; i < n; ++i) {
        count++;
        if (a[i] == x) break;
    }
    return count;
}
Số phép so sánh trung bình khi tìm thấy x tại vị trí ngẫu nhiên là: ___
[<A>]	n / 2
Câu 27.
[AP]	int quickSortWorstCase(int n) {
    if (n <= 1) return 0;
    return quickSortWorstCase(n - 1) + n;
}
Công thức truy hồi mô tả độ phức tạp trường hợp tệ nhất của Quick Sort là: ___
[<A>]	T(n) = T(n - 1) + n
Câu 28.
[AP]	int mergeSortRecurrence(int n) {
    if (n <= 1) return 1;
    return 2 * mergeSortRecurrence(n / 2) + n;
}
Đây là biểu thức truy hồi cho Merge Sort. Biểu thức độ phức tạp theo Big-O là: ___
[<A>]	O(n log₂ n)
Câu 29.
[AP]	Cho đoạn code C/C++ thực hiện giải thuật sắp xếp như sau:
int partition(int arr[], int low, int high) {
    int pivot = arr[low];
    int i = low + 1;
    for (int j = low + 1; j <= high; j++) {
        if (arr[j] < pivot) {
            swap(arr[i], arr[j]);
            i++;
        }
    }
    swap(arr[low], arr[i - 1]);
    return i - 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
Độ phức tạp trung bình của thuật toán trên là O(____).
[<A>]	nlogn
Câu 30.
[AP]	int countSteps(int n) {
    int steps = 0;
    while (n > 1) {
        n = n / 2;
        steps++;
    }
    return steps;
}
Biểu thức mô tả số bước thực hiện của đoạn mã trên là: ___
[<A>]	⌊log₂(n)⌋
Câu 31.
[AN]	int countLinearSearch(int a[], int n, int x) {
    int count = 0;
    for (int i = 0; i < n; ++i) {
        count++;
        if (a[i] == x) break;
    }
    return count;
}
Giả sử phần tử cần tìm nằm ở vị trí đầu, giữa và cuối. Biểu thức mô tả số phép so sánh trung bình là: ___
[<A>]	n / 2
Câu 32.
[AN]	int countBinarySearch(int a[], int n, int x) {
    int count = 0;
    int l = 0, r = n - 1;
    while (l <= r) {
        count++;
        int m = (l + r) / 2;
        if (a[m] == x) break;
        if (a[m] < x) l = m + 1;
        else r = m - 1;
    }
    return count;
}
Biểu thức gần đúng cho số lần lặp tối đa khi tìm kiếm nhị phân là: ___
[<A>]	⌊log₂(n)⌋ + 1
Câu 33.
[AN]	void bubbleSort(int a[], int n, int &compareCount) {
    compareCount = 0;
    for (int i = 0; i < n - 1; ++i)
        for (int j = 0; j < n - i - 1; ++j) {
            compareCount++;
            if (a[j] > a[j + 1])
                swap(a[j], a[j + 1]);
        }
}
Biểu thức mô tả số lần so sánh trong trường hợp tốt nhất (mảng đã sắp xếp) nếu không có tối ưu kiểm tra dừng là: ___
[<A>]	n(n - 1)/2
Câu 34.
[AN]	void insertionSort(int a[], int n, int &compareCount) {
    compareCount = 0;
    for (int i = 1; i < n; ++i) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && (++compareCount && a[j] > key))
            a[j + 1] = a[j--];
        a[j + 1] = key;
    }
}
Giả sử dãy đầu vào sắp giảm dần, biểu thức mô tả tổng số lần so sánh là: ___
[<A>]	n(n - 1)/2
Câu 35.
[AN]	void mergeSortCount(int a[], int l, int r, int &count) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSortCount(a, l, m, count);
        mergeSortCount(a, m + 1, r, count);
        count += r - l + 1; // trộn 2 nửa
    }
}
Biểu thức truy hồi mô tả độ phức tạp của thuật toán trên là: ___
[<A>]	T(n) = 2T(n/2) + n
Câu 36.
[AN]	int mergeSortLevelCost(int n) {
    int levels = 0, cost = 0;
    while (n > 1) {
        cost += n;
        n /= 2;
        levels++;
    }
    return cost;
}
Tổng chi phí của các cấp đệ quy trong Merge Sort (với chi phí mỗi cấp là n) là: ___
[<A>]	n log₂(n)
Câu 37.
[AN]	int hybridSearch(int a[], int n, int x) {
    int k = sqrt(n);
    for (int i = 0; i < n; i += k)
        if (a[i] == x) return i;
    return -1;
}
Biểu thức ước lượng số bước trong tìm kiếm bước nhảy (jump search) là: ___
[<A>]	√n
Câu 38.
[AN]	int countSwap(int a[], int n) {
    int count = 0;
    for (int i = 0; i < n - 1; ++i)
        for (int j = i + 1; j < n; ++j)
            if (a[i] > a[j]) count++;
    return count;
}
Hàm trên đếm số nghịch thế (inversions). Biểu thức độ phức tạp thời gian là: ___
[<A>]	O(n²)
Câu 39.
[AN]	int countBinaryComparisons(int a[], int n, int x) {
    int l = 0, r = n - 1;
    int count = 0;
    while (l <= r) {
        int m = (l + r) / 2;
        count += 2; // so sánh a[m] == x và 1 điều kiện
        if (a[m] == x) break;
        if (a[m] < x) l = m + 1;
        else r = m - 1;
    }
    return count;
}
Biểu thức gần đúng mô tả số phép so sánh trong trường hợp tệ nhất là: ___
[<A>]	2 ⌊log₂(n)⌋ + 2
Câu 40.
[AN]	int modifiedBubbleSort(int a[], int n, int &passCount) {
    passCount = 0;
    bool swapped;
    do {
        swapped = false;
        for (int i = 1; i < n; ++i)
            if (a[i - 1] > a[i]) {
                swap(a[i - 1], a[i]);
                swapped = true;
            }
        passCount++;
        n--;
    } while (swapped);
    return passCount;
}
Biểu thức mô tả số lượt lặp (pass) tối đa trong thuật toán Bubble Sort có kiểm tra hoán đổi là: ___
[<A>]	n - 1
Câu 41. [R]	Thuật toán tìm kiếm tuyến tính có tên là tìm kiếm __________.
[<A>]	tuần tự (hoặc “linear search”)
Câu 42.
[R]	Trong tìm kiếm nhị phân, dãy cần được __________ trước khi tìm.
[<A>]	sắp xếp
Câu 43.
[R]	Thuật toán sắp xếp đơn giản nhất, hoạt động bằng cách hoán đổi các phần tử liền kề là __________.
[<A>]	Bubble Sort (hoặc “nổi bọt”)
Câu 44.
[R]	Trong thuật toán chọn trực tiếp, mỗi lần lặp chọn phần tử __________ trong dãy chưa sắp
[<A>]	nhỏ nhất
Câu 45.
[R]	Sắp xếp __________ là phương pháp sắp xếp các phần tử bằng cách chèn từng phần tử vào vị trí đúng trong danh sách đã sắp.
[<A>]	chèn (hoặc “Insertion Sort”)
Câu 46.
[R]	Khi thực hiện tìm kiếm nhị phân, phần tử giữa thường được chọn bằng chỉ số trung bình của __________ và high.
[<A>]	low
Câu 47.
[R]	Thuật toán sắp xếp __________ có hiệu suất trung bình tốt nhất trong số các thuật toán sắp xếp cơ bản không dùng đệ quy.
[<A>]	Shell Sort
Câu 48.
[R]	Thuật toán sắp xếp __________ chia dãy thành hai phần, sắp từng phần và trộn lại.
[<A>]	Merge Sort
Câu 49.
[R]	Quick Sort sử dụng kỹ thuật chia mảng gọi là __________.
[<A>]	partition (hoặc “phân hoạch”)
Câu 50.
[R]	Khi dãy đã được sắp xếp, thuật toán tìm kiếm có thể được tối ưu bằng cách sử dụng __________ thay vì duyệt toàn bộ.
[<A>]	nhị phân
Câu 51.
[U]	Tìm kiếm nhị phân không thể áp dụng nếu dãy chưa được __________.
[<A>]	sắp xếp
Câu 52.
[U]	Trong thuật toán sắp xếp chèn (Insertion Sort), mỗi phần tử được chèn vào vị trí đúng trong phần dãy __________ đã sắp.
[<A>]	trước (hoặc “bên trái”)
Câu 53.
[U]	Trong thuật toán tìm kiếm tuần tự, phần tử cần tìm có thể nằm ở bất kỳ __________ trong dãy.
[<A>]	vị trí
Câu 54.
[U]	Quick Sort sử dụng một phần tử gọi là __________ để phân chia mảng thành hai phần.
[<A>]	pivot
Câu 55.
[U]	Merge Sort luôn chia dãy thành hai phần có kích thước gần __________.
[<A>]	bằng nhau
Câu 56.
[U]	Thuật toán __________ thường hoạt động nhanh hơn Insertion Sort khi làm việc với các tập dữ liệu lớn.
[<A>]	Merge Sort (hoặc “Quick Sort” cũng đúng trong ngữ cảnh khác)
Câu 57.
[U]	Sự khác biệt chính giữa tìm kiếm tuyến tính và tìm kiếm nhị phân là giả định về __________ của dữ liệu.
[<A>]	thứ tự (hoặc “sắp xếp”)
Câu 58.
[U]	Thuật toán Shell Sort cải thiện hiệu suất của Insertion Sort bằng cách sử dụng khoảng cách __________ giữa các phần tử khi chèn.
[<A>]	giảm dần
Câu 59.
[U]	Trong khi tìm kiếm nhị phân, nếu phần tử cần tìm lớn hơn phần tử giữa, ta sẽ tiếp tục tìm trong nửa __________ của dãy.
[<A>]	phải (hoặc “bên phải”)
Câu 60.
[U]	Một điểm yếu của Bubble Sort là số lần so sánh luôn gần như __________ cho mọi trường hợp đầu vào.
[<A>]	tối đa (hoặc “giới hạn trên”)
Câu 61.
[AP]	int search(int arr[], int n, int x) {
    for (int i = 0; i < n; ++i)
        if (arr[i] == x) return i;
    return -1;
}
Thuật toán trong đoạn mã trên là tìm kiếm __________.
[<A>]	tuyến tính (hoặc “linear search”)
Câu 62.
[AP]	int binarySearch(int a[], int left, int right, int x) {
    while (left <= right) {
        int mid = (left + right)/2;
        if (a[mid] == x) return mid;
        else if (a[mid] < x) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
Đoạn mã trên minh hoạ cho thuật toán tìm kiếm __________.
[<A>]	nhị phân (hoặc “binary search”)
Câu 63.
[AP]	void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i)
        for (int j = 0; j < n - i - 1; ++j)
            if (a[j] > a[j+1])
                swap(a[j], a[j+1]);
}
Đoạn mã trên minh hoạ thuật toán sắp xếp __________.
[<A>]	nổi bọt (hoặc “bubble sort”)
Câu 64.
[AP]	void insertionSort(int a[], int n) {
    for (int i = 1; i < n; ++i) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}
Đoạn mã trên minh hoạ thuật toán sắp xếp __________.
[<A>]	chèn (hoặc "insertion sort")
Câu 65.
[AP]	void selectionSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i) {
        int minIdx = i;
        for (int j = i + 1; j < n; ++j)
            if (a[j] < a[minIdx]) minIdx = j;
        swap(a[i], a[minIdx]);
    }
}
Thuật toán trên thực hiện sắp xếp bằng cách __________ phần tử nhỏ nhất mỗi lượt. 
[<A>]	chọn (hoặc “lựa chọn”)
Câu 66.
[AP]	int pivot = a[right];
int i = left - 1;
for (int j = left; j < right; ++j) {
    if (a[j] <= pivot) {
        ++i;
        swap(a[i], a[j]);
    }
}
swap(a[i + 1], a[right]);
Đoạn mã trên là phần __________ trong thuật toán Quick Sort.
[<A>]	phân hoạch (hoặc “partition”)
Câu 67.
[AP]	void merge(int a[], int l, int m, int r) {
    // tạo 2 mảng tạm L và R
    // trộn L và R vào a[]
}
Trong thuật toán Merge Sort, bước này được gọi là __________.
[<A>]	trộn (hoặc “merge”)
Câu 68.
[AP]	void sortShell(int a[], int n) {
    for (int gap = n/2; gap > 0; gap /= 2)
        for (int i = gap; i < n; ++i) {
            int temp = a[i], j;
            for (j = i; j >= gap && a[j - gap] > temp; j -= gap)
                a[j] = a[j - gap];
            a[j] = temp;
        }
}
Thuật toán trên sử dụng khoảng cách __________ để cải thiện hiệu suất chèn.
[<A>]	giảm dần
Câu 69.
[AP]	if (x == arr[mid]) return mid;
else if (x < arr[mid]) return binarySearch(arr, left, mid - 1, x);
else return binarySearch(arr, mid + 1, right, x);
Đoạn mã trên là dạng đệ quy của thuật toán tìm kiếm __________.
[<A>]	nhị phân
Câu 70.
[AP]	// Tìm kiếm tuyến tính trong mảng đã sắp, dừng sớm nếu a[i] > x
int searchSorted(int a[], int n, int x) {
    for (int i = 0; i < n && a[i] <= x; ++i)
        if (a[i] == x) return i;
    return -1;
}
Đoạn mã minh hoạ một biến thể __________ của tìm kiếm tuyến tính.
[<A>]	cải tiến (hoặc "tối ưu hoá cho mảng có thứ tự")
Câu 71.
[AN]	int binarySearch(int a[], int l, int r, int x) {
    while (l <= r) {
        int m = (l + r) / 2;
        if (a[m] == x) return m;
        if (a[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}
Đoạn mã trên chỉ hoạt động đúng khi mảng __________.
[<A>]	đã sắp xếp
Câu 72.
[AN]	int searchImproved(int a[], int n, int x) {
    for (int i = 0; i < n && a[i] <= x; ++i)
        if (a[i] == x) return i;
    return -1;
}
Thuật toán trên là biến thể của tìm kiếm tuyến tính, khai thác tính chất __________ của mảng đầu vào.
[<A>]	có thứ tự
Câu 73.
[AN]	void quickSort(int a[], int low, int high) {
    if (low < high) {
        int p = partition(a, low, high);
        quickSort(a, low, p - 1);
        quickSort(a, p + 1, high);
    }
}
Dựa vào cách gọi lại chính hàm, thuật toán này sử dụng kỹ thuật __________.
[<A>]	đệ quy
Câu 74.
[AN]	for (int gap = n / 2; gap > 0; gap /= 2)
    for (int i = gap; i < n; ++i)
        // chèn a[i] vào vị trí thích hợp
Dựa vào biến gap giảm dần, đoạn mã trên thuộc về thuật toán __________.
[<A>]	Shell Sort
Câu 75.
[AN]	void insertionSort(int a[], int n) {
    for (int i = 1; i < n; ++i) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}
Trong trường hợp mảng gần sắp xếp, thuật toán chèn có thể đạt hiệu suất __________.
[<A>]	gần tuyến tính (hoặc “O(n)”)
Câu 76.
[AN]	int interpolationSearch(int a[], int low, int high, int x) {
    while (low <= high && x >= a[low] && x <= a[high]) {
        int pos = low + ((x - a[low]) * (high - low)) / (a[high] - a[low]);
        if (a[pos] == x) return pos;
        if (a[pos] < x) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}
Đoạn mã trên sử dụng công thức nội suy để tìm vị trí dự đoán, thuộc thuật toán __________.
[<A>]	Interpolation Search
Câu 77.
[AN]	int exponentialSearch(int a[], int n, int x) {
    if (a[0] == x) return 0;
    int i = 1;
    while (i < n && a[i] <= x)
        i *= 2;
    return binarySearch(a, i / 2, min(i, n - 1), x);
}
Đoạn mã trên kết hợp tìm mốc rồi nhị phân, minh hoạ thuật toán __________.
[<A>]	Exponential Search
Câu 78.
[AN]	void sortByCounting(int a[], int n) {
    int count[100] = {0};
    for (int i = 0; i < n; ++i) count[a[i]]++;
    int index = 0;
    for (int i = 0; i < 100; ++i)
        while (count[i]--) a[index++] = i;
}
Đoạn mã này minh hoạ thuật toán __________, hiệu quả khi dữ liệu có miền giá trị nhỏ.
[<A>]	Counting Sort
Câu 79.
[AN]	void hybridSort(int a[], int l, int r) {
    if (r - l < 16)
        insertionSort(a + l, r - l + 1);
    else {
        int m = (l + r) / 2;
        hybridSort(a, l, m);
        hybridSort(a, m + 1, r);
        merge(a, l, m, r);
    }
}
Kỹ thuật kết hợp hai thuật toán theo điều kiện kích thước trong đoạn mã trên là dạng __________.
[<A>]	lai (hoặc “hybrid”)
Câu 80.
[AN]	void quickSortWorst(int a[], int l, int r) {
    if (l < r) {
        int p = partition(a, l, r); // luôn chọn pivot là a[r]
        quickSortWorst(a, l, p - 1);
        quickSortWorst(a, p + 1, r);
    }
}
Khi mảng đầu vào đã được sắp xếp, đoạn mã trên thể hiện trường hợp __________ của Quick Sort.
[<A>]	tệ nhất (hoặc “worst-case”)
Câu 81. [R]	Điều kiện dừng trong vòng lặp của thuật toán tìm kiếm nhị phân.
int binarySearch(int arr[], int n, int x) {
    int low = 0, high = n - 1;
    while (low <= ___) {
        int mid = (low + high) / 2;
        if (arr[mid] == x) return mid;
        else if (arr[mid] < x) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
[<A>]	high
Câu 82.
[R]	Tính chỉ số phần tử giữa trong tìm kiếm nhị phân.
int mid = (low + high) ___ 2;
[<A>]	/
Câu 83.
[R]	Hàm chuẩn C++ có trong <algorithm> dùng để hoán đổi hai phần tử trong thuật toán Bubble Sort.
void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i)
        for (int j = 0; j < n - i - 1; ++j)
            if (a[j] > a[j + 1])
                ___(a[j], a[j + 1]);
}
[<A>]	swap
Câu 84.
[R]	Khởi tạo chỉ số phần tử nhỏ nhất trong thuật toán Selection Sort.
for (int i = 0; i < n - 1; ++i) {
    int minIndex = ___;
    for (int j = i + 1; j < n; ++j)
        if (arr[j] < arr[minIndex])
            minIndex = j;
    swap(arr[i], arr[minIndex]);
}
[<A>]	i
Câu 85.
[R]	Lấy giá trị phần tử đang xét trong Insertion Sort để lưu vào biến key.
for (int i = 1; i < n; ++i) {
    int key = a[___];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        --j;
    }
    a[j + 1] = key;
}
[<A>]	i
Câu 86.
[R]	So sánh phần tử giữa hai mảng con khi trộn trong Merge Sort.
if (L[i] <= ___[j])
    a[k++] = L[i++];
else
    a[k++] = R[j++];
[<A>]	R
Câu 87.
[R]	Gọi đệ quy Quick Sort cho phần bên trái của mảng sau phân hoạch
int pi = partition(arr, low, high);
quickSort(arr, low, ___ - 1);
quickSort(arr, pi + 1, high);
[<A>]	pi
Câu 88.
[R]	So sánh phần tử trong tìm kiếm tuyến tính.
if (arr[i] ___ x)
    return i;
[<A>]	==
Câu 89.
[R]	Cập nhật giá trị low trong tìm kiếm nhị phân khi phần tử giữa nhỏ hơn khóa.
if (arr[mid] < x)
    low = ___ + 1;
[<A>]	mid
Câu 90.
[R]	Trong thuật toán Merge Sort, sau khi trộn xong hai mảng con L và R, kết quả được lưu vào mảng gốc arr[] thông qua chỉ số k.
void merge(int arr[], int l, int m, int r) {
    int i = 0, j = 0, k = l;
    // Sau khi so sánh từng phần tử từ L[i] và R[j]
    arr[k++] = ___[j++];
}
[<A>]	R
Câu 91.
[U]	Điền vào chỗ trống để cập nhật giới hạn trên (high) khi phần tử giữa lớn hơn giá trị cần tìm trong tìm kiếm nhị phân.
if (arr[mid] > x)
    high = ___;
[<A>]	mid - 1
Câu 92.
[U]	Điền toán tử thích hợp để dịch phần tử sang phải nếu lớn hơn key trong thuật toán Insertion Sort.
while (j >= 0 && a[j] ___ key)
    a[j + 1] = a[j--];
[<A>]	>
Câu 93.
[U]	Hoàn thiện cú pháp để lấy phần tử từ mảng con trái trong Merge Sort.
if (L[i] <= R[j]) {
    arr[k++] = ___;
} else {
    arr[k++] = R[j++];
}
[<A>]	L[i++]
Câu 94.
[U]	Hoàn thành giá trị đúng của high khi tìm kiếm nhị phân trong mảng có n phần tử.
int low = 0;
int high = ___;
[<A>]	n - 1
Câu 95.
[U]	Điền giá trị trả về đúng khi tìm thấy phần tử cần tìm trong tìm kiếm tuyến tính.
for (int i = 0; i < n; ++i) {
    if (arr[i] == x)
        return ___;
}
[<A>]	i
Câu 96.
[U]	Điền tên hàm thực hiện phân hoạch trong Quick Sort.
int pi = ___(arr, low, high);
quickSort(arr, low, pi - 1);
quickSort(arr, pi + 1, high);
[<A>]	partition
Câu 97.
[U]	Hoàn thành dòng lệnh để chép phần tử còn lại từ mảng trái L[] vào mảng chính arr[] trong Merge Sort.
while (i < n1) {
    arr[k++] = ___;
}
[<A>]	L[i++]
Câu 98.
[U]	Điền toán tử điều kiện phù hợp để sắp xếp tăng dần trong Bubble Sort.
if (a[j] ___ a[j + 1]) {
    swap(a[j], a[j + 1]);
}
[<A>]	>
Câu 99.
[U]	Điền điều kiện thích hợp vào vòng lặp để dừng sớm khi arr[i] vượt quá x trong tìm kiếm tuyến tính với mảng đã sắp xếp.
int linearSearchSorted(int arr[], int n, int x) {
    for (int i = 0; i < n && ___; ++i) {
        if (arr[i] == x)
            return i;
    }
    return -1;
}
[<A>]	arr[i] <= x
Câu 100.
[U]	Điền biểu thức phù hợp tính mid để tránh tràn số nguyên khi low và high lớn trong tìm kiếm nhị phân.
int mid = low + ___;
[<A>]	(high - low) / 2
Câu 101.
[AP]	Hoàn chỉnh đoạn mã để thực hiện hoán đổi hai phần tử trong thuật toán sắp xếp nổi bọt.
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; ++i)
        for (int j = 0; j < n - i - 1; ++j)
            if (arr[j] > arr[j + 1])
                ___(arr[j], arr[j + 1]);
}
[<A>]	swap
Câu 102.
[AP]	Điền hàm phù hợp để gọi sắp xếp hai nửa mảng trong Merge Sort.
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        ___(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
[<A>]	mergeSort
Câu 103.
[AP]	Hoàn chỉnh điều kiện vòng lặp để duyệt hết mảng.
int linearSearch(int a[], int n, int x) {
    for (int i = 0; ___; ++i)
        if (a[i] == x) return i;
    return -1;
}
[<A>]	i < n
Câu 104.
[AP]	Hoàn chỉnh điều kiện so sánh trong trộn mảng đã sắp.
if (L[i] ___ R[j])
    arr[k++] = L[i++];
else
    arr[k++] = R[j++];
[<A>]	<=
Câu 105.
[AP]	Điền điều kiện lặp đúng trong tìm kiếm nhị phân.
while (___) {
    int mid = (low + high) / 2;
    if (arr[mid] == x) return mid;
    else if (arr[mid] < x) low = mid + 1;
    else high = mid - 1;
}
[<A>]	low <= high
Câu 106.
[AP]	Trong Quick Sort, sau phân hoạch, điền đúng hàm và chỉ số gọi lại phần bên phải.
int pi = partition(arr, low, high);
quickSort(arr, low, pi - 1);
___(arr, pi + 1, high);
[<A>]	quickSort
Câu 107.
[AP]	Điền vào lời gọi hàm mergeSort đúng để sắp xếp mảng a gồm n phần tử bằng Merge Sort.
int a[100], n;
// nhập a và n
___;
[<A>]	mergeSort(a, 0, n - 1)
Câu 108.
[AP]	Điền vào lệnh gán đúng để chọn pivot là phần tử cuối mảng trong Quick Sort.
int pivot = ___; 
int i = low - 1;
for (int j = low; j <= high - 1; ++j) {
    if (arr[j] < pivot) {
        ++i;
        swap(arr[i], arr[j]);
    }
}
swap(arr[i + 1], arr[high]);
[<A>]	arr[high]
Câu 109.
[AP]	Hoàn thiện vòng lặp ngoài của Shell Sort để giảm dần giá trị gap.
for (int gap = n / 2; ___; gap /= 2) {
    for (int i = gap; i < n; ++i) {
        int temp = arr[i];
        int j;
        for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
            arr[j] = arr[j - gap];
        arr[j] = temp;
    }
}
[<A>]	gap > 0
Câu 110.
[AP]	Hoàn chỉnh điều kiện trong vòng lặp để dịch phần tử lớn hơn về phía sau, theo khoảng cách gap trong Shell Sort.
for (j = i; j >= gap && arr[j - ___] > temp; j -= gap)
    arr[j] = arr[j - gap];
[<A>]	gap
Câu 111.
[AN]	Trong tìm kiếm nhị phân, để tránh lặp vô hạn, hãy điền điều kiện chính xác trong vòng lặp.
int binarySearch(int arr[], int n, int x) {
    int low = 0, high = n - 1;
    while (___) {
        int mid = (low + high) / 2;
        if (arr[mid] == x) return mid;
        else if (arr[mid] < x) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
[<A>]	low <= high
Câu 112.
[AN]	Trong Insertion Sort, nếu điền sai toán tử so sánh, thuật toán sẽ chèn sai vị trí. Hãy điền toán tử phù hợp:
while (j >= 0 && a[j] ___ key) {
    a[j + 1] = a[j];
    j--;
}
[<A>]	>
Câu 113.
[AN]	Điền điều kiện giới hạn để vòng lặp dừng sớm khi arr[i] > x trong mảng đã sắp trong Linear Search.
for (int i = 0; i < n && ___; ++i) {
    if (arr[i] == x) return i;
}
[<A>]	arr[i] <= x
Câu 114.
[AN]	Nếu không giảm j, thì vòng lặp sẽ không tiến lùi. Điền đúng dòng lệnh cần có trong Insertion Sort.
while (j >= 0 && a[j] > key) {
    a[j + 1] = a[j];
    ___;
}
[<A>]	j--
Câu 115.
[AN]	Hoàn thiện điều kiện để chỉ thực hiện hoán đổi nếu phần tử nhỏ nhất khác vị trí hiện tại trong Selection Sort.
if (___)
    swap(arr[i], arr[min_idx]);
[<A>]	min_idx != i
Câu 116.
[AN]	Shell Sort giảm gap theo từng lần lặp. Hoàn chỉnh điều kiện đúng để lặp đến khi không còn bước nhảy.
for (int gap = n / 2; ___; gap /= 2)
[<A>]	gap > 0
Câu 117.
[AN]	Trong Insertion Sort, biến j bắt đầu từ phần tử trước vị trí chèn. Hoàn chỉnh dòng khai báo sau:
int key = arr[i];
int j = ___;
[<A>]	i - 1
Câu 118.
[AN]	Hoàn chỉnh điều kiện để đảm bảo thuật toán dừng đúng lúc trong khi tìm kiếm nhị phân.
int binarySearch(int a[], int n, int x) {
    int left = 0, right = n - 1;
    while (___) {
        int mid = (left + right) / 2;
        if (a[mid] == x) return mid;
        else if (a[mid] > x) right = mid - 1;
        else left = mid + 1;
    }
    return -1;
}
[<A>]	left <= right
Câu 119.
[AN]	Trong quá trình phân vùng Quick Sort, nếu quên tăng chỉ số, có thể gây lỗi logic. Hoàn chỉnh dòng sau:
for (int j = low; j <= high - 1; ++j) {
    if (arr[j] <= pivot) {
        ++i;
        swap(arr[i], ___);
    }
}
[<A>]	arr[j]
Câu 120.
[AN]	Trong vòng lặp chèn của Shell Sort, nếu viết sai điều kiện arr[j - gap] > temp, thuật toán có thể mất tính ổn định hoặc sắp sai thứ tự. Hãy điền điều kiện đúng:
for (int gap = n / 2; gap > 0; gap /= 2) {
    for (int i = gap; i < n; ++i) {
        int temp = arr[i];
        int j = i;
        while (j >= gap && ___) {
            arr[j] = arr[j - gap];
            j -= gap;
        }
        arr[j] = temp;
    }
}
[<A>]	arr[j - gap] > temp
Câu 121. [R]	Thuật toán tìm kiếm tuyến tính thực hiện tối đa ____ phép so sánh để tìm một phần tử trong danh sách có 𝑛 = 20 phần tử.
[<A>]	20
Câu 122.
[R]	Nếu danh sách có 𝑛 = 100 phần tử, số lần so sánh tối đa mà thuật toán tìm kiếm tuyến tính phải thực hiện là ____.
[<A>]	100
Câu 123.
[R]	Trong thuật toán tìm kiếm tuyến tính, nếu phần tử cần tìm không có trong danh sách, thuật toán sẽ thực hiện tối đa ____ phép so sánh cho một danh sách có 𝑛 = 15 phần tử.
[<A>]	15
Câu 124.
[R]	Thuật toán tìm kiếm tuyến tính có thể áp dụng cho các danh sách có thứ tự (sorted) và danh sách không có thứ tự (unsorted) đúng hay sai? Điền số 1 nếu đúng, số 0 nếu sai: ____.
[<A>]	1
Câu 125.
[R]	Trong thuật toán tìm kiếm tuyến tính, với danh sách có n=10 phần tử, số lần so sánh trung bình để tìm thấy một phần tử là ____.
[<A>]	5
Câu 126.
[R]	Thuật toán tìm kiếm nhị phân yêu cầu danh sách đầu vào phải được sắp xếp theo thứ tự tăng dần hoặc giảm dần. Nếu danh sách chưa được sắp xếp, tìm kiếm nhị phân sẽ không hoạt động đúng. Điền số 1 nếu đúng, số 0 nếu sai: ____.
[<A>]	1
Câu 127.
[R]	Trong thuật toán tìm kiếm nhị phân, nếu danh sách có n = 16 phần tử, số lần kiểm tra tối đa cần thực hiện để tìm một phần tử là ____.
[<A>]	4
Câu 128.
[R]	Thuật toán tìm kiếm nhị phân chia danh sách thành ____ phần sau mỗi lần kiểm tra.
[<A>]	2
Câu 129.
[R]	Giả sử danh sách có n = 1000 phần tử. Số lần kiểm tra tối đa cần thực hiện trong thuật toán tìm kiếm nhị phân là ____.
[<A>]	10
Câu 130.
[R]	Trong thuật toán tìm kiếm nhị phân, nếu danh sách có n = 1024 phần tử, sau lần kiểm tra đầu tiên, số phần tử còn lại trong phạm vi tìm kiếm là ____.
[<A>]	512
Câu 131.
[U]	Trong thuật toán sắp xếp đổi chỗ trực tiếp (Interchange Sort), với danh sách có n = 5 phần tử, số lần so sánh cần thực hiện trong trường hợp tệ nhất là ____.
[<A>]	10
Câu 132.
[U]	Một danh sách gồm n=16 phần tử đã được sắp xếp. Số bước tối đa để tìm một phần tử bằng tìm kiếm nhị phân, nếu không tìm thấy, là ____.
[<A>]	5
Câu 133.
[U]	Trong thuật toán sắp xếp nổi bọt (Bubble Sort), với danh sách có n = 6 phần tử, số lần hoán đổi tối đa trong trường hợp tệ nhất là ____.
[<A>]	15
Câu 134.
[U]	Trong thuật toán sắp xếp nổi bọt (Bubble Sort), với danh sách có n = 7 phần tử, số lần so sánh cần thực hiện trong trường hợp tệ nhất là ____.
[<A>]	21
Câu 135.
[U]	Trong thuật toán sắp xếp nổi bọt (Bubble Sort), nếu danh sách có n = 8 phần tử, sau lần duyệt đầu tiên, số phần tử lớn nhất được đưa về đúng vị trí là ____.
[<A>]	1
Câu 136.
[U]	Trong thuật toán sắp xếp rung (Shaker Sort), với danh sách có n = 8 phần tử, số lần kiểm tra hoán đổi tối đa trong trường hợp tệ nhất là ____.
[<A>]	28
Câu 137.
[U]	Trong thuật toán sắp xếp rung (Shaker Sort), nếu danh sách có n = 10 phần tử, số phần tử được đưa về đúng vị trí sau mỗi lần duyệt cả hai chiều là ____.
[<A>]	2
Câu 138.
[U]	Với danh sách gồm n=5 phần tử, thuật toán tìm kiếm tuyến tính cần bao nhiêu phép so sánh ít nhất để tìm thấy phần tử ở cuối danh sách?
[<A>]	5
Câu 139.
[U]	Giả sử bạn sử dụng thuật toán tìm kiếm nhị phân để tìm một phần tử trong danh sách có n=1000 phần tử đã được sắp xếp. Số phép so sánh tối đa cần thiết để kết luận phần tử không tồn tại trong danh sách là ____.
[<A>]	10
Câu 140.
[U]	Trong thuật toán sắp xếp chọn trực tiếp (Straight Selection Sort), với danh sách có n = 5 phần tử, số lần so sánh cần thực hiện trong trường hợp tệ nhất là ____.
[<A>]	10
Câu 141.
[AP]	Cho đoạn mã chương trình sắp xếp như sau:
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
Với danh sách có n = 5 phần tử, số lần lặp của vòng lặp ngoài (vòng for) là ____.
[<A>]	4
Câu 142.
[AP]	Trong giải thuật về sắp xếp chèn trực tiếp (Straight Insertion Sort) như sau:
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
Với danh sách đã được sắp xếp tăng dần, số lần thực hiện lệnh arr[j + 1] = arr[j] trong trường hợp tốt nhất là ____.
[<A>]	0
Câu 143.
[AP]	Cho đoạn chương trình sau:
int linearSearch(int arr[], int n, int key) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        count++;
        if (arr[i] == key) break;
    }
    return count;
}
Gọi hàm linearSearch(arr, 6, 13) với mảng arr = {7, 9, 12, 13, 15, 18}. Số phép so sánh thực hiện là ____.
[<A>]	4
Câu 144.
[AP]	Cho đoạn chương trình sau:
void binaryInsertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int loc = binarySearch(arr, key, 0, i - 1);
        for (int j = i - 1; j >= loc; j--) {
            arr[j + 1] = arr[j];
        }
        arr[loc] = key;
    }
}
Với danh sách n = 10 phần tử, số lần tối đa hàm binarySearch() được gọi trong toàn bộ quá trình sắp xếp là ____
[<A>]	9
Câu 145.
[AP]	Cho đoạn chương trình sau:
#include <iostream>
using namespace std;
// Hàm thực hiện tìm kiếm nhị phân
int binarySearch(int arr[], int item, int low, int high) {
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < item)
            high = mid - 1; // Tìm ở nửa trái
        else
            low = mid + 1;  // Tìm ở nửa phải
    }
    return low; // Vị trí chèn phù hợp
}

// Hàm Sắp Xếp Chèn Nhị Phân
void binaryInsertionSort(int arr[], int n) {
    int count = 0;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        int loc = binarySearch(arr, key, 0, j);
        while (j >= loc) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Hàm in mảng
void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
    cout << endl;
}

// Hàm chính
int main() {
    // Mảng đầu vào
    int arr[] = {10, 20, 30, 40, 50, 60, 70, 80};
    int n = sizeof(arr) / sizeof(arr[0]);
    printArray(arr, n);
    binaryInsertionSort(arr, n);
    printArray(arr, n);

    return 0;
}
Số lần dịch chuyển phần tử arr[j + 1] = arr[j]là ____.
[<A>]	28
Câu 146.
[AP]	Cho hàm binarySearch như sau:
int binarySearch(int arr[], int item, int low, int high) {
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (item == arr[mid]) {
            return mid + 1;
        } else if (item > arr[mid]) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return low;
}
Trong hàm binarySearch, với mảng arr[] 16 phần tử, số lần kiểm tra tối đa trong trường hợp tệ nhất là ____.
[<A>]	4
Câu 147.
[AP]	Cho đoạn code C/C++ thực hiện giải thuật sắp xếp như sau:
void shakerSort(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        for (int i = left; i < right; i++) {
            if (arr[i] > arr[i + 1]) {
                swap(arr[i], arr[i + 1]);
            }
        }
        right--;
        for (int i = right; i > left; i--) {
            if (arr[i] < arr[i - 1]) {
                swap(arr[i], arr[i - 1]);
            }
        }
        left++;
    }
}
Với danh sách có n = 6 phần tử, số lần lặp tối đa của vòng lặp while trong trường hợp tệ nhất là ____.
[<A>]	3
Câu 148.
[AP]	Cho đoạn code C/C++ thực hiện giải thuật sắp xếp như sau:
void shakerSort(int arr[], int n) {
    int left = 0, right = n - 1;
    while (left < right) {
        for (int i = left; i < right; i++) {
            if (arr[i] > arr[i + 1]) {
                swap(arr[i], arr[i + 1]);
            }
        }
        right--;
        for (int i = right; i > left; i--) {
            if (arr[i] < arr[i - 1]) {
                swap(arr[i], arr[i - 1]);
            }
        }
        left++;
    }
}
Trong trường hợp tốt nhất (danh sách đã được sắp xếp), số lần thực hiện lệnh swap(arr[i], arr[i+1]) là ____.
[<A>]	0
Câu 149.
[AP]	Cho đoạn code C/C++ như sau:
int binarySearch(int arr[], int n, int key) {
    int left = 0, right = n - 1, count = 0;
    while (left <= right) {
        count++;
        int mid = (left + right) / 2;
        if (arr[mid] == key) break;
        else if (arr[mid] < key) left = mid + 1;
        else right = mid - 1;
    }
    return count;
}
Gọi binarySearch(arr, 8, 19) với arr = {3, 5, 8, 10, 14, 18, 19, 25}. Số lần so sánh thực hiện là ____.
[<A>]	3
Câu 150.
[AP]	Cho đoạn code C/C++ thực hiện giải thuật sắp xếp như sau:
int partition(int arr[], int low, int high) {
    int pivot = arr[low];
    int i = low + 1;
    for (int j = low + 1; j <= high; j++) {
        if (arr[j] < pivot) {
            swap(arr[i], arr[j]);
            i++;
        }
    }
    swap(arr[low], arr[i - 1]);
    return i - 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
Với danh sách có n = 10 phần tử và phần tử chốt (pivot) luôn chia danh sách thành hai phần không cân bằng với tỉ lệ 1:9, số lần gọi hàm partition() trong trường hợp này là ____.
[<A>]	10
Câu 151.
[AN]	Cho đoạn code C/C++ thực hiện giải thuật sắp xếp như sau:
void shellSort(int arr[], int n) {
    // Sinh dãy Fibonaci làm khoảng cách
    int fib[100], k = 2;
    fib[0] = 1; fib[1] = 1;
    while (fib[k - 1] + fib[k - 2] < n) {
        fib[k] = fib[k - 1] + fib[k - 2];
        k++;
    }

    // Thực hiện Shell Sort với 
    // khoảng cách là dãy Fibonaci
    for (int idx = k - 1; idx >= 0; idx--) {
        int gap = fib[idx];
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}
Với danh sách có n = 20 phần tử, dãy khoảng cách (gap) được sử dụng là [13, 8, 5, 3, 2, 1]. Số lần thực hiện lệnh arr[j] = arr[j - gap] khi gap = 8 và danh sách được sắp xếp ngược (trong trường hợp tệ nhất) là ____.
[<A>]	12
Câu 152.
[AN]	Cho đoạn code C/C++ thực hiện giải thuật sắp xếp như sau:
void shellSort(int arr[], int n) {
    // Sinh dãy Fibonaci làm khoảng cách
    int fib[100], k = 2;
    fib[0] = 1; fib[1] = 1;
    while (fib[k - 1] + fib[k - 2] < n) {
        fib[k] = fib[k - 1] + fib[k - 2];
        k++;
    }

    // Thực hiện Shell Sort với 
    // khoảng cách là dãy Fibonaci
    for (int idx = k - 1; idx >= 0; idx--) {
        int gap = fib[idx];
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}
Trong trường hợp tốt nhất (danh sách đã sắp xếp), số lần thực hiện lệnh arr[j] = arr[j - gap] khi gap = 8 là ____.
[<A>]	0
Câu 153.
[AN]	Cho đoạn code C/C++ thực hiện giải thuật sắp xếp như sau:
void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
Với danh sách có n = 16 phần tử, số lần gọi hàm mergeSort() trong toàn bộ quá trình sắp xếp là ____.
[<A>]	31
Câu 154.
[AN]	Cho đoạn code C/C++ thực hiện giải thuật như sau:
void bubbleSort(int arr[], int n, int &count) {
    count = 0;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            count++;
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
        }
    }
}
Gọi bubbleSort(arr, 4, count) với arr = {4, 3, 2, 1}. Tổng số phép so sánh là ____.
[<A>]	6
Câu 155.
[AN]	Cho đoạn code C/C++ thực hiện giải thuật như sau:
void selectionSort(int arr[], int n, int &count) {
    count = 0;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            count++;
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        if (minIdx != i) swap(arr[i], arr[minIdx]);
    }
}
Gọi selectionSort(arr, 5, count) với arr = {9, 7, 5, 3, 1}. Số phép so sánh là ____.
[<A>]	10
Câu 156.
[AN]	Cho đoạn code C/C++ thực hiện giải thuật như sau:
void insertionSort(int arr[], int n, int &count) {
    count = 0;
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            count++;
            arr[j + 1] = arr[j];
            j--;
        }
        if (j >= 0) count++; // tính so sánh cuối cùng sai
        arr[j + 1] = key;
    }
}
Gọi insertionSort(arr, 4, count) với arr = {1, 2, 3, 4} (đã sắp xếp). Số phép so sánh là ____.
[<A>]	3
Câu 157.
[AN]	Cho đoạn code C/C++ như sau:
int count = 0;
for (int i = n; i >= 1; i /= 2) {
    count++;
}
Với n=100, giá trị cuối cùng của count là ____.
[<A>]	7
Câu 158.
[AN]	Cho đoạn code C/C++ như sau:
void bubbleSort(int arr[], int n, int &count) {
    count = 0;
    bool swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            count++;
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}
Gọi bubbleSort(arr, 5, count) với arr = {1, 2, 3, 4, 5}. Giá trị của count là ____.
[<A>]	4
Câu 159.
[AN]	Cho đoạn code C/C++ như sau:
void selectionSort(int arr[], int n, int &swapCount) {
    swapCount = 0;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        if (minIdx != i) {
            swap(arr[i], arr[minIdx]);
            swapCount++;
        }
    }
}
Cho arr = {5, 4, 3, 2, 1}, gọi hàm selectionSort(arr, 5, swapCount). Số lần hoán đổi là ____.
[<A>]	2
Câu 160.
[AN]	Cho đoạn code C/C++ như sau:
int binarySearchCount(int arr[], int n, int key) {
    int left = 0, right = n - 1, count = 0;
    while (left <= right) {
        count++;
        int mid = (left + right) / 2;
        if (arr[mid] == key) break;
        else if (arr[mid] < key) left = mid + 1;
        else right = mid - 1;
    }
    return count;
}
Gọi binarySearchCount(arr, 7, 13) với arr = {1, 3, 5, 7, 9, 11, 15}. Số lần so sánh thực hiện là ____.
[<A>]	3
