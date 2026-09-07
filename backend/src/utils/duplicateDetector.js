import { Issue } from '../models/Issue.js';

// Common english stop words to filter out before token comparison
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'is', 'are', 'was', 'were', 'not', 'working',
  'and', 'or', 'for', 'to', 'of', 'with', 'by', 'near', 'inside', 'there', 'please',
  'fix', 'issue', 'problem', 'broken', 'repair'
]);

const tokenize = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
};

export const detectDuplicates = async ({ title, description, category, location }) => {
  // Only look for active (non-closed, non-rejected) issues
  const activeIssues = await Issue.find({
    status: { $nin: ['CLOSED', 'REJECTED'] },
  }).select('title description category location status upvotesCount priority createdAt images');

  const queryTokens = new Set([...tokenize(title), ...tokenize(description)]);
  const candidates = [];

  for (const issue of activeIssues) {
    let matchScore = 0;
    const reasons = [];

    // Category match
    if (category && issue.category.toLowerCase() === category.toLowerCase()) {
      matchScore += 25;
      reasons.push('Same Category');
    }

    // Location match
    if (location && location.block && issue.location?.block) {
      if (issue.location.block.toLowerCase().trim() === location.block.toLowerCase().trim()) {
        matchScore += 35;
        reasons.push(`Same Block (${location.block})`);

        // Check floor/area match
        if (
          location.floor &&
          issue.location.floor &&
          location.floor.toLowerCase().trim() === issue.location.floor.toLowerCase().trim()
        ) {
          matchScore += 15;
          reasons.push('Same Floor');
        }
      }
    }

    // Text token overlap
    const targetTokens = [...tokenize(issue.title), ...tokenize(issue.description)];
    let sharedTokensCount = 0;
    for (const token of targetTokens) {
      if (queryTokens.has(token)) {
        sharedTokensCount++;
      }
    }

    if (targetTokens.length > 0 && queryTokens.size > 0) {
      const overlapRatio = sharedTokensCount / Math.min(queryTokens.size, targetTokens.length);
      const textScore = Math.min(30, Math.round(overlapRatio * 40));
      if (textScore > 10) {
        matchScore += textScore;
        reasons.push('Similar Keywords');
      }
    }

    // If similarity is above 40%, flag as duplicate candidate
    if (matchScore >= 40) {
      candidates.push({
        issue,
        confidence: Math.min(98, matchScore),
        reasons,
      });
    }
  }

  // Sort descending by confidence
  candidates.sort((a, b) => b.confidence - a.confidence);

  return candidates.slice(0, 5); // Return top 5 matches
};
