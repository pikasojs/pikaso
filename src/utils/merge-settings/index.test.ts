import { Settings } from '../../types'

import { defaultSettings } from '../../defaultSettings'

import { mergeSettings } from '.'

describe('Utils -> mergeSettings', () => {
  it('should merge the settings with the default values', async () => {
    const container = document.createElement('div')

    const settings = mergeSettings({
      container
    } as Settings)

    const expected = {
      container,
      ...defaultSettings
    } as Settings

    expect(settings).toStrictEqual(expected)
  })

  it('should override the settings over the default values', async () => {
    const settings = mergeSettings({
      selection: {
        interactive: false
      },
      cropper: {
        overlay: {
          opacity: 0.75
        }
      }
    } as Settings)

    expect(settings.selection?.interactive).toStrictEqual(false)
    expect(settings.cropper?.overlay?.opacity).toStrictEqual(0.75)
    expect(settings.cropper?.overlay?.color).toStrictEqual('#262626')
  })
})
