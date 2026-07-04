// Contentful SDK Client — Infrastructure adapter
// Creates delivery (published) and preview (draft) clients.

import { createClient, type ContentfulClientApi } from 'contentful';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Delivery client — fetches published content only.
 */
let _deliveryClient: ContentfulClientApi<undefined> | null = null;

export function getDeliveryClient(): ContentfulClientApi<undefined> {
  if (!_deliveryClient) {
    _deliveryClient = createClient({
      space: getEnvVar('CONTENTFUL_SPACE_ID'),
      accessToken: getEnvVar('CONTENTFUL_ACCESS_TOKEN'),
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });
  }
  return _deliveryClient;
}

/**
 * Preview client — fetches draft (unpublished) content.
 * Uses the Preview API host and preview token.
 */
let _previewClient: ContentfulClientApi<undefined> | null = null;

export function getPreviewClient(): ContentfulClientApi<undefined> {
  if (!_previewClient) {
    _previewClient = createClient({
      space: getEnvVar('CONTENTFUL_SPACE_ID'),
      accessToken: getEnvVar('CONTENTFUL_PREVIEW_TOKEN'),
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      host: 'preview.contentful.com',
    });
  }
  return _previewClient;
}

/**
 * Get the appropriate client based on draft mode.
 */
export function getClient(isDraft: boolean = false): ContentfulClientApi<undefined> {
  return isDraft ? getPreviewClient() : getDeliveryClient();
}
