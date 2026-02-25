const perform = async (z, bundle) => {
  const options = {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: {
      Authorization: bundle.authData.api_key, // raw API key
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query GetIssueTeamAndState($id: String!) {
        issue(id: $id) {
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
        }
      }
    `,
      variables: { id: bundle.inputData.issue_id },
    }),
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
      return []; // for searches
      // throw new z.errors.Error("Issue not found", "NotFound", 404); // for creates
    }

    // For SEARCH return [object], for CREATE return object
    return [issue];
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
    description:
      'Retrieve the team ID, team key, team name and state for a specific issue',
    hidden: false,
    label: 'Retrieve Team and State',
  },
  key: 'retrieve_team',
  noun: 'Team',
};
