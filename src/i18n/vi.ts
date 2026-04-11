// src/i18n/vi.ts
// Vietnamese (Tiếng Việt) translation file

export const viTranslations = {
  // ═══════════════════════════════════════════════════════════════
  // MAIN MENU
  // ═══════════════════════════════════════════════════════════════
  mainMenu: {
    title: 'AlgoQuest - Cuộc Phiêu Lưu Thuật Toán',
    newGame: 'Chơi Mới',
    continueGame: 'Tiếp Tục',
    multiplayer: 'Chế Độ Nhiều Người',
    settings: 'Cài Đặt',
    logout: 'Đăng Xuất',
    version: 'Phiên Bản',
    
    // Login/Register
    login: 'Đăng Nhập',
    register: 'Đăng Ký',
    username: 'Tên Người Chơi',
    password: 'Mật Khẩu',
    firstName: 'Tên',
    lastName: 'Họ',
    avatar: 'Ảnh Đại Diện',
    forgotPassword: 'Quên Mật Khẩu?',
    
    // Messages
    loginSuccess: 'Đăng nhập thành công!',
    registerSuccess: 'Đăng ký thành công!',
    loginError: 'Đăng nhập thất bại. Vui lòng thử lại.',
    registerError: 'Đăng ký thất bại. Tên người chơi đã tồn tại.',
    
    invalidUsername: 'Tên người chơi không hợp lệ',
    invalidPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
  },

  // ═══════════════════════════════════════════════════════════════
  // HUB WORLD
  // ═══════════════════════════════════════════════════════════════
  hub: {
    title: 'Thế Giới Trung Tâm',
    subtitle: 'Thánh Địa Dòng Chảy',
    welcome: 'Chào mừng bạn trở lại!',
    worldDescription: 'Chào mừng bạn trở lại! Hãy gặp gỡ các NPC để nhận nhiệm vụ.',
    startAdventure: 'Bắt Đầu Hành Trình',
    
    // NPCs
    npcs: {
      professor: 'Giáo Sư Alric',
      professorRole: 'Nhiệm Vụ Chiến Dịch',
      archivist: 'Linh',
      archistRole: 'Thư Viện Biết Thức',
      merchant: 'Bork',
      merchantRole: 'Nước Uống Kỳ Diệu',
      guildLeader: 'Thủ Lĩnh Guild',
      guildRole: 'Quản Lý Đấu Trường',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // ADVENTURE / QUESTS
  // ═══════════════════════════════════════════════════════════════
  adventure: {
    title: 'Hành Trình Phiêu Lưu',
    stage: 'Ải',
    chapter: 'Chương',
    questStatus: 'Trạng Thái Nhiệm Vụ',
    locked: 'Khóa',
    unlocked: 'Mở Khóa',
    inProgress: 'Đang Tiến Hành',
    completed: 'Hoàn Thành',
    reward: 'Phần Thưởng',
    claimReward: 'Nhận Phần Thưởng',
    rewardClaimed: 'Đã Nhận Phần Thưởng',
    
    questHistory: 'Lịch Sử Ải',
    attempts: 'Lần Thử',
    bestScore: 'Điểm Cao Nhất',
    completedAt: 'Hoàn Thành Lúc',
  },

  // ═══════════════════════════════════════════════════════════════
  // DUNGEON
  // ═══════════════════════════════════════════════════════════════
  dungeon: {
    title: 'Hầm Ngục',
    enterDungeon: 'Vào Hầm Ngục',
    exitDungeon: 'Rời Hầm Ngục',
    playerHealth: 'Máu Của Tôi',
    monsterHealth: 'Máu Quái Vật',
    roomType: 'Loại Phòng',
    treasure: 'Kho Báu',
    enemy: 'Kẻ Thù',
    boss: 'Trùm Cuối',
    explored: 'Đã Khám Phá',
    unexplored: 'Chưa Khám Phá',
    
    // Movement
    north: 'Hướng Bắc',
    south: 'Hướng Nam',
    east: 'Hướng Đông',
    west: 'Hướng Tây',
    forward: 'Tiến Về Phía Trước',
    backward: 'Lùi Về Phía Sau',
    left: 'Rẽ Trái',
    right: 'Rẽ Phải',
    
    // Messages
    cannotMove: 'Không thể đi hướng này!',
    battleStarted: 'Một trận chiến bắt đầu!',
    treasureFound: 'Bạn tìm thấy một hộp kho báu!',
    bossFound: 'Trùm Boss xuất hiện!',
  },

  // ═══════════════════════════════════════════════════════════════
  // COMBAT
  // ═══════════════════════════════════════════════════════════════
  combat: {
    title: 'Trận Chiến',
    playerTurn: 'Lượt của Tôi',
    enemyTurn: 'Lượt của Kẻ Thù',
    question: 'Câu Hỏi',
    answer: 'Trả Lời',
    submit: 'Nộp Bài',
    correct: 'Chính Xác!',
    incorrect: 'Sai Rồi!',
    victory: 'Chiến Thắng!',
    defeat: 'Thua Cuộc!',
    hint: 'Gợi Ý',
    hintsRemaining: 'Gợi Ý Còn Lại',
    
    // Monster info
    monsterName: 'Tên Quái',
    monsterType: 'Loại Quái',
    difficulty: 'Độ Khó',
    rewards: 'Phần Thưởng',
  },

  // ═══════════════════════════════════════════════════════════════
  // STAGE PLAY / QUIZ
  // ═══════════════════════════════════════════════════════════════
  stagePlay: {
    title: 'Bài Học',
    lesson: 'Bài Giảng',
    question: 'Câu Hỏi',
    visualization: 'Minh Họa',
    next: 'Tiếp Theo',
    previous: 'Quay Lại',
    submit: 'Nộp Bài',
    finish: 'Kết Thúc',
    
    // Question types
    mcq: 'Trắc Nghiệm',
    fillBlank: 'Điền Vào Chỗ Trống',
    matching: 'Nối Cặp',
    programming: 'Lập Trình',
    
    // Progress
    step: 'Bước',
    of: 'của',
    progress: 'Tiến Độ',
    
    // Feedback
    answerSubmitted: 'Bài làm được nộp!',
    correctAnswer: 'Câu trả lời chính xác!',
    incorrectAnswer: 'Câu trả lời sai. Hãy thử lại!',
    
    // Results
    yourScore: 'Điểm Của Bạn',
    points: 'Điểm',
    accuracy: 'Độ Chính Xác',
    timeSpent: 'Thời Gian Hoàn Thành',
  },

  // ═══════════════════════════════════════════════════════════════
  // ALGO LAB
  // ═══════════════════════════════════════════════════════════════
  algoLab: {
    title: 'Phòng Thí Nghiệm Thuật Toán',
    selectAlgorithm: 'Chọn Thuật Toán',
    inputData: 'Dữ Liệu Đầu Vào',
    visualize: 'Minh Họa',
    complexity: 'Độ Phức Tạp',
    timeComplexity: 'Độ Phức Tạp Thời Gian',
    spaceComplexity: 'Độ Phức Tạp Không Gian',
    
    // Algorithm categories
    sorting: 'Sắp Xếp',
    searching: 'Tìm Kiếm',
    dataStructures: 'Cấu Trúc Dữ Liệu',
    graph: 'Đồ Thị',
    dynamicProgramming: 'Lập Trình Động',
    
    // Messages
    enterData: 'Nhập dữ liệu (JSON hoặc danh sách)',
    invalidInput: 'Dữ liệu đầu vào không hợp lệ!',
    animationSpeed: 'Tốc Độ Hoạt Hình',
    reset: 'Đặt Lại',
  },

  // ═══════════════════════════════════════════════════════════════
  // LEADERBOARDS
  // ═══════════════════════════════════════════════════════════════
  leaderboard: {
    title: 'Bảng Xếp Hạng',
    rank: 'Thứ Hạng',
    player: 'Người Chơi',
    score: 'Điểm',
    wins: 'Chiến Thắng',
    losses: 'Thua Cuộc',
    winRate: 'Tỷ Lệ Thắng',
    
    // Types
    codeSpeed: 'Tốc Độ Code',
    optimization: 'Tối Ưu Hóa',
    accuracy: 'Độ Chính Xác',
    speedrun: 'Chạy Tốc Độ',
    
    // Player info
    yourRank: 'Thứ Hạng Của Bạn',
    position: 'Vị Trí',
    medals: '🥇 Vàng | 🥈 Bạc | 🥉 Đồng',
  },

  // ═══════════════════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ═══════════════════════════════════════════════════════════════
  achievements: {
    title: 'Thành Tựu',
    locked: 'Chưa Mở Khóa',
    unlocked: 'Đã Mở Khóa',
    progress: 'Tiến Độ',
    reward: 'Phần Thưởng',
    badges: 'Huy Hiệu',
    
    // Categories
    progression: 'Tiến Bộ',
    combat: 'Chiến Đấu',
    collection: 'Sưu Tầm',
    challenge: 'Thử Thách',
    social: 'Xã Hội',
  },

  // ═══════════════════════════════════════════════════════════════
  // INVENTORY & ITEMS
  // ═══════════════════════════════════════════════════════════════
  inventory: {
    title: 'Kho Đồ',
    equipment: 'Trang Bị',
    items: 'Vật Phẩm',
    consumables: 'Dùng Một Lần',
    spells: 'Phép Thuật',
    empty: 'Kho Đồ Trống',
    
    // Resources
    gold: 'Vàng',
    experience: 'Kinh Nghiệm',
    dataWood: 'Gỗ Dữ Liệu',
    logicStone: 'Đá Logic',
  },

  // ═══════════════════════════════════════════════════════════════
  // PLAYER STATS
  // ═══════════════════════════════════════════════════════════════
  stats: {
    level: 'Cấp Độ',
    experience: 'Kinh Nghiệm',
    health: 'Máu',
    mana: 'Năng Lượng',
    attack: 'Tấn Công',
    defense: 'Phòng Thủ',
    speed: 'Tốc Độ',
    accuracy: 'Độ Chính Xác',
    questsCompleted: 'Nhiệm Vụ Hoàn Thành',
    questsTotal: 'Tổng Nhiệm Vụ',
  },

  // ═══════════════════════════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════════════════════════
  settings: {
    title: 'Cài Đặt',
    audio: 'Âm Thanh',
    video: 'Video',
    gameplay: 'Cách Chơi',
    language: 'Ngôn Ngữ',
    
    // Audio
    masterVolume: 'Âm Lượng Chính',
    musicVolume: 'Âm Lượng Nhạc',
    sfxVolume: 'Âm Lượng Hiệu Ứng',
    muted: 'Tắt Tiếng',
    
    // Video
    brightness: 'Độ Sáng',
    contrast: 'Độ Tương Phản',
    resolution: 'Độ Phân Giải',
    fullscreen: 'Toàn Màn Hình',
    vSync: 'V-Sync',
    
    // Gameplay
    difficulty: 'Độ Khó',
    showHints: 'Hiển Thị Gợi Ý',
    autoSave: 'Lưu Tự Động',
    
    // Language
    vietnamese: 'Tiếng Việt',
    english: 'Tiếng Anh',
  },

  // ═══════════════════════════════════════════════════════════════
  // COMMON
  // ═══════════════════════════════════════════════════════════════
  common: {
    yes: 'Có',
    no: 'Không',
    ok: 'OK',
    cancel: 'Hủy',
    confirm: 'Xác Nhận',
    back: 'Quay Lại',
    exit: 'Thoát',
    loading: 'Đang Tải...',
    error: 'Lỗi',
    success: 'Thành Công',
    warning: 'Cảnh Báo',
    info: 'Thông Tin',
    
    // Time
    seconds: 'Giây',
    minutes: 'Phút',
    hours: 'Giờ',
    days: 'Ngày',
    
    // Numbers
    thousand: 'K',
    million: 'M',
    billion: 'B',
  },

  // ═══════════════════════════════════════════════════════════════
  // ERRORS & MESSAGES
  // ═══════════════════════════════════════════════════════════════
  errors: {
    connectionError: 'Lỗi kết nối. Vui lòng kiểm tra internet.',
    serverError: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    gameError: 'Có lỗi xảy ra trong trò chơi.',
    notImplemented: 'Tính năng chưa được triển khai.',
    unauthorized: 'Bạn không được phép thực hiện hành động này.',
    notFound: 'Không tìm thấy.',
    badRequest: 'Yêu cầu không hợp lệ.',
  },

  // ═══════════════════════════════════════════════════════════════
  // NPC DIALOGUES
  // ═══════════════════════════════════════════════════════════════
  npc: {
    greeting: 'Chào bạn!',
    farewell: 'Tạm biệt!',
    
    professor: {
      intro: 'Chào mừng, Học Việc! Tôi là Giáo Sư Alric.',
      questWait: 'Bạn sẵn sàng cho nhiệm vụ tiếp theo chưa?',
      completed: 'Tuyệt vời! Bạn đã hoàn thành nhiệm vụ.',
    },
    
    guildLeader: {
      intro: 'Sẵn sàng thử sức với người khác chưa?',
      multiplayerBuilding: '⚔️ Đấu trường đang được xây dựng!',
      comingSoon: 'Sớm thôi bạn sẽ có thể thách đấu bạn bè!',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // STUDY MATERIALS
  // ═══════════════════════════════════════════════════════════════
  studyMaterials: {
    title: 'Tài Liệu Học Tập',
    theory: 'Lý Thuyết',
    demo: 'Demo',
    quiz: 'Bài Kiểm Tra',
    resources: 'Tài Nguyên',
    
    chapters: 'Chương',
    topics: 'Chủ Đề',
    lessons: 'Bài Học',
  },
} as const;
