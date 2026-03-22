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
        teams(includeArchived: true, orderBy: updatedAt) {
          nodes {
            id
            key
            name
            description
            retiredAt
            updatedAt
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

    const teams = json?.data?.teams?.nodes || [];

    return teams.map((team) => {
      const isRetired = !!team.retiredAt;
      return {
        ...team,
        id: `${team.id}_${team.retiredAt || 'active'}`,
        team_id: team.id,
        is_retired: isRetired,
      };
    });
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [],
    outputFields: [
      { key: 'id', label: 'Dedup ID' },
      { key: 'team_id', label: 'Team ID' },
      { key: 'key', label: 'Team Key' },
      { key: 'name', label: 'Team Name' },
      { key: 'description', label: 'Description' },
      { key: 'is_retired', label: 'Is Retired', type: 'boolean' },
      { key: 'retiredAt', label: 'Retired At', type: 'datetime' },
      { key: 'updatedAt', label: 'Updated At', type: 'datetime' },
    ],
  },
  display: {
    description:
      'Triggers when a team is retired or unretired in the Linear workspace.',
    hidden: false,
    label: 'Team Retirement Status Changed',
  },
  key: 'team_retirement_status_changed',
  noun: 'Team',
};
