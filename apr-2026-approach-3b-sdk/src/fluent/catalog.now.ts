import {
  CatalogItem,
  VariableSet,
  CatalogClientScript,
  CatalogUiPolicy,
} from '@servicenow/sdk/core'

export const vsTravelDetails = VariableSet({
  $id: Now.ID['vs-travel-details'],
  title: 'Travel Details',
  internalName: 'travel_details',
  type: 'singleRow',
  order: 100,
  variables: {
    destination_city: {
      type: 'singleLineText',
      question: 'Destination City',
      order: 100,
      mandatory: true,
    },
    destination_country: {
      type: 'reference',
      question: 'Destination Country',
      order: 200,
      mandatory: true,
      referenceTable: 'core_country',
    },
    departure_date: {
      type: 'date',
      question: 'Departure Date',
      order: 300,
      mandatory: true,
    },
    return_date: {
      type: 'date',
      question: 'Return Date',
      order: 400,
      mandatory: true,
    },
    purpose: {
      type: 'selectBox',
      question: 'Purpose',
      order: 500,
      mandatory: true,
      choices: {
        conference: 'Conference',
        client_meeting: 'Client Meeting',
        training: 'Training',
        internal: 'Internal',
        other: 'Other',
      },
    },
    estimated_cost: {
      type: 'singleLineText',
      question: 'Estimated Cost',
      order: 600,
      mandatory: true,
    },
    requires_visa: {
      type: 'checkBox',
      question: 'Requires Visa',
      order: 700,
    },
    additional_notes: {
      type: 'multiLineText',
      question: 'Additional Notes',
      order: 800,
    },
  },
})

export const vsTravelerInfo = VariableSet({
  $id: Now.ID['vs-traveler-info'],
  title: 'Traveler Info',
  internalName: 'traveler_info',
  type: 'singleRow',
  order: 50,
  variables: {
    traveler_name: {
      type: 'singleLineText',
      question: 'Traveler Name',
      order: 100,
      readOnly: true,
    },
    traveler_department: {
      type: 'singleLineText',
      question: 'Department',
      order: 200,
      readOnly: true,
    },
    traveler_manager: {
      type: 'singleLineText',
      question: 'Manager',
      order: 300,
      readOnly: true,
    },
  },
})

export const catalogItemTravel = CatalogItem({
  $id: Now.ID['cat-item-travel'],
  name: 'Submit Travel Request',
  description: 'Submit a new travel request for approval',
  shortDescription: 'Submit a travel request',
  active: true,
  variableSets: [
    { variableSet: vsTravelDetails, order: 100 },
    { variableSet: vsTravelerInfo, order: 50 },
  ],
})

export const catCsAutoPopulate = CatalogClientScript({
  $id: Now.ID['cat-cs-auto-populate'],
  name: 'Auto-populate Traveler Info',
  type: 'onLoad',
  active: true,
  catalogItem: catalogItemTravel,
  script: `
function onLoad() {
  var user = g_user;
  g_form.setValue('traveler_name', user.firstName + ' ' + user.lastName);
  g_form.setValue('traveler_department', user.department);
  g_form.setValue('traveler_manager', user.managerName || '');
}
`,
})

export const catCsValidateDateRange = CatalogClientScript({
  $id: Now.ID['cat-cs-validate-date-range'],
  name: 'Validate Date Range',
  type: 'onChange',
  variableName: 'return_date',
  active: true,
  catalogItem: catalogItemTravel,
  script: `
function onChange(control, oldValue, newValue, isLoading) {
  if (isLoading) return;
  var departure = g_form.getValue('departure_date');
  if (departure && newValue && newValue <= departure) {
    g_form.showFieldMsg('return_date', 'Return date must be after departure date', 'error');
  }
}
`,
})

export const catCsShowVisaReminder = CatalogClientScript({
  $id: Now.ID['cat-cs-show-visa-reminder'],
  name: 'Show Visa Reminder',
  type: 'onChange',
  variableName: 'destination_country',
  active: true,
  catalogItem: catalogItemTravel,
  script: `
function onChange(control, oldValue, newValue, isLoading) {
  if (isLoading) return;
  if (newValue) {
    g_form.showFieldMsg('destination_country', 'Please check visa requirements for this destination', 'info');
  }
}
`,
})

export const catUpShowVisa = CatalogUiPolicy({
  $id: Now.ID['cat-up-show-visa'],
  shortDescription: 'Show Visa for International',
  active: true,
  onLoad: true,
  reverseIfFalse: true,
  catalogItem: catalogItemTravel,
  catalogCondition: 'destination_country!=',
  actions: [
    { variableName: 'requires_visa', visible: true },
  ],
})

export const catUpRequireNotes = CatalogUiPolicy({
  $id: Now.ID['cat-up-require-notes'],
  shortDescription: 'Require Notes for High Cost',
  active: true,
  onLoad: true,
  reverseIfFalse: true,
  catalogItem: catalogItemTravel,
  catalogCondition: 'estimated_cost>5000',
  actions: [
    { variableName: 'additional_notes', mandatory: true },
  ],
})
