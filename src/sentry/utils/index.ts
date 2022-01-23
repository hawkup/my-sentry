import { Dsn } from '@sentry/types'

export function attachmentUrlFromDsn(dsn: Dsn, eventId: string): string {
  const { host, path, projectId, port, protocol, user } = dsn

  return `${protocol}://${host}${port !== '' ? `:${port}` : ''}${
    path !== '' ? `/${path}` : ''
  }/api/${projectId}/events/${eventId}/attachments/?sentry_key=${user}&sentry_version=7&sentry_client=custom-javascript`
}
