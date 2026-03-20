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
      issue(id: "${bundle.inputData.issue_id}") {
          labels(filter: {parent: {id: {eq: "${bundle.inputData.parent_label_id}"}}}) {
            nodes{
              id
              name
            }
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
      {
        key: 'parent_label_id',
        label: 'Parent Label ID',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description:
      'Retrieve a label associated with an Issue only if it belongs to a specific parent label',
    hidden: false,
    label: 'Retrieve Label for an Issue Under a Specific Parent',
  },
  key: 'issue_label',
  noun: 'Label',
};
