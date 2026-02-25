const perform = async (z, bundle) => {
  const options = {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: {
      Authorization: `${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `query {
      workflowState(id: "${bundle.inputData.state_id}") {
        type,
        name
      }
    }`,
    }),
  };

  return z.request(options).then((response) => {
    const json = response.json;
    const workflowState = json.data.workflowState;

    // Wrap in array to satisfy Zapier’s expected format
    return [workflowState];
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'state_id',
        label: 'State ID',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description: 'Finds a workflow state for a specific state_id',
    hidden: false,
    label: 'Retrieve Workflow State',
  },
  key: 'retrieve_state',
  noun: 'State',
};
