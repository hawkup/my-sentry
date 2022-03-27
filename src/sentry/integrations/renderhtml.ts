import { Event, EventProcessor, Hub, Integration } from '@sentry/types'
import { attachmentUrlFromDsn } from '../utils'

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
  public constructor(options = {}) {}

  /**
   * @inheritDoc
   */
  public setupOnce(addGlobalEventProcessor: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void {
    const hub = getCurrentHub()

    addGlobalEventProcessor((event: Event): Event => {
      if (hub.getIntegration(RenderHtml)) {
        if (event.exception) {
          try {
            const dsn = hub.getClient()?.getDsn()
            if (dsn) {
              const endpoint = attachmentUrlFromDsn(
                dsn,
                event.event_id ?? ''
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
            }
          } catch (ex) {
            console.error(ex)
          }
        }
      }

      return event
    })
  }
}
