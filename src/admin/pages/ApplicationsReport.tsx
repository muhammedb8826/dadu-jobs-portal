import React, { useCallback, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Field,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
  TextInput,
} from '@strapi/design-system';
import { Download, Search } from '@strapi/icons';
import { Layouts, Page, useFetchClient, useNotification } from '@strapi/strapi/admin';

type ReportRow = {
  fullName: string;
  education: string;
  cgpa: number | null;
  experience: number | null;
  writtenExam: number | null;
  interview: number | null;
  practical: number | null;
  status: string | null;
  rank: number | null;
  decision: string | null;
};

const columns = [
  'Full Name',
  'Education',
  'CGPA',
  'Experience',
  'Written Exam',
  'Interview',
  'Practical',
  'Status',
  'Rank',
  'Decision',
];

export default function ApplicationsReportPage() {
  const { get } = useFetchClient();
  const { toggleNotification } = useNotification();

  const [jobId, setJobId] = useState<string>('');
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const canExport = useMemo(() => Boolean(jobId && rows.length), [jobId, rows.length]);

  const fetchReport = useCallback(async () => {
    if (!jobId) {
      toggleNotification({
        type: 'warning',
        message: 'Please enter a Job ID first.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await get(`/api/applications/report/${jobId}`);
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      toggleNotification({
        type: 'warning',
        message: 'Failed to load the report. Check permissions and Job ID.',
      });
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [get, jobId, toggleNotification]);

  const handleExport = useCallback(() => {
    if (!jobId) {
      toggleNotification({
        type: 'warning',
        message: 'Please enter a Job ID first.',
      });
      return;
    }

    window.location.href = `/api/applications/report-excel/${jobId}`;
  }, [jobId, toggleNotification]);

  return (
    <Page.Main>
      <Page.Title>Applications Report</Page.Title>
      <Layouts.Header title="Applications Report" subtitle="Export applicants report by Job ID" />
      <Layouts.Content>
        <Box paddingBottom={6}>
          <Flex gap={4} alignItems="flex-end">
            <Box style={{ width: 240 }}>
              <Field.Root name="jobId">
                <Field.Label>Job ID</Field.Label>
                <TextInput
                  name="jobId"
                  placeholder="e.g. 7"
                  value={jobId}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setJobId(event.target.value)
                  }
                />
              </Field.Root>
            </Box>
            <Button
              startIcon={<Search />}
              onClick={fetchReport}
              loading={isLoading}
              disabled={!jobId}
            >
              Load Report
            </Button>
            <Button
              variant="secondary"
              startIcon={<Download />}
              onClick={handleExport}
              disabled={!canExport}
            >
              Export CSV
            </Button>
          </Flex>
        </Box>

        <Table colCount={columns.length} rowCount={rows.length + 1}>
          <Thead>
            <Tr>
              {columns.map((label) => (
                <Th key={label}>
                  <Typography variant="sigma" textColor="neutral600">
                    {label}
                  </Typography>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, index) => (
              <Tr key={`${row.fullName}-${index}`}>
                <Td>
                  <Typography textColor="neutral800">{row.fullName}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{row.education}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{row.cgpa ?? '-'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{row.experience ?? '-'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{row.writtenExam ?? '-'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{row.interview ?? '-'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{row.practical ?? '-'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{row.status ?? '-'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{row.rank ?? '-'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{row.decision ?? '-'}</Typography>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Layouts.Content>
    </Page.Main>
  );
}

