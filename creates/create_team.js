const perform = async (z, bundle) => {
  // Build the input object dynamically
  const input = {
    name: bundle.inputData.name,
    timezone: bundle.inputData.time_zone,
    triageEnabled: bundle.inputData.triage_enabled,
    issueEstimationType: bundle.inputData.issue_estimation_type,
    requirePriorityToLeaveTriage:
      bundle.inputData.require_priority_to_leave_triage,
    cycleDuration: bundle.inputData.cycle_duration,
    cycleCooldownTime: bundle.inputData.cycle_cooldown_time,
    cyclesEnabled: bundle.inputData.cycles_enabled,
    cycleIssueAutoAssignStarted:
      bundle.inputData.cycle_issue_auto_assign_started,
  };

  // Only add icon if provided
  if (bundle.inputData.icon_id) {
    input.icon = bundle.inputData.icon;
  }

  const options = {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: {
      Authorization: `${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: {
      query: `mutation TeamCreate($input: TeamCreateInput!) {
      teamCreate(input: $input) {
        team {
          id
          icon
        }
        success
      }
    }`,
      variables: {
        input: input,
      },
    },
  };

  return z.request(options).then((response) => {
    console.log('Request:', JSON.stringify(options, null, 2));
    return response.json;
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'name',
        label: 'Team Name',
        type: 'string',
        helpText: 'Enter the name for the new team',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'time_zone',
        label: 'Time Zone',
        type: 'string',
        default: 'Asia/Singapore',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'cycle_duration',
        label: 'Cycle Duration',
        type: 'integer',
        default: '4',
        helpText: 'Duration of cycles, in weeks',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'cycle_issue_auto_assign_started',
        label: 'Automatically Assign Issues to Current Cycle When Started?',
        type: 'boolean',
        default: 'TRUE',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'cycles_enabled',
        label: 'Cycles Enabled?',
        type: 'boolean',
        default: 'TRUE',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'issue_estimation_type',
        label: 'Issue Estimation Type',
        type: 'string',
        default: 'linear',
        choices: ['notUsed', 'exponential', 'fibonacci', 'linear', 'tShirt'],
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'triage_enabled',
        label: 'Triage Enabled?',
        type: 'boolean',
        default: 'TRUE',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'require_priority_to_leave_triage',
        label: 'Require Priority to Leave Triage?',
        type: 'boolean',
        default: 'TRUE',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'cycle_cooldown_time',
        label: 'Cycle Cooldown Time',
        type: 'integer',
        default: '0',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'icon',
        label: 'Icon Name',
        type: 'string',
        helpText:
          "Name of the icon you want to use for the team's icon. If using an emoji, surround in :colons:",
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description: 'Create a new Team in Linear',
    hidden: false,
    label: 'Create Team',
  },
  key: 'create_team',
  noun: 'Team',
};
