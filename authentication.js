const test = async (z, bundle) => {
  const options = {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: {
      Authorization: `${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
    },
    params: {},
    body: {
      query: 'query { emojis { nodes { name } } } ',
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  type: 'custom',
  test: test,
  fields: [
    {
      computed: false,
      key: 'api_key',
      required: true,
      label: 'Personal API Key',
      type: 'password',
    },
  ],
  customConfig: {},
};
