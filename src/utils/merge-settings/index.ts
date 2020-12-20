import { defaultSettings } from '../../defaultSettings'
import type { Settings } from '../../types'

/**
 * Merges default settings with user settings
 *
 * @returns the merged settings
 * @param settings The user settings
 */
export function mergeSettings(settings: Settings): Settings {
  return {
    ...defaultSettings,
    ...settings,
    transformer: {
      ...defaultSettings.transformer,
      ...settings.transformer
    },
    history: {
      ...defaultSettings.history,
      ...settings.history
    },
    cropper: {
      ...defaultSettings.cropper,
      ...settings.cropper
    },
    drawing: {
      ...defaultSettings.drawing,
      ...settings.drawing
    },
    selection: {
      ...defaultSettings.selection,
      ...settings.selection
    }
  }
}
