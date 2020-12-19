import Konva from 'konva'

import { CropperOptions } from './crop'

export declare interface Settings {
  container: HTMLDivElement
  width?: number
  height?: number
  transformer?: Konva.TransformerConfig
  cropper?: Partial<CropperOptions>
  selection?: {
    transformer?: Konva.TransformerConfig
  }
}
