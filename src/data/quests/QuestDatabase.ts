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
    }
};
