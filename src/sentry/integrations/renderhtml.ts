import { Event, EventHint, EventProcessor, Hub, Integration } from '@sentry/types'
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

    addGlobalEventProcessor((event: Event, hint?: EventHint) => {
      if (hub.getIntegration(RenderHtml)) {
        if (event.exception) {
          console.log(event)
          try {
            const endpoint = attachmentUrlFromDsn(
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
}
