// Contentful Management Client — Write adapter
// Uses the Content Management API (plain client) to create/update entries.

import { createClient, type PlainClientAPI } from 'contentful-management';

function getManagementToken(): string {
  const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  if (!token) {
    throw new Error('Missing CONTENTFUL_MANAGEMENT_TOKEN in environment variables');
  }
  return token;
}

function getSpaceId(): string {
  const id = process.env.CONTENTFUL_SPACE_ID;
  if (!id) {
    throw new Error('Missing CONTENTFUL_SPACE_ID in environment variables');
  }
  return id;
}

function getEnvironmentId(): string {
  return process.env.CONTENTFUL_ENVIRONMENT || 'master';
}

let _plainClient: PlainClientAPI | null = null;

export function getPlainClient(): PlainClientAPI {
  if (!_plainClient) {
    _plainClient = createClient(
      { accessToken: getManagementToken() },
      {
        type: 'plain',
        defaults: {
          spaceId: getSpaceId(),
          environmentId: getEnvironmentId(),
        },
      }
    );
  }
  return _plainClient;
}
