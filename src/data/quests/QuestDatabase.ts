import type { Quest } from '../models/NPC';

export const QUEST_DATABASE: Record<string, Quest> = {
    'quest_intro_1': {
        id: 'quest_intro_1',
        name: 'Khởi Đầu Hành Trình',
        description: 'Hoàn thành ải "Đền Thờ Hướng Dẫn" để chứng minh năng lực của bạn.',
        type: 'CAMPAIGN',
        active: true,
        chapter: 1,
        requirements: [
            {
                type: 'COMPLETE_DUNGEON',
                target: 'dungeon_1',
                count: 1
            }
        ],
        rewards: {
            dataWood: 50,
            oPoints: 100,
            blueprints: ['spell_bubble_sort']
        }
    },
    'quest_collect_wood': {
        id: 'quest_collect_wood',
        name: 'Thu Thập Dữ Liệu',
        description: 'Kiếm 50 Gỗ Dữ Liệu từ việc trả lời câu hỏi.',
        type: 'DAILY',
        active: true,
        requirements: [
            {
                type: 'COLLECT_ITEMS',
                target: 'DATA_WOOD',
                count: 50
            }
        ],
        rewards: {
            gold: 100,
            oPoints: 20
        }
    },
    'quest_chapter_2': {
        id: 'quest_chapter_2',
        name: 'Đền Thờ Hỗn Loạn',
        description: 'Lập lại trật tự bằng các thuật toán Sắp xếp tại ải 2.',
        type: 'CAMPAIGN',
        active: true,
        chapter: 2,
        requirements: [{ type: 'COMPLETE_DUNGEON', target: 'dungeon_2', count: 1 }],
        rewards: { dataWood: 80, oPoints: 200, blueprints: ['spell_bubble_sort_v2'] }
    },
    'quest_chapter_3': {
        id: 'quest_chapter_3',
        name: 'Hành Lang Dây Xích',
        description: 'Vượt qua mê cung liên kết và con trỏ tại ải 3.',
        type: 'CAMPAIGN',
        active: true,
        chapter: 3,
        requirements: [{ type: 'COMPLETE_DUNGEON', target: 'dungeon_3', count: 1 }],
        rewards: { dataWood: 100, oPoints: 300, blueprints: ['spell_linked_bridge'] }
    },
    'quest_chapter_4': {
        id: 'quest_chapter_4',
        name: 'Thánh Tích Hai Mặt',
        description: 'Chinh phục quy luật Vào Trước-Ra Trước tại ải 4.',
        type: 'CAMPAIGN',
        active: true,
        chapter: 4,
        requirements: [{ type: 'COMPLETE_DUNGEON', target: 'dungeon_4', count: 1 }],
        rewards: { dataWood: 150, oPoints: 500, blueprints: ['spell_parenthesis_shield'] }
    },
    'quest_chapter_5': {
        id: 'quest_chapter_5',
        name: 'Khu Rừng Đệ Quy',
        description: 'Khám phá bí mật của Cây Nhị Phân tại ải 5.',
        type: 'CAMPAIGN',
        active: true,
        chapter: 5,
        requirements: [{ type: 'COMPLETE_DUNGEON', target: 'dungeon_5', count: 1 }],
        rewards: { dataWood: 200, oPoints: 800, blueprints: ['spell_search_beam'] }
    }
};
