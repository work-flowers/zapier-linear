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
      projectAttachmentCreate(
        input: {
          projectId: "${bundle.inputData.projectId}",
          url: "${bundle.inputData.url}",
          title: "${bundle.inputData.title}"
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
        key: 'projectId',
        label: 'Project ID',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'url',
        label: 'URL',
        type: 'string',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'title',
        label: 'Title',
        type: 'string',
        helpText: 'Title for the attachment',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description: 'Create an Attachment for a Linear Project',
    hidden: false,
    label: 'Create Project Attachment',
  },
  key: 'create_project_attachment',
  noun: 'Attachment',
};
