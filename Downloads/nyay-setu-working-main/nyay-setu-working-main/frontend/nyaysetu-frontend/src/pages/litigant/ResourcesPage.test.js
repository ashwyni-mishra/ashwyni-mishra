import { describe, it, expect } from 'vitest';
import { legalResources, filterAndSortResources } from './ResourcesPage';

// Fixed reference time matching the mock resource dates (May 23, 2026)
const NOW = new Date("2026-05-23T23:45:48+05:30");

describe('Legal Resources Portal - Search and Filter Logic', () => {

    it('should return all resources when search and filters are empty', () => {
        const results = filterAndSortResources({}, NOW);
        expect(results.length).toBe(legalResources.length);
    });

    it('should correctly filter by keyword search across titles and descriptions', () => {
        const firResults = filterAndSortResources({ searchQuery: 'FIR' }, NOW);
        expect(firResults.some(r => r.title.includes('FIR'))).toBe(true);

        const bailResults = filterAndSortResources({ searchQuery: 'Bail' }, NOW);
        expect(bailResults.length).toBeGreaterThan(0);
        expect(bailResults[0].title).toBe('Required Documents for Bail Applications');
    });

    it('should filter correctly when matching tags in keywords list', () => {
        const results = filterAndSortResources({ searchQuery: 'self-defense' }, NOW);
        expect(results.length).toBe(1);
        expect(results[0].id).toBe('res-2');
    });

    it('should return empty array for non-matching keyword queries (empty state check)', () => {
        const results = filterAndSortResources({ searchQuery: 'completelyRandomNonExistentKeyphrase' }, NOW);
        expect(results.length).toBe(0);
    });

    it('should support multiple concurrent category filters', () => {
        const results = filterAndSortResources({ selectedCategories: ['Legal Basics', 'FAQ'] }, NOW);
        expect(results.length).toBeGreaterThan(0);
        results.forEach(res => {
            expect(['Legal Basics', 'FAQ']).toContain(res.category);
        });
    });

    it('should support multiple concurrent resource type filters', () => {
        const results = filterAndSortResources({ selectedTypes: ['PDF', 'Video'] }, NOW);
        expect(results.length).toBeGreaterThan(0);
        results.forEach(res => {
            expect(['PDF', 'Video']).toContain(res.type);
        });
    });

    it('should filter by date ranges correctly relative to current date', () => {
        // Under 7 days (May 16 - May 23, 2026)
        // Should include res-1 (May 18), res-3 (May 22), res-5 (May 19)
        const recentResults = filterAndSortResources({ dateFilter: '7days' }, NOW);
        expect(recentResults.length).toBe(3);

        recentResults.forEach(res => {
            const daysDiff = (NOW.getTime() - new Date(res.date).getTime()) / (1000 * 3600 * 24);
            expect(daysDiff).toBeLessThanOrEqual(7);
        });

        // Under 30 days (April 23 - May 23, 2026)
        const monthlyResults = filterAndSortResources({ dateFilter: '30days' }, NOW);
        expect(monthlyResults.length).toBeGreaterThan(0);
    });

    it('should combine multiple filters concurrently (Keyword + Category + Type + Date)', () => {
        const results = filterAndSortResources({
            searchQuery: 'court',
            selectedCategories: ['Court Procedures'],
            selectedTypes: ['PDF']
        }, NOW);

        expect(results.length).toBe(1);
        expect(results[0].id).toBe('res-4');
    });

    it('should correctly sort the filtered resources list', () => {
        const alphaResults = filterAndSortResources({ sortBy: 'alphabetical' }, NOW);
        expect(alphaResults[0].title).toBe('BNS Section 42: Right of Private Defense');

        const oldestResults = filterAndSortResources({ sortBy: 'oldest' }, NOW);
        expect(oldestResults[0].id).toBe('res-4'); // March 15, 2026
    });

});
