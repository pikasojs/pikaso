import Konva from 'konva'

import { CropperOptions } from './cropper'

export declare interface RequiredSettings {
  container: HTMLDivElement
}
export declare interface OptionalSettings {
  width: number
  height: number
  disableCanvasContextMenu: boolean
  containerClassName: string
  transformer: Konva.TransformerConfig
  cropper: Partial<CropperOptions>
  drawing: {
    keyboard: {
      cancelOnEscape: boolean
    }
  }
  selection: {
    interactive: boolean
    keyboard: {
      enabled: boolean
      movingSpaces: number
      map: {
        delete: string[]
        moveLeft: string[]
        moveRight: string[]
        moveUp: string[]
        moveDown: string[]
        deselect: string[]
      }
    }
    transformer: Konva.TransformerConfig
    zone: Konva.RectConfig
  }
  history: {
    keyboard: {
      enabled: boolean
    }
  }
}

export declare type Settings = Partial<OptionalSettings> & RequiredSettings
