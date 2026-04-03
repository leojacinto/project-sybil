import { Acl } from '@servicenow/sdk/core'

// Security Data Filters — ACLs with operation=record
// These filter which records users can see based on conditions
export const sdfRequestByTraveler = Acl({
  $id: Now.ID['sdf-request-by-traveler'],
  type: 'record',
  table: 'x_snc_apr_trv_request',
  operation: 'conditional_table_query_range',
  roles: ['x_snc_apr_trv.user'],
  active: true,
  description: 'Users see only their own requests unless they have approver/admin role',
  script: `
(function process(current) {
  if (!gs.hasRole('x_snc_apr_trv.approver') && !gs.hasRole('x_snc_apr_trv.admin')) {
    current.addQuery('x_snc_apr_trv_traveler', gs.getUserID());
  }
  return true;
})(current);
`,
})

export const sdfExpenseByTraveler = Acl({
  $id: Now.ID['sdf-expense-by-traveler'],
  type: 'record',
  table: 'x_snc_apr_trv_expense',
  operation: 'conditional_table_query_range',
  roles: ['x_snc_apr_trv.user'],
  active: true,
  description: 'Users see only expenses for their own requests unless they have finance/admin role',
  script: `
(function process(current) {
  if (!gs.hasRole('x_snc_apr_trv.finance') && !gs.hasRole('x_snc_apr_trv.admin')) {
    current.addQuery('x_snc_apr_trv_travel_request.x_snc_apr_trv_traveler', gs.getUserID());
  }
  return true;
})(current);
`,
})
