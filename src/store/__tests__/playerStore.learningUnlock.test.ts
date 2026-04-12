import { beforeEach, describe, expect, it } from 'vitest';
import { usePlayerStore } from '../playerStore';

describe('playerStore learning unlock integration', () => {
  beforeEach(() => {
    usePlayerStore.getState().reset();
  });

  it('updates concept mastery and unlocks runes by prerequisite order', () => {
    const store = usePlayerStore.getState();

    store.updateConceptCorrectness('linear-search', 1);
    const first = store.evaluateKnowledgeUnlocks(
      ['linear-search', 'binary-search'],
      {
        'linear-search': [],
        'binary-search': ['linear-search'],
      },
      0.5,
      {
        'linear-search': 'rune_learning_linear_search',
        'binary-search': 'rune_learning_binary_search',
      },
    );

    expect(first.unlockedList).toContain('linear-search');
    expect(first.unlockedList).toContain('binary-search');
    expect(usePlayerStore.getState().unlockedRunes).toContain('rune_learning_linear_search');
    expect(usePlayerStore.getState().unlockedRunes).toContain('rune_learning_binary_search');
  });

  it('does not duplicate rune when unlock evaluation runs multiple times', () => {
    const store = usePlayerStore.getState();

    store.updateConceptCorrectness('merge-sort', 1);
    store.evaluateKnowledgeUnlocks(['merge-sort'], { 'merge-sort': [] }, 0.5, {
      'merge-sort': 'rune_learning_merge_sort',
    });
    store.evaluateKnowledgeUnlocks(['merge-sort'], { 'merge-sort': [] }, 0.5, {
      'merge-sort': 'rune_learning_merge_sort',
    });

    const allRunes = usePlayerStore.getState().unlockedRunes;
    expect(allRunes.filter((id) => id === 'rune_learning_merge_sort')).toHaveLength(1);
  });
});
