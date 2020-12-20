import { Settings } from '../../types'

import { defaultSettings } from '../../defaultSettings'

import { mergeSettings } from '.'

describe('Utils -> mergeSettings', () => {
  it('should merge the settings with the default values', async () => {
    const settings = mergeSettings({} as Settings)
    expect(settings).toStrictEqual(defaultSettings as Settings)
  })

  it('should override the settings over the default values', async () => {
    const settings = mergeSettings({
      selection: {
        interactive: false
      }
    } as Settings)

    const expected = {
      ...defaultSettings,
      selection: {
        ...defaultSettings.selection,
        interactive: false
      }
    } as Settings

    expect(settings).toStrictEqual(expected)
  })
})
