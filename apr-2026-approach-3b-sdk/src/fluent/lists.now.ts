import { List } from '@servicenow/sdk/core'

export const listMyRequests = List({
  $id: Now.ID['list-my-requests'],
  table: 'x_snc_apr_trv_request',
  view: 'my_requests',
  columns: [
    'number',
    'x_snc_apr_trv_destination_city',
    'x_snc_apr_trv_departure_date',
    'x_snc_apr_trv_return_date',
    'x_snc_apr_trv_estimated_cost',
    'x_snc_apr_trv_approval_status',
  ],
})

export const listApprovalQueue = List({
  $id: Now.ID['list-approval-queue'],
  table: 'x_snc_apr_trv_request',
  view: 'approval_queue',
  columns: [
    'number',
    'x_snc_apr_trv_traveler',
    'x_snc_apr_trv_destination_city',
    'x_snc_apr_trv_estimated_cost',
    'x_snc_apr_trv_purpose',
    'sys_created_on',
  ],
})

export const listExpenses = List({
  $id: Now.ID['list-expenses'],
  table: 'x_snc_apr_trv_expense',
  view: 'expense_list',
  columns: [
    'number',
    'x_snc_apr_trv_expense_type',
    'x_snc_apr_trv_amount',
    'x_snc_apr_trv_vendor',
    'x_snc_apr_trv_expense_date',
    'x_snc_apr_trv_reimbursement_status',
  ],
})

export const listPolicies = List({
  $id: Now.ID['list-policies'],
  table: 'x_snc_apr_trv_policy',
  view: 'policy_list',
  columns: [
    'x_snc_apr_trv_policy_name',
    'x_snc_apr_trv_applies_to_country',
    'x_snc_apr_trv_max_daily_hotel',
    'x_snc_apr_trv_finance_threshold',
    'x_snc_apr_trv_active',
  ],
})
