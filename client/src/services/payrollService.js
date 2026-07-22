import api from './api';

/*
=====================================================
EMPLOYEE
=====================================================
*/

export const getMyPayroll = () =>
  api.get('/payroll/me');

/*
=====================================================
PAYROLL GENERATION
=====================================================
*/

export const previewPayroll = (data) =>
  api.post('/payroll/preview', data);

export const generatePayroll = (data) =>
  api.post('/payroll/generate', data);

export const bulkGeneratePayroll = (data) =>
  api.post('/payroll/bulk-generate', data);

/*
=====================================================
WORKFLOW
=====================================================
*/

export const reviewPayroll = (
  payrollId,
  data = {}
) =>
  api.patch(
    `/payroll/${payrollId}/review`,
    data
  );

export const approvePayroll = (
  payrollId,
  data = {}
) =>
  api.patch(
    `/payroll/${payrollId}/approve`,
    data
  );

export const rejectPayroll = (
  payrollId,
  data = {}
) =>
  api.patch(
    `/payroll/${payrollId}/reject`,
    data
  );

export const lockPayroll = (
  payrollId,
  data = {}
) =>
  api.patch(
    `/payroll/${payrollId}/lock`,
    data
  );

export const markPayrollPaid = (
  payrollId,
  data
) =>
  api.patch(
    `/payroll/${payrollId}/pay`,
    data
  );

export const bulkApprovePayroll = (
  ids
) =>
  api.patch(
    '/payroll/bulk-approve',
    {
      ids,
    }
  );

/*
=====================================================
PAYSLIPS
=====================================================
*/

export const downloadPayslip = (
  payrollId
) =>
  api.get(
    `/payroll/${payrollId}/payslip`,
    {
      responseType: 'blob',
    }
  );

export const emailPayslip = (
  payrollId
) =>
  api.post(
    `/payroll/${payrollId}/email`
  );

/*
=====================================================
REPORTS
=====================================================
*/

export const getPayrollStatistics =
  () =>
    api.get('/payroll/statistics');

export const getPayrollPeriods = () =>
    api.get("/payroll-periods");

export const getPayrollPeriod = (id) =>
    api.get(`/payroll-periods/${id}`);

export const createPayrollPeriod = (data) =>
    api.post("/payroll-periods", data);

export const updatePayrollPeriod = (id, data) =>
    api.put(`/payroll-periods/${id}`, data);

export const deletePayrollPeriod = (id) =>
    api.delete(`/payroll-periods/${id}`);

/*
=====================================================
CRUD
=====================================================
*/

export const getPayrolls = (
  params = {}
) =>
  api.get('/payroll', {
    params,
  });

export const getPayroll = (
  payrollId
) =>
  api.get(
    `/payroll/${payrollId}`
  );

export const updatePayroll = (
  payrollId,
  data
) =>
  api.put(
    `/payroll/${payrollId}`,
    data
  );

export const deletePayroll = (
  payrollId
) =>
  api.delete(
    `/payroll/${payrollId}`
  );