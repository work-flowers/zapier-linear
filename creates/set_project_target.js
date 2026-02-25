const perform = async (z, bundle) => {
  const options = {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: {
      Authorization: `${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: {
      query: `mutation {
      projectUpdate(
        input: {targetDate: "${bundle.inputData.targetDate}"},
        id: "${bundle.inputData.projectId}"
      ) {
        success
      }
    }`,
    },
  };

  return z.request(options).then((response) => {
    console.log('Hardcoded Test Request:', JSON.stringify(options, null, 2));
    return response.json;
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'projectId',
        label: 'Project ID',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'targetDate',
        label: 'Target Date',
        type: 'datetime',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description: 'Set the Target Date of a Project',
    hidden: false,
    label: 'Set Project Target Date',
  },
  key: 'set_project_target',
  noun: 'Target Date',
};
