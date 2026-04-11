import type { AlgorithmChallengeSet } from './types';

interface Chapter2AlgorithmSpec {
    algoId: string;
    algorithmKey: string;
    displayName: string;
    demoKey: string;
    inputMode: 'array' | 'array-target';
    mediumAction: 'swap' | 'insert' | 'compare';
    mediumInitialArray: number[];
    mediumStep1: { from: number; to: number; result: number[] };
    mediumStep2: { from: number; to: number; result: number[] };
    hardBehavior: string;
}

interface FunctionSnippet {
    algorithmKey: string;
    displayName: string;
    code: string;
}

interface HardValidationCase {
    description: string;
    args: unknown[];
    expected: unknown;
}

const CORRECT_FUNCTION_SNIPPETS: Record<string, FunctionSnippet> = {
    'linear-search': {
        algorithmKey: 'linear-search',
        displayName: 'Tìm kiếm tuyến tính',
        code: `function MISSING_FN(arr, target){\n  for(let i=0;i<arr.length;i++){\n    if(arr[i]===target) return i;\n  }\n  return -1;\n}`
    },
    'binary-search': {
        algorithmKey: 'binary-search',
        displayName: 'Tìm kiếm nhị phân',
        code: `function MISSING_FN(arr, target){\n  let left=0,right=arr.length-1;\n  while(left<=right){\n    const mid=Math.floor((left+right)/2);\n    if(arr[mid]===target) return mid;\n    if(arr[mid]<target) left=mid+1;\n    else right=mid-1;\n  }\n  return -1;\n}`
    },
    'bubble-sort': {
        algorithmKey: 'bubble-sort',
        displayName: 'Sắp xếp nổi bọt',
        code: `function MISSING_FN(arr){\n  const out=[...arr];\n  for(let i=0;i<out.length-1;i++){\n    for(let j=0;j<out.length-i-1;j++){\n      if(out[j]>out[j+1]) [out[j],out[j+1]]=[out[j+1],out[j]];\n    }\n  }\n  return out;\n}`
    },
    'selection-sort': {
        algorithmKey: 'selection-sort',
        displayName: 'Sắp xếp chọn',
        code: `function MISSING_FN(arr){\n  const out=[...arr];\n  for(let i=0;i<out.length-1;i++){\n    let min=i;\n    for(let j=i+1;j<out.length;j++){\n      if(out[j]<out[min]) min=j;\n    }\n    if(min!==i) [out[i],out[min]]=[out[min],out[i]];\n  }\n  return out;\n}`
    },
    'insertion-sort': {
        algorithmKey: 'insertion-sort',
        displayName: 'Sắp xếp chèn',
        code: `function MISSING_FN(arr){\n  const out=[...arr];\n  for(let i=1;i<out.length;i++){\n    const key=out[i];\n    let j=i-1;\n    while(j>=0&&out[j]>key){\n      out[j+1]=out[j];\n      j--;\n    }\n    out[j+1]=key;\n  }\n  return out;\n}`
    },
    'interchange-sort': {
        algorithmKey: 'interchange-sort',
        displayName: 'Sắp xếp đổi chỗ trực tiếp',
        code: `function MISSING_FN(arr){\n  const out=[...arr];\n  for(let i=0;i<out.length-1;i++){\n    for(let j=i+1;j<out.length;j++){\n      if(out[i]>out[j]) [out[i],out[j]]=[out[j],out[i]];\n    }\n  }\n  return out;\n}`
    },
    'shaker-sort': {
        algorithmKey: 'shaker-sort',
        displayName: 'Sắp xếp lắc',
        code: `function MISSING_FN(arr){\n  const out=[...arr];\n  let left=0,right=out.length-1;\n  while(left<right){\n    for(let i=left;i<right;i++) if(out[i]>out[i+1]) [out[i],out[i+1]]=[out[i+1],out[i]];\n    right--;\n    for(let i=right;i>left;i--) if(out[i-1]>out[i]) [out[i-1],out[i]]=[out[i],out[i-1]];\n    left++;\n  }\n  return out;\n}`
    },
    'shell-sort': {
        algorithmKey: 'shell-sort',
        displayName: 'Sắp xếp Shell',
        code: `function MISSING_FN(arr){\n  const out=[...arr];\n  for(let gap=Math.floor(out.length/2);gap>0;gap=Math.floor(gap/2)){\n    for(let i=gap;i<out.length;i++){\n      const temp=out[i];\n      let j=i;\n      while(j>=gap&&out[j-gap]>temp){\n        out[j]=out[j-gap];\n        j-=gap;\n      }\n      out[j]=temp;\n    }\n  }\n  return out;\n}`
    },
    'binary-insertion-sort': {
        algorithmKey: 'binary-insertion-sort',
        displayName: 'Sắp xếp chèn nhị phân',
        code: `function MISSING_FN(arr){\n  const out=[...arr];\n  for(let i=1;i<out.length;i++){\n    const key=out[i];\n    let left=0,right=i-1;\n    while(left<=right){\n      const mid=Math.floor((left+right)/2);\n      if(out[mid]<=key) left=mid+1; else right=mid-1;\n    }\n    for(let j=i-1;j>=left;j--) out[j+1]=out[j];\n    out[left]=key;\n  }\n  return out;\n}`
    },
    'merge-sort': {
        algorithmKey: 'merge-sort',
        displayName: 'Sắp xếp trộn',
        code: `function MISSING_FN(arr){\n  if(arr.length<=1) return arr;\n  const mid=Math.floor(arr.length/2);\n  const left=MISSING_FN(arr.slice(0,mid));\n  const right=MISSING_FN(arr.slice(mid));\n  const out=[];\n  let i=0,j=0;\n  while(i<left.length&&j<right.length){\n    out.push(left[i]<=right[j]?left[i++]:right[j++]);\n  }\n  return out.concat(left.slice(i),right.slice(j));\n}`
    },
    'quick-sort': {
        algorithmKey: 'quick-sort',
        displayName: 'Sắp xếp nhanh',
        code: `function MISSING_FN(arr){\n  if(arr.length<=1) return arr;\n  const pivot=arr[arr.length-1];\n  const left=[],right=[];\n  for(let i=0;i<arr.length-1;i++){\n    if(arr[i]<pivot) left.push(arr[i]); else right.push(arr[i]);\n  }\n  return [...MISSING_FN(left),pivot,...MISSING_FN(right)];\n}`
    },
    'heap-sort': {
        algorithmKey: 'heap-sort',
        displayName: 'Sắp xếp vun đống',
        code: `function MISSING_FN(arr){\n  const out=[...arr];\n  const heapify=(n,i)=>{\n    let largest=i;\n    const l=2*i+1,r=2*i+2;\n    if(l<n&&out[l]>out[largest]) largest=l;\n    if(r<n&&out[r]>out[largest]) largest=r;\n    if(largest!==i){ [out[i],out[largest]]=[out[largest],out[i]]; heapify(n,largest); }\n  };\n  for(let i=Math.floor(out.length/2)-1;i>=0;i--) heapify(out.length,i);\n  for(let end=out.length-1;end>0;end--){\n    [out[0],out[end]]=[out[end],out[0]];\n    heapify(end,0);\n  }\n  return out;\n}`
    },
    'counting-sort': {
        algorithmKey: 'counting-sort',
        displayName: 'Sắp xếp đếm',
        code: `function MISSING_FN(arr){\n  if(arr.length===0) return [];\n  const max=Math.max(...arr),min=Math.min(...arr);\n  const count=new Array(max-min+1).fill(0);\n  for(const v of arr) count[v-min]++;\n  const out=[];\n  for(let i=0;i<count.length;i++){\n    while(count[i]-->0) out.push(i+min);\n  }\n  return out;\n}`
    },
    'radix-sort': {
        algorithmKey: 'radix-sort',
        displayName: 'Sắp xếp cơ số',
        code: `function MISSING_FN(arr){\n  const out=[...arr];\n  const max=Math.max(...out,0);\n  for(let exp=1;Math.floor(max/exp)>0;exp*=10){\n    const buckets=Array.from({length:10},()=>[]);\n    for(const num of out){\n      const digit=Math.floor(num/exp)%10;\n      buckets[digit].push(num);\n    }\n    let idx=0;\n    for(const bucket of buckets){ for(const num of bucket) out[idx++]=num; }\n  }\n  return out;\n}`
    }
};

const DISTRACTOR_SNIPPETS: FunctionSnippet[] = [
    CORRECT_FUNCTION_SNIPPETS['linear-search'],
    CORRECT_FUNCTION_SNIPPETS['binary-search'],
    CORRECT_FUNCTION_SNIPPETS['quick-sort'],
    CORRECT_FUNCTION_SNIPPETS['merge-sort'],
    CORRECT_FUNCTION_SNIPPETS['heap-sort'],
    CORRECT_FUNCTION_SNIPPETS['counting-sort'],
    CORRECT_FUNCTION_SNIPPETS['insertion-sort']
];

const EASY_DISTRACTOR_LABELS = [
    'Sắp xếp nổi bọt',
    'Sắp xếp chọn',
    'Sắp xếp chèn',
    'Sắp xếp trộn',
    'Sắp xếp nhanh',
    'Sắp xếp vun đống',
    'Sắp xếp đếm',
    'Sắp xếp cơ số',
    'Tìm kiếm tuyến tính',
    'Tìm kiếm nhị phân'
];

const CHAPTER_2_ALGO_SPECS: Chapter2AlgorithmSpec[] = [
    {
        algoId: 'linearSearch',
        algorithmKey: 'linear-search',
        demoKey: 'LinearSearch',
        inputMode: 'array-target',
        mediumAction: 'compare',
        mediumInitialArray: [5, 9, 2, 7, 4],
        mediumStep1: { from: 0, to: 0, result: [5, 9, 2, 7, 4] },
        mediumStep2: { from: 1, to: 1, result: [5, 9, 2, 7, 4] },
        displayName: 'Tìm kiếm tuyến tính',
        hardBehavior: 'Duyệt từng phần tử từ trái sang phải cho đến khi tìm thấy mục tiêu.'
    },
    {
        algoId: 'binarySearch',
        algorithmKey: 'binary-search',
        displayName: 'Tìm kiếm nhị phân',
        demoKey: 'BinarySearch',
        inputMode: 'array-target',
        mediumAction: 'compare',
        mediumInitialArray: [2, 4, 6, 8, 10, 12],
        mediumStep1: { from: 2, to: 2, result: [2, 4, 6, 8, 10, 12] },
        mediumStep2: { from: 4, to: 4, result: [2, 4, 6, 8, 10, 12] },
        hardBehavior: 'Thu hẹp nửa phạm vi tìm kiếm sau mỗi bước và trả về chỉ số phù hợp.'
    },
    {
        algoId: 'bubbleSort',
        algorithmKey: 'bubble-sort',
        displayName: 'Sắp xếp nổi bọt',
        demoKey: 'BubbleSort',
        inputMode: 'array',
        mediumAction: 'swap',
        mediumInitialArray: [5, 3, 4, 1],
        mediumStep1: { from: 0, to: 1, result: [3, 5, 4, 1] },
        mediumStep2: { from: 1, to: 2, result: [3, 4, 5, 1] },
        hardBehavior: 'Lặp nhiều lượt và đổi chỗ hai phần tử kề nhau khi sai thứ tự.'
    },
    {
        algoId: 'selectionSort',
        algorithmKey: 'selection-sort',
        displayName: 'Sắp xếp chọn',
        demoKey: 'SelectionSort',
        inputMode: 'array',
        mediumAction: 'swap',
        mediumInitialArray: [4, 2, 3, 1],
        mediumStep1: { from: 0, to: 3, result: [1, 2, 3, 4] },
        mediumStep2: { from: 1, to: 1, result: [1, 2, 3, 4] },
        hardBehavior: 'Chọn phần tử nhỏ nhất ở đoạn chưa sắp xếp và đưa lên đầu đoạn đó.'
    },
    {
        algoId: 'insertionSort',
        algorithmKey: 'insertion-sort',
        displayName: 'Sắp xếp chèn',
        demoKey: 'InsertionSort',
        inputMode: 'array',
        mediumAction: 'insert',
        mediumInitialArray: [5, 2, 4, 6, 1],
        mediumStep1: { from: 1, to: 0, result: [2, 5, 4, 6, 1] },
        mediumStep2: { from: 2, to: 1, result: [2, 4, 5, 6, 1] },
        hardBehavior: 'Chèn từng phần tử vào đúng vị trí trong đoạn đầu đã được sắp xếp.'
    },
    {
        algoId: 'interchangeSort',
        algorithmKey: 'interchange-sort',
        displayName: 'Sắp xếp đổi chỗ trực tiếp',
        demoKey: 'InterchangeSort',
        inputMode: 'array',
        mediumAction: 'swap',
        mediumInitialArray: [4, 1, 3, 2],
        mediumStep1: { from: 0, to: 1, result: [1, 4, 3, 2] },
        mediumStep2: { from: 1, to: 2, result: [1, 3, 4, 2] },
        hardBehavior: 'So sánh mọi cặp và đổi chỗ ngay khi tìm thấy phần tử nhỏ hơn.'
    },
    {
        algoId: 'shakerSort',
        algorithmKey: 'shaker-sort',
        displayName: 'Sắp xếp lắc',
        demoKey: 'ShakerSort',
        inputMode: 'array',
        mediumAction: 'swap',
        mediumInitialArray: [3, 5, 2, 4],
        mediumStep1: { from: 1, to: 2, result: [3, 2, 5, 4] },
        mediumStep2: { from: 2, to: 3, result: [3, 2, 4, 5] },
        hardBehavior: 'Nổi bọt theo hai chiều: trái sang phải rồi phải sang trái.'
    },
    {
        algoId: 'shellSort',
        algorithmKey: 'shell-sort',
        displayName: 'Sắp xếp Shell',
        demoKey: 'ShellSort',
        inputMode: 'array',
        mediumAction: 'insert',
        mediumInitialArray: [8, 5, 3, 7, 6, 2],
        mediumStep1: { from: 3, to: 1, result: [8, 7, 3, 5, 6, 2] },
        mediumStep2: { from: 5, to: 3, result: [8, 7, 3, 2, 6, 5] },
        hardBehavior: 'Sắp xếp theo khoảng cách giảm dần và kết thúc bằng lượt chèn với gap bằng 1.'
    },
    {
        algoId: 'binaryInsertionSort',
        algorithmKey: 'binary-insertion-sort',
        displayName: 'Sắp xếp chèn nhị phân',
        demoKey: 'BinaryInsertionSort',
        inputMode: 'array',
        mediumAction: 'insert',
        mediumInitialArray: [7, 3, 5, 2],
        mediumStep1: { from: 1, to: 0, result: [3, 7, 5, 2] },
        mediumStep2: { from: 2, to: 1, result: [3, 5, 7, 2] },
        hardBehavior: 'Tìm vị trí chèn bằng tìm kiếm nhị phân rồi dồn phần tử để chèn.'
    },
    {
        algoId: 'mergeSort',
        algorithmKey: 'merge-sort',
        displayName: 'Sắp xếp trộn',
        demoKey: 'MergeSort',
        inputMode: 'array',
        mediumAction: 'compare',
        mediumInitialArray: [4, 1, 3, 2],
        mediumStep1: { from: 0, to: 1, result: [1, 4, 3, 2] },
        mediumStep2: { from: 2, to: 3, result: [1, 4, 2, 3] },
        hardBehavior: 'Đệ quy chia mảng và trộn các nửa đã sắp xếp thành kết quả cuối.'
    },
    {
        algoId: 'quickSort',
        algorithmKey: 'quick-sort',
        displayName: 'Sắp xếp nhanh',
        demoKey: 'QuickSort',
        inputMode: 'array',
        mediumAction: 'swap',
        mediumInitialArray: [5, 1, 4, 2],
        mediumStep1: { from: 0, to: 1, result: [1, 5, 4, 2] },
        mediumStep2: { from: 1, to: 3, result: [1, 2, 4, 5] },
        hardBehavior: 'Phân hoạch quanh pivot rồi đệ quy sắp xếp hai phía trái phải.'
    },
    {
        algoId: 'heapSort',
        algorithmKey: 'heap-sort',
        displayName: 'Sắp xếp vun đống',
        demoKey: 'HeapSort',
        inputMode: 'array',
        mediumAction: 'swap',
        mediumInitialArray: [4, 10, 3, 5, 1],
        mediumStep1: { from: 0, to: 1, result: [10, 4, 3, 5, 1] },
        mediumStep2: { from: 1, to: 3, result: [10, 5, 3, 4, 1] },
        hardBehavior: 'Xây max-heap rồi liên tục lấy phần tử lớn nhất ra cuối mảng.'
    },
    {
        algoId: 'countingSort',
        algorithmKey: 'counting-sort',
        displayName: 'Sắp xếp đếm',
        demoKey: 'CountingSort',
        inputMode: 'array',
        mediumAction: 'compare',
        mediumInitialArray: [4, 1, 3, 1, 2],
        mediumStep1: { from: 1, to: 0, result: [1, 4, 3, 1, 2] },
        mediumStep2: { from: 3, to: 1, result: [1, 1, 4, 3, 2] },
        hardBehavior: 'Đếm tần suất xuất hiện rồi dựng lại mảng theo các nhóm đếm.'
    },
    {
        algoId: 'radixSort',
        algorithmKey: 'radix-sort',
        displayName: 'Sắp xếp cơ số',
        demoKey: 'RadixSort',
        inputMode: 'array',
        mediumAction: 'compare',
        mediumInitialArray: [170, 45, 75, 90],
        mediumStep1: { from: 1, to: 0, result: [170, 90, 45, 75] },
        mediumStep2: { from: 2, to: 1, result: [170, 90, 75, 45] },
        hardBehavior: 'Sắp xếp theo từng chữ số với lượt đếm ổn định ở mỗi hàng số.'
    }
];

const buildEasyChoices = (correctLabel: string): {
    choices: Array<{ id: string; label: string; displayKey: 'A' | 'B' | 'C' }>;
    correctChoiceId: string;
} => {
    const distractors = EASY_DISTRACTOR_LABELS.filter(label => label !== correctLabel).slice(0, 2);
    const base = [correctLabel, distractors[0], distractors[1]];
    const rotate = correctLabel.length % 3;
    const ordered = [base[rotate % 3], base[(rotate + 1) % 3], base[(rotate + 2) % 3]];
    const ids = ['opt-a', 'opt-b', 'opt-c'];
    const keys: Array<'A' | 'B' | 'C'> = ['A', 'B', 'C'];

    const choices = ordered.map((label, idx) => ({
        id: ids[idx],
        label,
        displayKey: keys[idx]
    }));

    const correctIndex = ordered.findIndex(label => label === correctLabel);
    return {
        choices,
        correctChoiceId: ids[correctIndex]
    };
};

const sortAsc = (arr: number[]): number[] => [...arr].sort((a, b) => a - b);

const buildHardValidationCases = (spec: Chapter2AlgorithmSpec): HardValidationCase[] => {
    if (spec.algorithmKey === 'linear-search') {
        return [
            {
                description: 'Tìm thấy phần tử ở giữa mảng',
                args: [[5, 9, 2, 7, 4], 7],
                expected: 3
            },
            {
                description: 'Không tìm thấy phần tử',
                args: [[5, 9, 2, 7, 4], 99],
                expected: -1
            },
            {
                description: 'Mảng có phần tử trùng, trả về vị trí xuất hiện đầu tiên',
                args: [[3, 1, 3, 3, 9], 3],
                expected: 0
            },
            {
                description: 'Mảng rỗng',
                args: [[], 1],
                expected: -1
            }
        ];
    }

    if (spec.algorithmKey === 'binary-search') {
        return [
            {
                description: 'Tìm thấy phần tử trong mảng đã sắp xếp',
                args: [[2, 4, 6, 8, 10, 12], 8],
                expected: 3
            },
            {
                description: 'Không tìm thấy phần tử trong mảng đã sắp xếp',
                args: [[2, 4, 6, 8, 10, 12], 5],
                expected: -1
            },
            {
                description: 'Phần tử đầu mảng',
                args: [[1, 3, 5, 7, 9], 1],
                expected: 0
            },
            {
                description: 'Phần tử cuối mảng',
                args: [[1, 3, 5, 7, 9], 9],
                expected: 4
            }
        ];
    }

    if (spec.algorithmKey === 'radix-sort') {
        const cases = [
            [170, 45, 75, 90, 802, 24, 2, 66],
            [5, 1, 0, 5, 3, 9, 8],
            [10, 100, 1000, 1, 11, 101],
            [0, 0, 0, 0]
        ];
        return cases.map((input, idx) => ({
            description: `Radix case ${idx + 1}`,
            args: [input],
            expected: sortAsc(input)
        }));
    }

    const genericSortCases = [
        [...spec.mediumInitialArray],
        [...spec.mediumInitialArray].reverse(),
        [9, 1, 8, 2, 7, 3, 6],
        [4, 4, 1, 2, 2, 9],
        [1],
        []
    ];

    return genericSortCases.map((input, idx) => ({
        description: `Sort case ${idx + 1}`,
        args: [input],
        expected: sortAsc(input)
    }));
};

const getCodeTemplate = (inputMode: Chapter2AlgorithmSpec['inputMode']) =>
    inputMode === 'array-target'
        ? 'function solve(input, target) {\n  return MISSING_FN(input, target);\n}'
        : 'function solve(input) {\n  return MISSING_FN(input);\n}';

const getDistractors = (algorithmKey: string): FunctionSnippet[] =>
    DISTRACTOR_SNIPPETS.filter(snippet => snippet.algorithmKey !== algorithmKey).slice(0, 3);

const buildChallengeSet = (spec: Chapter2AlgorithmSpec): AlgorithmChallengeSet => {
    const correct = CORRECT_FUNCTION_SNIPPETS[spec.algorithmKey];
    const [d1, d2, d3] = getDistractors(spec.algorithmKey);
    const easyChoices = buildEasyChoices(spec.displayName);
    const validationCases = buildHardValidationCases(spec);
    const firstValidation = validationCases[0];
    const sampleArray = Array.isArray(firstValidation?.args?.[0])
        ? (firstValidation.args[0] as number[])
        : undefined;
    const sampleTarget = typeof firstValidation?.args?.[1] === 'number'
        ? (firstValidation.args[1] as number)
        : undefined;

    return {
        version: '1.0.0',
        chapter: 2,
        topic: `Thử thách ${spec.displayName}`,
        challenges: [
            {
                id: `${spec.algorithmKey}-easy`,
                difficulty: 'easy',
                mode: 'identify-from-visual',
                prompt: `Quan sát minh họa và chọn đúng thuật toán ${spec.displayName}.`,
                algorithmKey: spec.algorithmKey,
                tags: ['chapter2', 'visual-identify'],
                visualization: {
                    demoKey: spec.demoKey,
                    snapshotRef: 'auto-frame',
                    sampleArray,
                    target: sampleTarget
                },
                choices: easyChoices.choices,
                correctChoiceId: easyChoices.correctChoiceId,
                scoring: {
                    basePoints: 100,
                    wrongPenalty: 20
                }
            },
            {
                id: `${spec.algorithmKey}-medium`,
                difficulty: 'medium',
                mode: 'perform-by-steps',
                prompt: `Thực hiện đúng từng bước của ${spec.displayName}. Sai thì giữ n-1 bước đã đúng.`,
                algorithmKey: spec.algorithmKey,
                algorithmLabel: spec.displayName,
                tags: ['chapter2', 'step-by-step'],
                initialState: {
                    array: spec.mediumInitialArray,
                    stepCursor: 1
                },
                expectedSteps: [
                    {
                        step: 1,
                        action: spec.mediumAction,
                        payload: {
                            from: spec.mediumStep1.from,
                            to: spec.mediumStep1.to
                        },
                        stateAfter: {
                            array: spec.mediumStep1.result,
                            stepCursor: 2
                        }
                    },
                    {
                        step: 2,
                        action: spec.mediumAction,
                        payload: {
                            from: spec.mediumStep2.from,
                            to: spec.mediumStep2.to
                        },
                        stateAfter: {
                            array: spec.mediumStep2.result,
                            stepCursor: 3
                        }
                    }
                ],
                rollbackPolicy: {
                    type: 'keep-n-minus-1',
                    keepCompletedSteps: true,
                    maxMistakes: 3
                },
                scoring: {
                    basePoints: 150,
                    wrongPenalty: 15,
                    firstTryBonus: 30
                }
            },
            {
                id: `${spec.algorithmKey}-hard-v1`,
                difficulty: 'hard',
                mode: 'complete-missing-function',
                hardVariant: 'function-only-4',
                prompt: `Chọn hàm đúng để hoàn tất code và mô phỏng ${spec.displayName}.`,
                algorithmKey: spec.algorithmKey,
                tags: ['chapter2', 'missing-function'],
                codeTemplate: getCodeTemplate(spec.inputMode),
                missingFunctionName: 'MISSING_FN',
                visualizationTarget: {
                    demoKey: spec.demoKey,
                    expectedBehavior: spec.hardBehavior,
                    sampleArray,
                    target: sampleTarget
                },
                validationCases,
                options: [
                    {
                        id: 'fn-a',
                        actualAlgorithm: correct.algorithmKey,
                        functionCode: correct.code
                    },
                    {
                        id: 'fn-b',
                        actualAlgorithm: d1.algorithmKey,
                        functionCode: d1.code
                    },
                    {
                        id: 'fn-c',
                        actualAlgorithm: d2.algorithmKey,
                        functionCode: d2.code
                    },
                    {
                        id: 'fn-d',
                        actualAlgorithm: d3.algorithmKey,
                        functionCode: d3.code
                    }
                ],
                correctOptionId: 'fn-a',
                scoring: {
                    basePoints: 220,
                    wrongPenalty: 40,
                    firstTryBonus: 40
                }
            },
            {
                id: `${spec.algorithmKey}-hard-v2`,
                difficulty: 'hard',
                mode: 'complete-missing-function',
                hardVariant: 'mixed-labels-4',
                prompt: 'Chọn hàm đúng. Nhãn tên thuật toán có thể bị đánh lạc hướng.',
                algorithmKey: spec.algorithmKey,
                tags: ['chapter2', 'mixed-labels'],
                codeTemplate: getCodeTemplate(spec.inputMode),
                missingFunctionName: 'MISSING_FN',
                visualizationTarget: {
                    demoKey: spec.demoKey,
                    expectedBehavior: spec.hardBehavior,
                    sampleArray,
                    target: sampleTarget
                },
                validationCases,
                options: [
                    {
                        id: 'fn-a',
                        actualAlgorithm: correct.algorithmKey,
                        displayedAlgorithmLabel: spec.displayName,
                        functionCode: correct.code
                    },
                    {
                        id: 'fn-b',
                        actualAlgorithm: d1.algorithmKey,
                        displayedAlgorithmLabel: spec.displayName,
                        functionCode: d1.code
                    },
                    {
                        id: 'fn-c',
                        actualAlgorithm: d2.algorithmKey,
                        displayedAlgorithmLabel: d3.displayName,
                        functionCode: d2.code
                    },
                    {
                        id: 'fn-d',
                        actualAlgorithm: d3.algorithmKey,
                        displayedAlgorithmLabel: d2.displayName,
                        functionCode: d3.code
                    }
                ],
                correctOptionId: 'fn-a',
                labelRules: {
                    truthfulLabeledOptionIds: ['fn-a'],
                    misleadingLabeledOptionIds: ['fn-b', 'fn-c', 'fn-d'],
                    swappedLabelPair: ['fn-c', 'fn-d']
                },
                scoring: {
                    basePoints: 240,
                    wrongPenalty: 45,
                    firstTryBonus: 50
                }
            }
        ]
    };
};

export const CHAPTER2_CHALLENGE_SETS: Record<string, AlgorithmChallengeSet> = CHAPTER_2_ALGO_SPECS.reduce(
    (acc, spec) => {
        acc[spec.algoId] = buildChallengeSet(spec);
        return acc;
    },
    {} as Record<string, AlgorithmChallengeSet>
);

export const getChallengeSetForAlgoId = (algoId: string): AlgorithmChallengeSet | null =>
    CHAPTER2_CHALLENGE_SETS[algoId] ?? null;
