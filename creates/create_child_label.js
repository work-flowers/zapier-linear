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
      issueLabelCreate(
        input: {name: "${bundle.inputData.child_name}", parentId: "${bundle.inputData.parent_label_id}"}
      ) {issueLabel {id}}
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
        key: 'child_name',
        label: 'Child Label Name',
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
    description: 'Create a child label under a specific parent',
    hidden: false,
    label: 'Create Child Label',
  },
  key: 'create_child_label',
  noun: 'label',
};
