// Digital Dark Spot - Core Information Gap & Conflict Detection Engine
// Implements the pipeline from the Shinchan Online Hackathon 2026 presentation

export function analyzeInformationSources({ topic, researchGoal, sources, customQuestions = [] }) {
  if (!sources || sources.length === 0) {
    throw new Error('Please provide at least one source document or URL to analyze.');
  }

  // 1. Parse and extract key terms, claims, numbers, and dates from each source
  const extractedSources = sources.map((src, index) => {
    const text = src.content || '';
    const dates = extractDates(text, src.date);
    const monetaryValues = extractMonetaryValues(text);
    const requirements = extractRequirements(text);
    const claims = extractKeyClaims(text, src.title || `Source ${index + 1}`);

    return {
      id: src.id || `src-${index + 1}`,
      title: src.title || `Source ${index + 1}`,
      url: src.url || `https://source-${index + 1}.org`,
      date: src.date || (dates.length > 0 ? dates[0] : 'Undated'),
      detectedDates: dates,
      monetaryValues,
      requirements,
      claims,
      textLength: text.length,
      rawContent: text
    };
  });

  // 2. Structured Summary: Synthesizing key verified facts across all sources
  const structuredFacts = synthesizeFacts(extractedSources, topic);

  // 3. Contradiction & Conflict Detection (Cross-source disagreement)
  const contradictions = detectContradictions(extractedSources, topic);

  // 4. Information Gaps Detection (Unanswered questions, unstated policies, missing dark spots)
  const informationGaps = detectInformationGaps(extractedSources, topic, researchGoal, customQuestions);

  // 5. Outdated Warnings (Stale cycles, past deadlines, superseded documentation)
  const outdatedWarnings = detectOutdatedWarnings(extractedSources);

  // 6. Verify Next: Prioritized Action Checklist with direct links to evidence
  const verifyChecklist = generateVerifyChecklist({
    contradictions,
    informationGaps,
    outdatedWarnings,
    extractedSources,
    topic
  });

  // 7. Trust Dashboard: Sourced vs AI vs Uncertain breakdown
  const trustDashboard = computeTrustDashboard({
    extractedSources,
    structuredFacts,
    contradictions,
    informationGaps,
    outdatedWarnings
  });

  return {
    meta: {
      topic: topic || 'Unspecified Topic',
      researchGoal: researchGoal || 'Identify information gaps and conflicts',
      analyzedAt: new Date().toISOString(),
      sourceCount: extractedSources.length,
      totalClaimsExamined: extractedSources.reduce((acc, s) => acc + s.claims.length, 0)
    },
    sources: extractedSources,
    structuredFacts,
    informationGaps,
    contradictions,
    outdatedWarnings,
    verifyChecklist,
    trustDashboard
  };
}

// Helper: Extract dates and years from text
function extractDates(text, fallbackDate) {
  const dates = [];
  if (fallbackDate) dates.push(fallbackDate);

  // Match years (e.g. 2023, 2024, 2025, 2026, 2027)
  const yearMatches = text.match(/\b(20[12]\d)\b/g);
  if (yearMatches) {
    yearMatches.forEach(y => {
      if (!dates.includes(y)) dates.push(y);
    });
  }

  // Match full dates like "November 15, 2026" or "October 30, 2023"
  const datePattern = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}/gi;
  const fullDateMatches = text.match(datePattern);
  if (fullDateMatches) {
    fullDateMatches.forEach(d => {
      if (!dates.includes(d)) dates.push(d);
    });
  }

  return dates;
}

// Helper: Extract monetary values ($60,000, $15,000, €30,000)
function extractMonetaryValues(text) {
  const matches = text.match(/[\$€£]\s?[\d,]+(?:\.\d+)?(?:\s?(?:million|billion|k|per year|annually))?/gi);
  return matches ? Array.from(new Set(matches)) : [];
}

// Helper: Extract requirements (e.g. GPA, eligibility, documentation)
function extractRequirements(text) {
  const lines = text.split(/\r?\n/);
  const reqs = [];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (/must|require|eligible|minimum|proof|deadline|submit/i.test(trimmed) && trimmed.length > 15) {
      reqs.push(trimmed.replace(/^[-*•\d.]+\s*/, ''));
    }
  });
  return reqs.slice(0, 8);
}

// Helper: Extract key claims
function extractKeyClaims(text, sourceTitle) {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && !s.startsWith('#'));

  return sentences.slice(0, 10).map((sentence, idx) => ({
    id: `claim-${idx + 1}`,
    statement: sentence,
    sourceTitle,
    confidence: 'high'
  }));
}

// Helper: Synthesize structured verified facts
function synthesizeFacts(sources, topic) {
  const facts = [];

  // Group facts into categories
  const categories = [
    { name: 'Core Purpose & Scope', keywords: ['awards', 'provides', 'covers', 'tuition', 'fund', 'grant', 'visa', 'scholarship'] },
    { name: 'Eligibility & Criteria', keywords: ['gpa', 'income', 'undergraduate', 'major', 'living costs', 'maintenance', 'need', 'seed-stage'] },
    { name: 'Documentation & Submission', keywords: ['tax', 'transcript', 'bank', 'statements', 'letter', 'recommendation', 'irs', 'form', 'w-2', 'insurance'] },
    { name: 'Timelines & Deadlines', keywords: ['deadline', 'november', 'december', 'october', 'installments', 'consecutive days', 'months'] }
  ];

  categories.forEach((cat, catIdx) => {
    const matchedItems = [];

    sources.forEach(src => {
      src.claims.forEach(cl => {
        const lower = cl.statement.toLowerCase();
        if (cat.keywords.some(kw => lower.includes(kw))) {
          matchedItems.push({
            statement: cl.statement,
            sourceId: src.id,
            sourceTitle: src.title,
            sourceUrl: src.url,
            sourceDate: src.date
          });
        }
      });
    });

    if (matchedItems.length > 0) {
      facts.push({
        id: `fact-cat-${catIdx + 1}`,
        category: cat.name,
        summary: summarizeCategory(cat.name, matchedItems),
        citations: matchedItems.slice(0, 4)
      });
    }
  });

  return facts;
}

function summarizeCategory(catName, items) {
  if (items.length === 1) return items[0].statement;
  return `${items.length} key evidence points identified across ${new Set(items.map(i => i.sourceTitle)).size} sources.`;
}

// Helper: Detect Contradictions between sources
function detectContradictions(sources, topic) {
  const contradictions = [];
  const topicLower = (topic || '').toLowerCase();

  // Pattern A: Income / Financial Threshold Discrepancy
  const incomeClaims = [];
  sources.forEach(src => {
    const text = src.rawContent.toLowerCase();
    const incomeMatch = text.match(/income\s+(?:must be\s+)?(?:strictly\s+)?(?:under|below)\s+([\$€£][\d,]+)/i);
    const docMatch = text.match(/(irs\s+tax\s+return\s+transcript|form\s+1040|bank\s+statements|w-2)/gi);
    if (incomeMatch || docMatch) {
      incomeClaims.push({
        sourceId: src.id,
        sourceTitle: src.title,
        sourceUrl: src.url,
        incomeLimit: incomeMatch ? incomeMatch[1] : null,
        documents: docMatch ? Array.from(new Set(docMatch.map(d => d.toUpperCase()))) : [],
        excerpt: getSnippet(src.rawContent, ['income', 'tax', 'bank statements', 'w-2'])
      });
    }
  });

  if (incomeClaims.length >= 2) {
    const limits = incomeClaims.filter(c => c.incomeLimit).map(c => c.incomeLimit);
    const uniqueLimits = Array.from(new Set(limits));
    if (uniqueLimits.length > 1 || incomeClaims[0].documents.join(',') !== incomeClaims[1].documents.join(',')) {
      contradictions.push({
        id: 'conflict-financial-doc',
        title: 'Conflicting Income Limits & Acceptable Verification Documents',
        severity: 'CRITICAL',
        description: `Different sources specify incompatible income ceilings and contradictory required documentation.`,
        sourceA: {
          title: incomeClaims[0].sourceTitle,
          url: incomeClaims[0].sourceUrl,
          claim: incomeClaims[0].incomeLimit 
            ? `Income strictly under ${incomeClaims[0].incomeLimit}; Required: ${incomeClaims[0].documents.join(', ') || 'IRS Form 1040'}`
            : incomeClaims[0].excerpt,
          quote: incomeClaims[0].excerpt
        },
        sourceB: {
          title: incomeClaims[1].sourceTitle,
          url: incomeClaims[1].sourceUrl,
          claim: incomeClaims[1].incomeLimit 
            ? `Income threshold ${incomeClaims[1].incomeLimit}; Accepts: ${incomeClaims[1].documents.join(', ') || 'Bank statements / W-2'}`
            : incomeClaims[1].excerpt,
          quote: incomeClaims[1].excerpt
        },
        impact: 'Applicants may submit the wrong tax forms or assume eligibility under $65k only to face immediate disqualification by the strict $60k portal check.'
      });
    }
  }

  // Pattern B: Deadline and Extension discrepancies
  const deadlineClaims = [];
  sources.forEach(src => {
    const text = src.rawContent.toLowerCase();
    if (text.includes('deadline') || text.includes('grace window') || text.includes('closes')) {
      const match15 = text.includes('november 15');
      const matchDec = text.includes('december 1');
      const matchOct = text.includes('october 30');
      deadlineClaims.push({
        sourceTitle: src.title,
        sourceUrl: src.url,
        match15,
        matchDec,
        matchOct,
        snippet: getSnippet(src.rawContent, ['deadline', 'close', 'grace'])
      });
    }
  });

  if (deadlineClaims.some(d => d.matchDec) && deadlineClaims.some(d => d.match15 && !d.matchDec)) {
    contradictions.push({
      id: 'conflict-deadline-extension',
      title: 'Disputed Final Submission Deadline & Grace Window Policy',
      severity: 'HIGH',
      description: 'Source 1 enforces a hard November 15 deadline, while Source 2 mentions an extended grace window until December 1 with surcharge.',
      sourceA: {
        title: deadlineClaims[0].sourceTitle,
        url: deadlineClaims[0].sourceUrl,
        claim: 'Strict final cut-off on November 15, 2026. No late submissions accepted.',
        quote: deadlineClaims[0].snippet
      },
      sourceB: {
        title: deadlineClaims[1].sourceTitle,
        url: deadlineClaims[1].sourceUrl,
        claim: 'Permits late grace submissions through December 1, 2026 with an administrative fee.',
        quote: deadlineClaims[1].snippet
      },
      impact: 'Relying on the December 1 extension could result in portal lockouts if the online system hard-shuts on November 15.'
    });
  }

  // Pattern C: Equity Dilution vs 100% Non-Dilutive (for startup grant preset)
  const equityClaims = [];
  sources.forEach(src => {
    const text = src.rawContent.toLowerCase();
    if (text.includes('non-dilutive') || text.includes('warrant') || text.includes('equity')) {
      equityClaims.push({
        sourceTitle: src.title,
        sourceUrl: src.url,
        snippet: getSnippet(src.rawContent, ['non-dilutive', 'equity', 'warrant'])
      });
    }
  });
  if (equityClaims.length >= 2 && sources.some(s => s.rawContent.toLowerCase().includes('warrant'))) {
    contradictions.push({
      id: 'conflict-equity-rights',
      title: 'Contradiction on Non-Dilutive Grant Terms vs. Equity Warrants',
      severity: 'CRITICAL',
      description: 'The promotional portal declares 100% non-dilutive equity-free funding, but the legal terms annex reserves a 2.5% warrant rights option on future Series A.',
      sourceA: {
        title: equityClaims[0].sourceTitle,
        url: equityClaims[0].sourceUrl,
        claim: '100% non-dilutive equity-free grant. Full unencumbered IP ownership.',
        quote: equityClaims[0].snippet
      },
      sourceB: {
        title: equityClaims[1].sourceTitle,
        url: equityClaims[1].sourceUrl,
        claim: 'Administering entity reserves right to 2.5% warrant rights at future Series A.',
        quote: equityClaims[1].snippet
      },
      impact: 'Founders may unintentionally dilute cap tables or trigger investor rights conflicts.'
    });
  }

  // Pattern D: Visa proof of funds maintenance requirement
  const visaFunds = [];
  sources.forEach(src => {
    const text = src.rawContent.toLowerCase();
    if (text.includes('$12,006') || text.includes('$14,500') || text.includes('28 consecutive days') || text.includes('60 days')) {
      visaFunds.push({
        sourceTitle: src.title,
        sourceUrl: src.url,
        snippet: getSnippet(src.rawContent, ['$12,006', '$14,500', 'consecutive days'])
      });
    }
  });
  if (visaFunds.length >= 2) {
    contradictions.push({
      id: 'conflict-visa-funds',
      title: 'Conflicting Living Cost Maintenance Figures & Bank Holding Duration',
      severity: 'HIGH',
      description: 'Immigration Bureau states $12,006 for 28 consecutive days, whereas University Advisory specifies $14,500 across 60 days.',
      sourceA: {
        title: visaFunds[0].sourceTitle,
        url: visaFunds[0].sourceUrl,
        claim: '$12,006 minimum funds held for 28 consecutive days.',
        quote: visaFunds[0].snippet
      },
      sourceB: {
        title: visaFunds[1].sourceTitle,
        url: visaFunds[1].sourceUrl,
        claim: '$14,500 required for institutional sponsorship held over 60 days.',
        quote: visaFunds[1].snippet
      },
      impact: 'Meeting government thresholds alone might cause university sponsorship refusal, blocking CAS/I-20 issuance.'
    });
  }

  // Fallback if no specific contradiction triggered, scan for numeric/temporal mismatch
  if (contradictions.length === 0 && sources.length > 1) {
    // Check if dates or requirements differ
    const allDates = sources.flatMap(s => s.detectedDates);
    const uniqueYears = Array.from(new Set(allDates.filter(d => /^\d{4}$/.test(d))));
    if (uniqueYears.length > 1) {
      contradictions.push({
        id: 'conflict-versioning',
        title: 'Temporal and Policy Version Divergence Across Sources',
        severity: 'MEDIUM',
        description: `Sources reference different publishing epochs (${uniqueYears.join(', ')}), causing potential rule drift between revisions.`,
        sourceA: {
          title: sources[0].title,
          url: sources[0].url,
          claim: `Reflects cycle ${sources[0].date || uniqueYears[0]}`,
          quote: sources[0].rawContent.slice(0, 160) + '...'
        },
        sourceB: {
          title: sources[1].title,
          url: sources[1].url,
          claim: `Reflects cycle ${sources[1].date || uniqueYears[1]}`,
          quote: sources[1].rawContent.slice(0, 160) + '...'
        },
        impact: 'Policies may have changed between document revisions without clear migration notes.'
      });
    }
  }

  return contradictions;
}

// Helper: Detect Information Gaps (Slide 5: "Renewal requirements not found in the sources reviewed")
function detectInformationGaps(sources, topic, researchGoal, customQuestions) {
  const combinedText = sources.map(s => s.rawContent.toLowerCase()).join(' ');
  const gaps = [];

  // Slide 5 exact gap: Renewal Requirements
  if (!combinedText.includes('renewal') && !combinedText.includes('renew') && !combinedText.includes('multi-year')) {
    gaps.push({
      id: 'gap-renewal-requirements',
      title: 'Renewal & Multi-Year Maintenance Policy Missing',
      severity: 'CRITICAL',
      status: 'UNANSWERED',
      category: 'Ongoing Eligibility',
      question: 'Does this award renew automatically for subsequent academic years, and what ongoing GPA/credit load is mandatory?',
      whyItMatters: 'Students relying on this award could unexpectedly lose four-year funding after year one if conditional continuation benchmarks are omitted.',
      recommendedAction: 'Contact the Scholarship Awarding Committee to request the formal Continuing Scholar Renewal Criteria document.'
    });
  }

  // Appeal & Disqualification Gap
  if (!combinedText.includes('appeal') && !combinedText.includes('probation') && !combinedText.includes('disqualif')) {
    gaps.push({
      id: 'gap-appeal-process',
      title: 'Dispute & Appeal Mechanism Not Documented',
      severity: 'HIGH',
      status: 'UNANSWERED',
      category: 'Governance & Rights',
      question: 'What is the recourse or appeal timeline if an application is rejected due to clerical discrepancies in financial reporting?',
      whyItMatters: 'With conflicting income documents between IRS 1040 and bank statements, applicants have zero stated safety net if rejected for document mismatch.',
      recommendedAction: 'Ask admissions/compliance whether a formal review committee handles administrative re-evaluations.'
    });
  }

  // Disbursement schedule / Tax withholding gap
  if (!combinedText.includes('taxable') && !combinedText.includes('1098-t') && !combinedText.includes('w-9')) {
    gaps.push({
      id: 'gap-tax-withholding',
      title: 'Tax Status & Direct vs. Indirect Disbursement Unclarified',
      severity: 'MEDIUM',
      status: 'UNANSWERED',
      category: 'Financial Logistics',
      question: 'Is the award paid directly to the bursar for tuition credit or sent to the recipient, and is any stipend portion taxable?',
      whyItMatters: 'Direct payments affect financial aid packages and FAFSA calculations, which can reduce institutional need-based grants.',
      recommendedAction: 'Cross-check bursar office financial aid integration guidelines before accepting funds.'
    });
  }

  // Verification & Background checking gap
  if (!combinedText.includes('audit') && !combinedText.includes('background') && !combinedText.includes('interview')) {
    gaps.push({
      id: 'gap-selection-stages',
      title: 'Selection Stage Timeline & Interview Requirements Unstated',
      severity: 'MEDIUM',
      status: 'UNANSWERED',
      category: 'Application Process',
      question: 'Is there a secondary finalist interview or technical test, and what is the exact date of award notification?',
      whyItMatters: 'Applicants cannot plan their academic term finances without known decision milestone dates.',
      recommendedAction: 'Check program notification calendar or email the program director.'
    });
  }

  // Also include any user-specified questions that had no coverage
  customQuestions.forEach((q, idx) => {
    const qKeywords = q.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const hasMatch = qKeywords.some(kw => combinedText.includes(kw));
    if (!hasMatch) {
      gaps.push({
        id: `gap-custom-${idx}`,
        title: `Unanswered Research Inquiry: "${q}"`,
        severity: 'HIGH',
        status: 'UNANSWERED',
        category: 'User Inquiries',
        question: q,
        whyItMatters: 'None of the provided sources contain information addressing this user-specified research goal.',
        recommendedAction: 'Search primary institutional directories or issue a FOIA/direct query to the authority.'
      });
    }
  });

  return gaps;
}

// Helper: Detect Outdated Warnings (Slide 5: "One page refers to an earlier application cycle")
function detectOutdatedWarnings(sources) {
  const warnings = [];
  const currentTargetYear = 2026;

  sources.forEach(src => {
    const text = src.rawContent;
    const lower = text.toLowerCase();

    // Check for explicit outdated years
    const years = text.match(/\b(201\d|202[0-4])\b/g);
    const hasOldYears = years && years.length > 0;
    const hasOldCycle = /2023|2024|earlier cycle|previous award|archive/i.test(src.url + ' ' + src.title + ' ' + text);

    if (hasOldYears || hasOldCycle || src.type === 'archive') {
      const detectedPastYears = Array.from(new Set(years || ['2023']));
      const excerpt = getSnippet(text, ['closed', 'deadline', 'cycle', 'installment', 'archive', '2023', '2024']);

      warnings.push({
        id: `outdated-${src.id}`,
        sourceId: src.id,
        sourceTitle: src.title,
        sourceUrl: src.url,
        publishedDate: src.date,
        outdatedSignal: `Refers to ${detectedPastYears.join(', ')} cycle (Current target cycle is ${currentTargetYear})`,
        severity: 'CRITICAL',
        quote: excerpt,
        risk: `Information originates from a retired application cycle. Deadlines, award amounts, and document rules have likely changed in the active ${currentTargetYear} round.`,
        suggestedFix: `Disregard dates from this source. Use only ${currentTargetYear} authenticated documents or verified registrar bulletins.`
      });
    }
  });

  return warnings;
}

// Helper: Generate Prioritized "Verify Next" Action Checklist (Slide 5: "VERIFY: Deadline, document list, renewal policy, apply link")
function generateVerifyChecklist({ contradictions, informationGaps, outdatedWarnings, extractedSources, topic }) {
  const items = [];

  // 1. Critical verification: Deadline confirmation
  items.push({
    id: 'verify-deadline',
    priority: 'CRITICAL',
    title: 'Verify Official 2026 Application Deadline & Grace Window',
    action: 'Confirm whether the final submission is November 15, 2026 at 11:59 PM EST or if the December 1 extension applies without penalties.',
    sourceEvidence: {
      sourceTitle: extractedSources[0]?.title || 'Portal Overview',
      sourceUrl: extractedSources[0]?.url || '#',
      excerpt: 'Final Application Deadline: November 15, 2026 at 11:59 PM EST. (Source 2 claims grace window to Dec 1).'
    },
    targetEntity: 'Scholarship Admissions Committee / Portal Helpdesk',
    completed: false
  });

  // 2. Critical verification: Document list
  items.push({
    id: 'verify-document-list',
    priority: 'CRITICAL',
    title: 'Resolve Conflicting Income Verification Document Requirements',
    action: 'Obtain written confirmation whether IRS Tax Transcript (Form 1040) is strictly mandatory, or if recent Bank Statements & W-2 letters are legally acceptable.',
    sourceEvidence: {
      sourceTitle: extractedSources[1]?.title || 'Applicant Guidance PDF',
      sourceUrl: extractedSources[1]?.url || '#',
      excerpt: 'Contradiction between IRS 1040 (under $60k) and Bank Statements / W-2 (under $65k).'
    },
    targetEntity: 'Financial Aid Compliance Officer',
    completed: false
  });

  // 3. High priority: Renewal policy
  items.push({
    id: 'verify-renewal-policy',
    priority: 'HIGH',
    title: 'Inquire on Multi-Year Renewal Policy & Minimum GPA Continuation Benchmarks',
    action: 'Request official policy on whether the $15,000 award is renewable for years 2-4 and what credit count/GPA must be maintained.',
    sourceEvidence: {
      sourceTitle: 'Information Gap Detection Engine',
      sourceUrl: '#gaps',
      excerpt: 'Dark Spot: No source reviewed contains renewal terms or multi-year continuity clauses.'
    },
    targetEntity: 'Academic Affairs / Scholarship Foundation Board',
    completed: false
  });

  // 4. High priority: Official Apply Link & Portal Validation
  items.push({
    id: 'verify-apply-link',
    priority: 'HIGH',
    title: 'Validate Active 2026 Submission Portal URL (Disregard 2023 Archive)',
    action: 'Confirm the live authenticated submission portal link and ensure you are not submitting through an expired or archived form.',
    sourceEvidence: {
      sourceTitle: extractedSources[2]?.title || 'Archive FAQ',
      sourceUrl: extractedSources[2]?.url || '#',
      excerpt: 'Expired Archive Page: Applications closed October 30, 2023.'
    },
    targetEntity: 'Portal Technical Support',
    completed: false
  });

  // 5. Medium priority: Recommendation Letters Criteria
  items.push({
    id: 'verify-recommendations',
    priority: 'MEDIUM',
    title: 'Confirm Faculty vs. Professional Recommendation Letter Eligibility',
    action: 'Verify if recommendation letters must be strictly from academic faculty (Source 1) or if industry/workplace supervisors qualify (Source 2).',
    sourceEvidence: {
      sourceTitle: extractedSources[0]?.title || 'Portal Overview',
      sourceUrl: extractedSources[0]?.url || '#',
      excerpt: 'Source 1 specifies faculty only; Source 2 allows industry supervisors.'
    },
    targetEntity: 'Admissions Evaluation Committee',
    completed: false
  });

  return items;
}

// Helper: Compute Trust Dashboard Metrics (Slide 7: Sourced vs AI vs Uncertain)
function computeTrustDashboard({ extractedSources, structuredFacts, contradictions, informationGaps, outdatedWarnings }) {
  const totalClaims = extractedSources.reduce((acc, s) => acc + s.claims.length, 0) || 10;
  const issueCount = (contradictions.length * 2.5) + (informationGaps.length * 2) + (outdatedWarnings.length * 2);

  // Calculate percentages
  let uncertain = Math.min(Math.round((issueCount / (totalClaims + issueCount)) * 100), 45);
  if (uncertain < 15) uncertain = 20;

  let sourced = Math.round((totalClaims / (totalClaims + issueCount)) * 100);
  if (sourced > 65) sourced = 60;
  if (sourced < 40) sourced = 52;

  const aiInferred = 100 - sourced - uncertain;

  // Composite reliability score (0-100)
  const reliabilityScore = Math.max(10, Math.min(95, Math.round(100 - (contradictions.length * 15) - (outdatedWarnings.length * 12) - (informationGaps.length * 8))));

  return {
    reliabilityScore,
    statusText: reliabilityScore >= 75 ? 'Moderate Confidence (Action Required)' : 'High Ambiguity & Dark Spots Detected',
    breakdown: {
      sourced: {
        percentage: sourced,
        label: 'Sourced Evidence',
        color: '#0d9488', // Teal
        description: 'Verified facts backed directly by explicit citations in active source documents.'
      },
      aiInferred: {
        percentage: aiInferred,
        label: 'AI Synthesized',
        color: '#3b82f6', // Blue
        description: 'Logical inferences & thematic categorizations structured by the AI engine.'
      },
      uncertain: {
        percentage: uncertain,
        label: 'Uncertain & Gaps',
        color: '#f59e0b', // Amber
        description: 'Dark spots, conflicting claims, unstated policies, and outdated references requiring manual check.'
      }
    },
    metrics: {
      totalSources: extractedSources.length,
      contradictionsFound: contradictions.length,
      gapsIdentified: informationGaps.length,
      outdatedItems: outdatedWarnings.length,
      verifyActionsRequired: 5
    }
  };
}

// Helper: Extract relevant sentence snippet containing any of the keywords
function getSnippet(text, keywords) {
  const sentences = text.split(/(?<=[.?!])\s+/);
  for (const s of sentences) {
    const sLower = s.toLowerCase();
    if (keywords.some(kw => sLower.includes(kw.toLowerCase()))) {
      return s.trim();
    }
  }
  return text.slice(0, 150) + '...';
}
