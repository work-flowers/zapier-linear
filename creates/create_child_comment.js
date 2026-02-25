const perform = async (z, bundle) => {
  const query = `
mutation AddComment($input: CommentCreateInput!) {
  commentCreate(input: $input) {
    success
    comment { id url }
  }
}
`;

  const bodyValue = Array.isArray(bundle.inputData.body)
    ? bundle.inputData.body.join('\n')
    : String(bundle.inputData.body || '');

  const cleanedBody = bodyValue
    .replace(/!\[.*?\]\((cid:[^)]+)\)/gi, '')
    .replace(/!\[.*?\]\((https?:\/\/[^)]+mailtrack[^)]*)\)/gi, '')
    .replace(/\r\n?/g, '\n');

  const variables = {
    input: {
      issueId: bundle.inputData.issue_id,
      parentId: bundle.inputData.parent_id || null,
      body: cleanedBody,
    },
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
        key: 'body',
        label: 'Body',
        type: 'text',
        helpText: 'Body of the comment to create',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'parent_id',
        label: 'Parent ID',
        type: 'string',
        helpText: 'ID of the parent comment to reply to',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
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
    description: 'Create a child comment of a specified parent comment',
    hidden: false,
    label: 'Create Child Comment',
  },
  key: 'create_child_comment',
  noun: 'Comment',
};
