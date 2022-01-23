import { Dsn, Event, EventHint, EventProcessor, Hub, Integration } from '@sentry/types'
import { getGlobalObject } from '@sentry/utils'

const global = getGlobalObject<Window | NodeJS.Global>()

export class RenderHtml implements Integration {
  /**
   * @inheritDoc
   */
   public static id: string = 'RenderHtml'

   /**
    * @inheritDoc
    */
   public readonly name: string = RenderHtml.id

  /**
   * @inheritDoc
   */
  public constructor(options = {}) {

  }

  /**
   * @inheritDoc
   */
  public setupOnce(addGlobalEventProcessor: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void {
    const hub = getCurrentHub()

    addGlobalEventProcessor((event: Event, hint?: EventHint) => {
      if (hub.getIntegration(RenderHtml)) {
        if (event.exception) {
          console.log(event)
          try {
            const endpoint = this.attachmentUrlFromDsn(
              hub.getClient().getDsn(),
              event.event_id
            )
            const formData = new FormData()

            formData.append(
              'document',
              new Blob([document.documentElement.innerHTML], {
                type: 'text/html',
              }),
              'document.html'
            )

            fetch(endpoint, {
              method: 'POST',
              body: formData,
            }).catch((ex) => {
              // we have to catch this otherwise it throws an infinite loop in Sentry
              console.error(ex)
            })
            return event
          } catch (ex) {
            console.error(ex)
          }
        }
      }
    })
  }

  private attachmentUrlFromDsn(dsn: Dsn, eventId: string): string {
    const { host, path, projectId, port, protocol, user } = dsn

    return `${protocol}://${host}${port !== '' ? `:${port}` : ''}${
      path !== '' ? `/${path}` : ''
    }/api/${projectId}/events/${eventId}/attachments/?sentry_key=${user}&sentry_version=7&sentry_client=custom-javascript`
  }
}
