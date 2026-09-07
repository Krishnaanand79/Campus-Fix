/**
 * Priority Scoring Engine for CampusFix
 * Factors:
 * 1. Community Upvotes: 3 points per affected user (+1)
 * 2. Severity Factor: LOW (5), MEDIUM (15), HIGH (30), CRITICAL (50)
 * 3. Category Weight: plumbing/electrical/security/washroom have higher inherent hazards
 * 4. Issue Age: 2 points per day unattended (prevent starvation of older issues)
 */

const SEVERITY_WEIGHTS = {
  LOW: 5,
  MEDIUM: 15,
  HIGH: 30,
  CRITICAL: 50,
};

const CATEGORY_WEIGHTS = {
  Plumbing: 20,
  Electrical: 25,
  Security: 25,
  Washroom: 20,
  'Internet/Wi-Fi': 15,
  'AC/Cooling': 15,
  Lighting: 15,
  Cleaning: 12,
  Infrastructure: 18,
  Furniture: 10,
  Parking: 8,
  'Garden/Landscaping': 6,
  Other: 10,
};

export const calculatePriorityScore = (issue) => {
  const upvotePoints = (issue.upvotesCount || 1) * 3;
  const severityPoints = SEVERITY_WEIGHTS[issue.severity] || 15;
  const categoryPoints = CATEGORY_WEIGHTS[issue.category] || 10;

  // Age calculation
  const createdDate = issue.createdAt ? new Date(issue.createdAt) : new Date();
  const now = new Date();
  const ageInDays = Math.max(0, Math.floor((now - createdDate) / (1000 * 60 * 60 * 24)));
  const agePoints = ageInDays * 2;

  const totalScore = upvotePoints + severityPoints + categoryPoints + agePoints;

  // Map to discrete Priority Level
  let priority = 'LOW';
  if (totalScore >= 75 || issue.severity === 'CRITICAL') {
    priority = 'CRITICAL';
  } else if (totalScore >= 45 || issue.severity === 'HIGH') {
    priority = 'HIGH';
  } else if (totalScore >= 25) {
    priority = 'MEDIUM';
  }

  return {
    score: totalScore,
    priority,
  };
};
