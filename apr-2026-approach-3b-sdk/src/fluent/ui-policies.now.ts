import { UiPolicy } from '@servicenow/sdk/core'

export const upReadOnlyAfterApproval = UiPolicy({
  $id: Now.ID['up-readonly-after-approval'],
  table: 'x_snc_apr_trv_request',
  shortDescription: 'Read Only After Approval',
  active: true,
  onLoad: true,
  reverseIfFalse: true,
  conditions: 'x_snc_apr_trv_approval_status=approved^ORx_snc_apr_trv_approval_status=finance_review',
  actions: [
    { field: 'x_snc_apr_trv_destination_city', readOnly: true },
    { field: 'x_snc_apr_trv_destination_country', readOnly: true },
    { field: 'x_snc_apr_trv_departure_date', readOnly: true },
    { field: 'x_snc_apr_trv_return_date', readOnly: true },
    { field: 'x_snc_apr_trv_estimated_cost', readOnly: true },
    { field: 'x_snc_apr_trv_purpose', readOnly: true },
  ],
})

export const upHideActualCost = UiPolicy({
  $id: Now.ID['up-hide-actual-cost'],
  table: 'x_snc_apr_trv_request',
  shortDescription: 'Hide Actual Cost Before Trip',
  active: true,
  onLoad: true,
  reverseIfFalse: true,
  conditions: 'x_snc_apr_trv_departure_date>javascript:gs.nowDateTime()',
  actions: [
    { field: 'x_snc_apr_trv_actual_cost', visible: false },
  ],
})

export const upMandatoryPurpose = UiPolicy({
  $id: Now.ID['up-mandatory-purpose'],
  table: 'x_snc_apr_trv_request',
  shortDescription: 'Mandatory Purpose for International',
  active: true,
  onLoad: true,
  reverseIfFalse: true,
  conditions: 'x_snc_apr_trv_travel_type=international',
  actions: [
    { field: 'x_snc_apr_trv_purpose', mandatory: true },
  ],
})
