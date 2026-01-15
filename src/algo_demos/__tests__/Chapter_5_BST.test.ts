/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * UNIT TESTS - CHAPTER 5: BINARY SEARCH TREE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Tests for BST operations and traversals.
 * 
 * Run: npm test -- --grep "Chapter 5"
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { describe, it, expect, beforeEach } from 'vitest';

// ═══════════════════════════════════════════════════════════════════════════
// BST IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

interface TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

class BST {
    root: TreeNode | null = null;

    insert(val: number): void {
        this.root = this._insert(this.root, val);
    }

    private _insert(node: TreeNode | null, val: number): TreeNode {
        if (node === null) {
            return { val, left: null, right: null };
        }
        if (val < node.val) {
            node.left = this._insert(node.left, val);
        } else if (val > node.val) {
            node.right = this._insert(node.right, val);
        }
        return node;
    }

    search(val: number): boolean {
        return this._search(this.root, val);
    }

    private _search(node: TreeNode | null, val: number): boolean {
        if (node === null) return false;
        if (val === node.val) return true;
        if (val < node.val) return this._search(node.left, val);
        return this._search(node.right, val);
    }

    inorder(): number[] {
        const result: number[] = [];
        this._inorder(this.root, result);
        return result;
    }

    private _inorder(node: TreeNode | null, result: number[]): void {
        if (node === null) return;
        this._inorder(node.left, result);
        result.push(node.val);
        this._inorder(node.right, result);
    }

    preorder(): number[] {
        const result: number[] = [];
        this._preorder(this.root, result);
        return result;
    }

    private _preorder(node: TreeNode | null, result: number[]): void {
        if (node === null) return;
        result.push(node.val);
        this._preorder(node.left, result);
        this._preorder(node.right, result);
    }

    postorder(): number[] {
        const result: number[] = [];
        this._postorder(this.root, result);
        return result;
    }

    private _postorder(node: TreeNode | null, result: number[]): void {
        if (node === null) return;
        this._postorder(node.left, result);
        this._postorder(node.right, result);
        result.push(node.val);
    }

    height(): number {
        return this._height(this.root);
    }

    private _height(node: TreeNode | null): number {
        if (node === null) return -1;
        return 1 + Math.max(this._height(node.left), this._height(node.right));
    }

    min(): number | null {
        if (!this.root) return null;
        let current = this.root;
        while (current.left) current = current.left;
        return current.val;
    }

    max(): number | null {
        if (!this.root) return null;
        let current = this.root;
        while (current.right) current = current.right;
        return current.val;
    }
}

// Validate BST
function isValidBST(root: TreeNode | null): boolean {
    function validate(node: TreeNode | null, min: number, max: number): boolean {
        if (node === null) return true;
        if (node.val <= min || node.val >= max) return false;
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
    return validate(root, -Infinity, Infinity);
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Chapter 5: Binary Search Tree', () => {
    let bst: BST;

    beforeEach(() => {
        bst = new BST();
    });

    describe('insert and search', () => {
        it('inserts and finds elements', () => {
            bst.insert(5);
            bst.insert(3);
            bst.insert(7);
            expect(bst.search(5)).toBe(true);
            expect(bst.search(3)).toBe(true);
            expect(bst.search(7)).toBe(true);
        });

        it('returns false for non-existent elements', () => {
            bst.insert(5);
            expect(bst.search(10)).toBe(false);
        });

        it('returns false for empty tree', () => {
            expect(bst.search(5)).toBe(false);
        });
    });

    describe('traversals', () => {
        beforeEach(() => {
            //       5
            //      / \
            //     3   7
            //    / \   \
            //   1   4   9
            bst.insert(5);
            bst.insert(3);
            bst.insert(7);
            bst.insert(1);
            bst.insert(4);
            bst.insert(9);
        });

        it('inorder returns sorted array', () => {
            expect(bst.inorder()).toEqual([1, 3, 4, 5, 7, 9]);
        });

        it('preorder returns root first', () => {
            expect(bst.preorder()).toEqual([5, 3, 1, 4, 7, 9]);
        });

        it('postorder returns root last', () => {
            expect(bst.postorder()).toEqual([1, 4, 3, 9, 7, 5]);
        });
    });

    describe('height', () => {
        it('returns -1 for empty tree', () => {
            expect(bst.height()).toBe(-1);
        });

        it('returns 0 for single node', () => {
            bst.insert(5);
            expect(bst.height()).toBe(0);
        });

        it('returns correct height', () => {
            bst.insert(5);
            bst.insert(3);
            bst.insert(7);
            bst.insert(1);
            expect(bst.height()).toBe(2);
        });
    });

    describe('min and max', () => {
        beforeEach(() => {
            bst.insert(5);
            bst.insert(3);
            bst.insert(7);
            bst.insert(1);
            bst.insert(9);
        });

        it('returns min value', () => {
            expect(bst.min()).toBe(1);
        });

        it('returns max value', () => {
            expect(bst.max()).toBe(9);
        });

        it('returns null for empty tree', () => {
            const emptyBst = new BST();
            expect(emptyBst.min()).toBeNull();
            expect(emptyBst.max()).toBeNull();
        });
    });
});

describe('Chapter 5: Validate BST', () => {
    it('returns true for valid BST', () => {
        const root: TreeNode = {
            val: 5,
            left: { val: 3, left: null, right: null },
            right: { val: 7, left: null, right: null }
        };
        expect(isValidBST(root)).toBe(true);
    });

    it('returns false for invalid BST', () => {
        const root: TreeNode = {
            val: 5,
            left: { val: 3, left: null, right: null },
            right: { val: 4, left: null, right: null } // 4 < 5, invalid
        };
        expect(isValidBST(root)).toBe(false);
    });

    it('returns true for null tree', () => {
        expect(isValidBST(null)).toBe(true);
    });

    it('returns true for single node', () => {
        expect(isValidBST({ val: 5, left: null, right: null })).toBe(true);
    });
});
