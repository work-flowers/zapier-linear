const perform = async (z, bundle) => {
  const hasParentLabel = !!bundle.inputData.parent_label_id;

  const query = `
    query GetIssueDetails($id: String!${hasParentLabel ? ', $parentLabelId: ID!' : ''}) {
      issue(id: $id) {
        identifier
        team {
          id
          key
          name
        }
        state {
          id
          name
          type
        }
        ${
          hasParentLabel
            ? `labels(filter: {parent: {id: {eq: $parentLabelId}}}) {
          nodes {
            id
            name
          }
        }`
            : ''
        }
      }
    }
  `;

  const variables = { id: bundle.inputData.issue_id };
  if (hasParentLabel) {
    variables.parentLabelId = bundle.inputData.parent_label_id;
  }

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

  return z.request(options).then((response) => {
    const json = response.json;

    if (json.errors?.length) {
      throw new z.errors.Error(
        `Linear GraphQL error: ${json.errors.map((e) => e.message).join('; ')}`,
        'GraphQLError',
        response.status,
      );
    }

    const issue = json?.data?.issue;

    if (!issue) {
      return [];
    }

    const result = {
      identifier: issue.identifier,
      team: issue.team,
      state: issue.state,
    };

    if (hasParentLabel) {
      const nodes = issue.labels?.nodes || [];
      result.child_label_id = nodes.length > 0 ? nodes[0].id : null;
      result.child_label_name = nodes.length > 0 ? nodes[0].name : null;
    }

    return [result];
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
        required: false,
        list: false,
        altersDynamicFields: false,
        helpText:
          'If provided, returns the child label under this parent that is associated with the issue.',
      },
    ],
  },
  display: {
    description:
      'Retrieve the identifier, team, state, and optionally a child label for a specific issue.',
    hidden: false,
    label: 'Retrieve Issue Details',
  },
  key: 'retrieve_issue_details',
  noun: 'Issue',
};
