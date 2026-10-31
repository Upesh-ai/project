import { test, describe } from 'node:test';
import assert from 'node:assert';
import { analyzeInformationSources } from '../src/utils/analysisEngine.js';
import { SAMPLE_PRESETS } from '../src/data/sampleDatasets.js';
import { runServerAnalysis } from '../server/services/analyzer.js';

describe('Digital Dark Spot - Hackathon 2026 Test Suite', () => {

  describe('1. Slide 5 Case Study: Scholarship Check Verification', () => {
    const scholarshipPreset = SAMPLE_PRESETS.find(p => p.id === 'scholarship-check');

    test('Should load Slide 5 preset with 3 attached sources', () => {
      assert.ok(scholarshipPreset, 'Scholarship preset must exist');
      assert.strictEqual(scholarshipPreset.sources.length, 3, 'Must contain 3 sources from the presentation');
    });

    test('Should detect Information Gap: Renewal & Multi-Year Policy (Slide 5)', () => {
      const result = analyzeInformationSources({
        topic: scholarshipPreset.topic,
        researchGoal: scholarshipPreset.researchGoal,
        sources: scholarshipPreset.sources
      });

      const renewalGap = result.informationGaps.find(g => 
        g.id === 'gap-renewal-requirements' || /renewal/i.test(g.title)
      );

      assert.ok(renewalGap, 'Engine must flag missing renewal policy as a Dark Spot');
      assert.strictEqual(renewalGap.severity, 'CRITICAL');
      assert.ok(renewalGap.question.toLowerCase().includes('renew'), 'Question must inquire about renewal');
    });

    test('Should detect Contradiction: Income Limits & Documents ($60k vs $65k) (Slide 5)', () => {
      const result = analyzeInformationSources({
        topic: scholarshipPreset.topic,
        researchGoal: scholarshipPreset.researchGoal,
        sources: scholarshipPreset.sources
      });

      const conflict = result.contradictions.find(c => 
        c.id === 'conflict-financial-doc' || /income/i.test(c.title)
      );

      assert.ok(conflict, 'Engine must detect income document clash between Source 1 and Source 2');
      assert.strictEqual(conflict.severity, 'CRITICAL');
      assert.ok(conflict.sourceA.claim.includes('$60,000') || conflict.sourceA.quote.includes('$60,000'));
      assert.ok(conflict.sourceB.claim.includes('$65,000') || conflict.sourceB.quote.includes('$65,000'));
    });

    test('Should detect Outdated Warning: Earlier 2023-2024 Application Cycle (Slide 5)', () => {
      const result = analyzeInformationSources({
        topic: scholarshipPreset.topic,
        researchGoal: scholarshipPreset.researchGoal,
        sources: scholarshipPreset.sources
      });

      const outdated = result.outdatedWarnings.find(w => 
        w.sourceId === 'src-3' || /2023/i.test(w.outdatedSignal)
      );

      assert.ok(outdated, 'Engine must flag Source 3 as expired archive');
      assert.strictEqual(outdated.severity, 'CRITICAL');
      assert.ok(outdated.risk.includes('retired application cycle') || outdated.risk.includes('retired'));
    });

    test('Should generate Prioritized Verify Next Checklist (Slide 5: Deadline, Document list, Renewal, Apply link)', () => {
      const result = analyzeInformationSources({
        topic: scholarshipPreset.topic,
        researchGoal: scholarshipPreset.researchGoal,
        sources: scholarshipPreset.sources
      });

      const checklist = result.verifyChecklist;
      assert.ok(checklist.length >= 4, 'Must include at least 4 key verification items');

      const hasDeadline = checklist.some(c => /deadline/i.test(c.title));
      const hasDocList = checklist.some(c => /document|income/i.test(c.title));
      const hasRenewal = checklist.some(c => /renewal/i.test(c.title));
      const hasApplyLink = checklist.some(c => /portal|apply|url/i.test(c.title));

      assert.ok(hasDeadline, 'Checklist must verify deadline');
      assert.ok(hasDocList, 'Checklist must verify document requirements');
      assert.ok(hasRenewal, 'Checklist must verify renewal policy');
      assert.ok(hasApplyLink, 'Checklist must verify active apply link');
    });
  });

  describe('2. Slide 7: Trust Dashboard Metric Calculation', () => {
    test('Should calculate Sourced vs AI-suggested vs Uncertain ratios', () => {
      const scholarshipPreset = SAMPLE_PRESETS[0];
      const result = analyzeInformationSources({
        topic: scholarshipPreset.topic,
        researchGoal: scholarshipPreset.researchGoal,
        sources: scholarshipPreset.sources
      });

      const dashboard = result.trustDashboard;
      assert.ok(dashboard, 'Trust dashboard object must exist');
      
      const { sourced, aiInferred, uncertain } = dashboard.breakdown;
      assert.ok(sourced.percentage > 0, 'Sourced percentage must be > 0');
      assert.ok(aiInferred.percentage > 0, 'AI percentage must be > 0');
      assert.ok(uncertain.percentage > 0, 'Uncertain percentage must be > 0');
      
      const totalRatio = sourced.percentage + aiInferred.percentage + uncertain.percentage;
      assert.strictEqual(totalRatio, 100, 'Sum of ratios must equal 100%');
    });
  });

  describe('3. Server-Side Analysis Pipeline', () => {
    test('Server analyzer should run without errors and return valid schema', async () => {
      const scholarshipPreset = SAMPLE_PRESETS[0];
      const result = await runServerAnalysis({
        topic: scholarshipPreset.topic,
        researchGoal: scholarshipPreset.researchGoal,
        sources: scholarshipPreset.sources
      });

      assert.ok(result.structuredFacts.length > 0, 'Must produce structured facts');
      assert.ok(result.informationGaps.length > 0, 'Must produce information gaps');
      assert.ok(result.contradictions.length > 0, 'Must produce contradictions');
      assert.ok(result.verifyChecklist.length > 0, 'Must produce verify checklist');
    });
  });

});
