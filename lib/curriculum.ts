import curriculumData from './lessons.json';

export interface Curriculum {
  level: string;
  topics: string[];
  status: string;
}

/**
 * Gets the curriculum topics for the student's *exact* grade level.
 * @param grade The student's grade (e.g., "Basic 4", "JHS 2", "SHS 1")
 * @returns An array of Curriculum topics.
 */
export const getTopicsForGrade = (grade: string): Curriculum[] => {
  const gradeLower = grade.toLowerCase();
  let key = '';

  if (gradeLower.includes('basic')) {
    const num = gradeLower.match(/\d+/)?.[0];
    key = `basic-${num}`;
  } else if (gradeLower.includes('jhs')) {
    const num = gradeLower.match(/\d+/)?.[0];
    key = `jhs-${num}`;
  } else if (gradeLower.includes('shs')) {
    const num = gradeLower.match(/\d+/)?.[0];
    key = `shs-${num}`;
  } else {
    key = 'basic-1'; // Fallback default
  }

  // Return only the matching grade’s lessons if available
  return curriculumData[key] || [];
};
