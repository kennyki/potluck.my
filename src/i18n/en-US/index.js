export default {
  actions: {
    accept: 'Accept',
    add: 'Add',
    cancel: 'Cancel',
    createEvent: 'Create event',
    createProfile: 'Create profile',
    delete: 'Delete',
    deleteProfile: 'Delete profile',
    dismiss: 'Dismiss',
    edit: 'Edit',
    getStarted: 'Get started',
    reject: 'Reject',
    submit: 'Submit'
  },
  auth: {
    initError: 'Unable to initialize user',
    requiresAuth: 'Please create your profile',
    requiresGuest: 'You already have a profile'
  },
  descriptions: {
    maxLength: 'Max {n} characters'
  },
  home: {
    tagline: 'Easy potluck organizing',
    benefit1: 'No payment required',
    benefit2: 'No app download required',
    benefit3: 'No sign up required',
    benefit4: 'No fuss, no muss',
    howItWork: 'How does it work?',
    step1: 'Create an event',
    step2: 'Build a list of needs',
    step3: 'Share event link to your guests',
    step4: 'Work out who\'s bringing or doing what'
  },
  labels: {
    content: 'Content',
    description: 'Description',
    event: 'Event',
    itemTitle: 'To bring / To do',
    loading: 'Loading...',
    name: 'Name',
    no: 'No',
    notice: 'Notice',
    yes: 'Yes'
  },
  prompts: {
    acceptItem: 'Accept "{item}" added by {name}? This will show it in the list.',
    deleteItem: 'This will delete "{item}" permanently. Are you sure?',
    deleteProfile: 'This will delete your profile permanently. Are you sure?',
    rejectItem: 'Reject "{item}" added by {name}? This will hide it from the list.'
  },
  statuses: {
    active: 'Active',
    rejected: 'Rejected'
  },
  validations: {
    required: 'This field is required',
    maxLength: 'This field allows at most {n} characters',
    minLength: 'This field should be empty | This field requires at least {n} character | This field requires at least {n} characters',
    pattern: 'This field requires pattern: {hint}'
  }
}
