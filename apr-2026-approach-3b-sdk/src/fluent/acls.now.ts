import { Acl } from '@servicenow/sdk/core'

// x_snc_apr_trv_request ACLs
export const aclRequestRead = Acl({
  $id: Now.ID['acl-request-read'],
  type: 'record',
  table: 'x_snc_apr_trv_request',
  operation: 'read',
  roles: ['x_snc_apr_trv.user'],
  active: true,
  adminOverrides: true,
})

export const aclRequestWrite = Acl({
  $id: Now.ID['acl-request-write'],
  type: 'record',
  table: 'x_snc_apr_trv_request',
  operation: 'write',
  roles: ['x_snc_apr_trv.user'],
  active: true,
  adminOverrides: true,
  condition: 'x_snc_apr_trv_approval_status=pending^ORx_snc_apr_trv_approval_status=rejected',
})

export const aclRequestCreate = Acl({
  $id: Now.ID['acl-request-create'],
  type: 'record',
  table: 'x_snc_apr_trv_request',
  operation: 'create',
  roles: ['x_snc_apr_trv.user'],
  active: true,
  adminOverrides: true,
})

export const aclRequestDelete = Acl({
  $id: Now.ID['acl-request-delete'],
  type: 'record',
  table: 'x_snc_apr_trv_request',
  operation: 'delete',
  roles: ['x_snc_apr_trv.admin'],
  active: true,
  adminOverrides: true,
})

// Field-level ACL for approval_status
export const aclRequestApprovalStatusWrite = Acl({
  $id: Now.ID['acl-request-approval-write'],
  type: 'field',
  table: 'x_snc_apr_trv_request',
  field: 'x_snc_apr_trv_approval_status',
  operation: 'write',
  roles: ['x_snc_apr_trv.approver'],
  active: true,
})

// x_snc_apr_trv_expense ACLs
export const aclExpenseRead = Acl({
  $id: Now.ID['acl-expense-read'],
  type: 'record',
  table: 'x_snc_apr_trv_expense',
  operation: 'read',
  roles: ['x_snc_apr_trv.user'],
  active: true,
  adminOverrides: true,
})

export const aclExpenseWrite = Acl({
  $id: Now.ID['acl-expense-write'],
  type: 'record',
  table: 'x_snc_apr_trv_expense',
  operation: 'write',
  roles: ['x_snc_apr_trv.user'],
  active: true,
  adminOverrides: true,
  condition: 'x_snc_apr_trv_reimbursement_status=submitted^ORx_snc_apr_trv_reimbursement_status=rejected',
})

// x_snc_apr_trv_policy ACLs
export const aclPolicyRead = Acl({
  $id: Now.ID['acl-policy-read'],
  type: 'record',
  table: 'x_snc_apr_trv_policy',
  operation: 'read',
  roles: ['x_snc_apr_trv.user'],
  active: true,
  adminOverrides: true,
})

export const aclPolicyWrite = Acl({
  $id: Now.ID['acl-policy-write'],
  type: 'record',
  table: 'x_snc_apr_trv_policy',
  operation: 'write',
  roles: ['x_snc_apr_trv.admin'],
  active: true,
  adminOverrides: true,
})

// x_snc_apr_trv_delegation ACLs
export const aclDelegationRead = Acl({
  $id: Now.ID['acl-delegation-read'],
  type: 'record',
  table: 'x_snc_apr_trv_delegation',
  operation: 'read',
  roles: ['x_snc_apr_trv.approver'],
  active: true,
  adminOverrides: true,
})

export const aclDelegationWrite = Acl({
  $id: Now.ID['acl-delegation-write'],
  type: 'record',
  table: 'x_snc_apr_trv_delegation',
  operation: 'write',
  roles: ['x_snc_apr_trv.approver'],
  active: true,
  adminOverrides: true,
})
