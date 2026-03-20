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
      query: `query {
      comments(filter: { issue: { id: { eq: "${bundle.inputData.issue_id}" } } }) {
        nodes {
          body
          createdAt
        }
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
        key: 'issue_id',
        label: 'Issue ID',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description: 'Retrieve comments for a specific Issue',
    hidden: false,
    label: 'Retrieve Issue Comments',
  },
  key: 'list_issue_comments',
  noun: 'Comment',
};
