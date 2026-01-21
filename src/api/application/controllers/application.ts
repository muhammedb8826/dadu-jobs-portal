/**
 * application controller
 */

import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::application.application', ({ strapi }) => ({
  /**
   * Return report rows for all applications of a specific job.
   * This is tailored for building the applicants/candidates report table in the frontend.
   */
  async report(ctx: Context) {
    const { jobId } = ctx.params;

    if (!jobId) {
      ctx.throw(400, 'jobId param is required');
    }

    const jobIdRaw = String(jobId);
    const numericId = Number(jobIdRaw);

    const baseParams = {
      publicationState: 'preview' as const,
      populate: {
        user: {
          populate: {
            candidate_profile: true,
          },
        },
        evaluation: true,
      },
    };

    const filters =
      !Number.isNaN(numericId) && numericId > 0
        ? {
            $or: [
              { job: { id: { $eq: numericId } } },
              { job: { documentId: jobIdRaw } as any },
            ],
          }
        : { job: { documentId: jobIdRaw } as any };

    const applications = await strapi.entityService.findMany(
      'api::application.application',
      {
        filters,
        ...baseParams,
      }
    );

    const toScore = (value: unknown) => {
      const score = Number(value ?? 0);
      return Number.isNaN(score) ? 0 : score;
    };

    const sortedApplications = [...applications].sort((a: any, b: any) => {
      const aScore = toScore(a.evaluation?.totalScore);
      const bScore = toScore(b.evaluation?.totalScore);
      return bScore - aScore;
    });

    const rows = sortedApplications.map((app: any, index: number) => {
      const user = app.user || {};
      const candidateProfile = user.candidate_profile || {};
      const evaluation = app.evaluation || {};

      const fullName = candidateProfile.fullName || '';
      const educationParts = [
        app.selectedDegree || '',
        app.selectedFieldOfStudy || '',
      ].filter(Boolean);

      const writtenExam = Number(evaluation.writtenExam ?? 0);
      const interview = Number(evaluation.interview ?? 0);
      const practical = Number(evaluation.practical ?? 0);
      const total = writtenExam + interview + practical;

      return {
        fullName,
        education: educationParts.join(' - '),
        cgpa: app.selectedCgpa,
        experience: app.totalExperienceYears,
        writtenExam: evaluation.writtenExam,
        interview: evaluation.interview,
        practical: evaluation.practical,
        total,
        status: app.applicationStatus,
        rank: evaluation.rank ?? index + 1,
        decision: app.decision,
      };
    });

    ctx.body = rows;
  },

  /**
   * Stream an Excel file containing the report for a specific job.
   */
  async reportExcel(ctx: Context) {
    const { jobId } = ctx.params;

    if (!jobId) {
      ctx.throw(400, 'jobId param is required');
    }

    const jobIdRaw = String(jobId);
    const numericId = Number(jobIdRaw);

    const baseParams = {
      publicationState: 'preview' as const,
      populate: {
        user: {
          populate: {
            candidate_profile: true,
          },
        },
        evaluation: true,
      },
    };

    const filters =
      !Number.isNaN(numericId) && numericId > 0
        ? {
            $or: [
              { job: { id: { $eq: numericId } } },
              { job: { documentId: jobIdRaw } as any },
            ],
          }
        : { job: { documentId: jobIdRaw } as any };

    const applications = await strapi.entityService.findMany(
      'api::application.application',
      {
        filters,
        ...baseParams,
      }
    );

    const toScore = (value: unknown) => {
      const score = Number(value ?? 0);
      return Number.isNaN(score) ? 0 : score;
    };

    const sortedApplications = [...applications].sort((a: any, b: any) => {
      const aScore = toScore(a.evaluation?.totalScore);
      const bScore = toScore(b.evaluation?.totalScore);
      return bScore - aScore;
    });

    const rows = sortedApplications.map((app: any, index: number) => {
      const user = app.user || {};
      const candidateProfile = user.candidate_profile || {};
      const evaluation = app.evaluation || {};

      const fullName = candidateProfile.fullName || '';
      const educationParts = [
        app.selectedDegree || '',
        app.selectedFieldOfStudy || '',
      ].filter(Boolean);

      const writtenExam = Number(evaluation.writtenExam ?? 0);
      const interview = Number(evaluation.interview ?? 0);
      const practical = Number(evaluation.practical ?? 0);
      const total = writtenExam + interview + practical;

      return {
        'Full Name': fullName,
        'Education': educationParts.join(' - '),
        'CGPA': app.selectedCgpa,
        'Experience (Years)': app.totalExperienceYears,
        'Written Exam': evaluation.writtenExam,
        'Interview': evaluation.interview,
        'Practical': evaluation.practical,
        'Total': total,
        'Status': app.applicationStatus,
        'Rank': evaluation.rank ?? index + 1,
        'Decision': app.decision,
      };
    });

    // Build a simple CSV buffer that Excel can open.
    // (If you prefer true .xlsx, we can switch to a library like 'exceljs'.)
    const headers = Object.keys(rows[0] || {});
    const csvLines = [
      headers.join(','), // header row
      ...rows.map((row) =>
        headers
          .map((key) => {
            const value = row[key] ?? '';
            const str = String(value).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(',')
      ),
    ];

    const csv = csvLines.join('\n');

    ctx.set('Content-Type', 'text/csv; charset=utf-8');
    ctx.set('Content-Disposition', `attachment; filename="job-${jobId}-applications-report.csv"`);
    ctx.body = csv;
  },
}));
