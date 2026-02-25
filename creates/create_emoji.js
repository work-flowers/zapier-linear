const perform = async (z, bundle) => {
  // Step 1: Fetch the image from the public URL
  const imageResponse = await z.request({
    url: bundle.inputData.url,
    method: 'GET',
    raw: true,
  });

  const imageBuffer = await imageResponse.buffer();
  const fileSize = imageBuffer.length;
  const contentType = imageResponse.headers.get('content-type') || 'image/png';

  // Step 2: Request upload URL from Linear
  const uploadUrlResponse = await z.request({
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: {
      Authorization: `${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: {
      query: `mutation FileUpload($contentType: String!, $filename: String!, $size: Int!) {
      fileUpload(contentType: $contentType, filename: $filename, size: $size) {
        success
        uploadFile {
          uploadUrl
          assetUrl
          headers {
            key
            value
          }
        }
      }
    }`,
      variables: {
        contentType: contentType,
        filename: `${bundle.inputData.emoji_name}.png`,
        size: fileSize,
      },
    },
  });

  const uploadData = uploadUrlResponse.json.data.fileUpload;

  if (!uploadData.success) {
    throw new z.errors.Error('Failed to get upload URL from Linear');
  }

  // Log the raw headers from Linear
  console.log(
    'Raw headers from Linear:',
    JSON.stringify(uploadData.uploadFile.headers, null, 2),
  );

  // Find x-goog-content-length-range header
  const contentLengthRangeHeader = uploadData.uploadFile.headers.find(
    (h) => h.key.toLowerCase() === 'x-goog-content-length-range',
  );

  // Use native https module
  const https = z.require('https');
  const url = new URL(uploadData.uploadFile.uploadUrl);

  const uploadPromise = new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'PUT',
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: data });
        });
      },
    );

    // Set headers explicitly - use the same contentType we sent to Linear
    req.setHeader('Content-Type', contentType);
    if (contentLengthRangeHeader) {
      req.setHeader(
        'x-goog-content-length-range',
        contentLengthRangeHeader.value,
      );
    }
    req.setHeader('Content-Length', imageBuffer.length);

    console.log('Uploading with Content-Type:', contentType);
    console.log('Buffer length:', imageBuffer.length);

    req.on('error', reject);
    req.write(imageBuffer);
    req.end();
  });

  const uploadResult = await uploadPromise;

  if (uploadResult.status >= 400) {
    throw new z.errors.Error(
      `Upload failed: ${uploadResult.status} - ${uploadResult.body}`,
    );
  }

  // Step 4: Create the emoji using the Linear-hosted URL
  const emojiResponse = await z.request({
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: {
      Authorization: `${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: {
      query: `mutation EmojiCreate($name: String!, $url: String!) {
      emojiCreate(input: { name: $name, url: $url }) {
        success
        emoji {
          id
          name
          url
        }
      }
    }`,
      variables: {
        name: bundle.inputData.emoji_name,
        url: uploadData.uploadFile.assetUrl,
      },
    },
  });

  return emojiResponse.json.data.emojiCreate;
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'emoji_name',
        label: 'Emoji Name',
        type: 'string',
        helpText: 'Name of the emoji to create',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'url',
        label: 'Image URL',
        type: 'string',
        helpText: 'Public URL for the image to use',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  display: {
    description: 'Creates a custom emoji from a public image URL',
    hidden: false,
    label: 'Create Emoji',
  },
  key: 'create_emoji',
  noun: 'Emoji',
};
