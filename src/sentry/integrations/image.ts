import { Event, EventProcessor, Hub, Integration } from '@sentry/types'
import { attachmentUrlFromDsn } from '../utils'

export class Image implements Integration {
  /**
   * @inheritDoc
   */
   public static id: string = 'Image'

   /**
    * @inheritDoc
    */
   public readonly name: string = Image.id

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
      if (hub.getIntegration(Image)) {
        console.log(event)
        if (event.exception) {
          // try {
          //   const endpoint = attachmentUrlFromDsn(
          //     hub.getClient().getDsn(),
          //     event.event_id
          //   )
          //   const formData = new FormData()

          //   formData.append(
          //     'image',
          //     new Blob([document.documentElement.innerHTML], {
          //       type: 'text/html',
          //     }),
          //     'image.html'
          //   )

          //   fetch(endpoint, {
          //     method: 'POST',
          //     body: formData,
          //   }).catch((ex) => {
          //     // we have to catch this otherwise it throws an infinite loop in Sentry
          //     console.error(ex)
          //   })
          //   return event
          // } catch (ex) {
          //   console.error(ex)
          // }
        }
      }

      return event
    })
  }
}
