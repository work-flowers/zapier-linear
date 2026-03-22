const perform = async (z, bundle) => {
  const options = {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: {
      Authorization: bundle.authData.api_key,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
      query {
        teams(orderBy: createdAt) {
          nodes {
            id
            key
            name
            description
            createdAt
          }
        }
      }
    `,
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

    return json?.data?.teams?.nodes || [];
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [],
  },
  display: {
    description: 'Triggers when a new team is created in the Linear workspace.',
    hidden: false,
    label: 'New Team',
  },
  key: 'new_team',
  noun: 'Team',
};
