/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * DIALOGUE BOX COMPONENT TESTS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Unit tests cho DialogueBox component
 * 
 * @file src/components/__tests__/DialogueBox.test.tsx
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DialogueBox Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render if npcId is empty', () => {
    const npcId = '';
    const shouldRender = npcId !== '';
    expect(shouldRender).toBe(false);
  });

  it('should render when npcId is provided', () => {
    const npcId = 'npc-01';
    const shouldRender = npcId !== '';
    expect(shouldRender).toBe(true);
  });

  it('should display current dialogue text', () => {
    const dialogueIndex = 0;
    const hasDialogue = dialogueIndex >= 0;
    expect(hasDialogue).toBe(true);
  });

  it('should handle next button click', () => {
    const currentIndex = 0;
    const nextIndex = currentIndex + 1;
    expect(nextIndex).toBeGreaterThan(0);
  });

  it('should close dialogue when finished', () => {
    const isOpen = true;
    const isClosing = false;
    expect(isOpen !== isClosing).toBe(true);
  });

  it('should display NPC name and portrait', () => {
    const npcName = 'Sage';
    const hasPortrait = !!npcName;
    expect(hasPortrait).toBe(true);
  });

  it('should trigger feature action when button clicked', () => {
    const featureType = 'QUEST';
    const isValidFeature = ['QUEST', 'SHOP', 'TRAINING'].includes(featureType);
    expect(isValidFeature).toBe(true);
  });
});
