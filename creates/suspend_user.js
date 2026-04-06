const perform = async (z, bundle) => {
  const query = `
mutation SuspendUser($id: String!) {
  userSuspend(id: $id) {
    success
  }
}
`;

  const variables = {
    id: bundle.inputData.user_id,
  };

  const options = {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: {
      Authorization: bundle.authData.api_key,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  };

  return z.request(options).then((res) => res.json);
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'user_id',
        label: 'User ID',
        type: 'string',
        helpText: 'The ID of the user to suspend. Must be called by an admin or owner.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description: 'Suspend a user in Linear. Can only be called by an admin or owner.',
    hidden: false,
    label: 'Suspend User',
  },
  key: 'suspend_user',
  noun: 'User',
};
