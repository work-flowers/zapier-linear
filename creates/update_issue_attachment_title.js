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
      attachmentUpdate(
        id: "${bundle.inputData.attachmentId}"
        input: {
          title: "${bundle.inputData.attachmentTitle}"
        }
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
        key: 'attachmentId',
        label: 'Attachment ID',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'attachmentTitle',
        label: 'Attachment Title',
        type: 'string',
        helpText: 'Title to add to the issue attachment',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description: 'Updates the title of an issue attachment',
    hidden: false,
    label: 'Update Issue Attachment Title',
  },
  key: 'update_issue_attachment_title',
  noun: 'Attachment',
};
