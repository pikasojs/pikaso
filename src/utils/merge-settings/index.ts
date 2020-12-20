import merge from 'deepmerge'

import { defaultSettings } from '../../defaultSettings'
import { omit } from '../omit'

import type { Settings } from '../../types'

/**
 * Merges default settings with user settings
 *
 * @returns the merged settings
 * @param settings The user settings
 */
export function mergeSettings(settings: Settings): Settings {
  return {
    container: settings.container,
    ...merge(defaultSettings, omit(settings, ['container']))
  }
}
