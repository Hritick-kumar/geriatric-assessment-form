import { describe, expect, it } from 'vitest';
import { assessmentSchema } from './schema';

describe('assessmentSchema date of birth 60-year boundary', () => {
  const baseAssessment = {
    mrn: 'MRN-004821',
    patientName: 'Sushila Deshpande',
    dateOfBirth: '1949-03-12',
    assessmentDate: '2026-08-07',
    mobility: 'cane' as const,
    barthelIndex: 80,
    medicationCount: 3,
    pharmacistReviewRequested: false,
    followUpDate: '2026-09-04',
    consentObtained: true as const,
  };

  it('accepts a patient who turns exactly 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse({
      ...baseAssessment,
      dateOfBirth: '1966-08-07',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a patient who is one day short of 60 on the assessment date', () => {
    const result = assessmentSchema.safeParse({
      ...baseAssessment,
      dateOfBirth: '1966-08-08',
    });

    expect(result.success).toBe(false);
    const issues = !result.success ? result.error.issues : [];
    const dobError = issues.find((issue) => issue.path.includes('dateOfBirth'));
    expect(dobError?.message).toBe('This pathway is for patients aged 60 and over');
  });

  describe('Section 5 Fixture Rejections', () => {
    it('rejects invalid mrn: MRN-4821', () => {
      const result = assessmentSchema.safeParse({ ...baseAssessment, mrn: 'MRN-4821' });
      expect(result.success).toBe(false);
      const issues = !result.success ? result.error.issues : [];
      expect(issues.some((i) => i.path.includes('mrn'))).toBe(true);
    });

    it('rejects 1-character patientName: S', () => {
      const result = assessmentSchema.safeParse({ ...baseAssessment, patientName: 'S' });
      expect(result.success).toBe(false);
      const issues = !result.success ? result.error.issues : [];
      expect(issues.some((i) => i.path.includes('patientName'))).toBe(true);
    });

    it('rejects non-enum mobility: crutches', () => {
      const result = assessmentSchema.safeParse({ ...baseAssessment, mobility: 'crutches' });
      expect(result.success).toBe(false);
      const issues = !result.success ? result.error.issues : [];
      expect(issues.some((i) => i.path.includes('mobility'))).toBe(true);
    });

    it('rejects barthelIndex not a multiple of 5: 82', () => {
      const result = assessmentSchema.safeParse({ ...baseAssessment, barthelIndex: 82 });
      expect(result.success).toBe(false);
      const issues = !result.success ? result.error.issues : [];
      expect(issues.some((i) => i.path.includes('barthelIndex'))).toBe(true);
    });

    it('rejects barthelIndex exceeding 100: 105', () => {
      const result = assessmentSchema.safeParse({ ...baseAssessment, barthelIndex: 105 });
      expect(result.success).toBe(false);
      const issues = !result.success ? result.error.issues : [];
      expect(issues.some((i) => i.path.includes('barthelIndex'))).toBe(true);
    });

    it('rejects medicationCount >= 5 with pharmacistReviewRequested unchecked', () => {
      const result = assessmentSchema.safeParse({
        ...baseAssessment,
        medicationCount: 5,
        pharmacistReviewRequested: false,
      });
      expect(result.success).toBe(false);
      const issues = !result.success ? result.error.issues : [];
      expect(issues.some((i) => i.path.includes('pharmacistReviewRequested'))).toBe(true);
    });

    it('rejects followUpDate on same day as assessmentDate', () => {
      const result = assessmentSchema.safeParse({
        ...baseAssessment,
        assessmentDate: '2026-08-07',
        followUpDate: '2026-08-07',
      });
      expect(result.success).toBe(false);
      const issues = !result.success ? result.error.issues : [];
      expect(issues.some((i) => i.path.includes('followUpDate'))).toBe(true);
    });

    it('rejects consentObtained: false', () => {
      const result = assessmentSchema.safeParse({
        ...baseAssessment,
        consentObtained: false,
      });
      expect(result.success).toBe(false);
      const issues = !result.success ? result.error.issues : [];
      expect(issues.some((i) => i.path.includes('consentObtained'))).toBe(true);
    });
  });

  describe('Section 5 Fixture Acceptances', () => {
    it('accepts boundary barthelIndex: 0 and 100', () => {
      expect(assessmentSchema.safeParse({ ...baseAssessment, barthelIndex: 0 }).success).toBe(true);
      expect(assessmentSchema.safeParse({ ...baseAssessment, barthelIndex: 100 }).success).toBe(
        true
      );
    });

    it('accepts medicationCount: 4 with pharmacistReviewRequested false', () => {
      expect(
        assessmentSchema.safeParse({
          ...baseAssessment,
          medicationCount: 4,
          pharmacistReviewRequested: false,
        }).success
      ).toBe(true);
    });
  });
});
