import Konva from 'konva'

import { CropperOptions } from './cropper'

import { Nullable } from '.'

export declare interface BaseSettings {
  container?: HTMLDivElement
  width: number
  height: number
  disableCanvasContextMenu: boolean
  containerClassName: string
  transformer: Konva.TransformerConfig
  cropper: Partial<CropperOptions>
  snapToGrid: Nullable<Konva.LineConfig>
  drawing: Partial<{
    autoSelect: boolean
    keyboard: {
      cancelOnEscape: boolean
    }
  }>
  selection: Partial<{
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
  }>
  history: Partial<{
    keyboard: {
      enabled: boolean
    }
  }>
  measurement: Partial<
    Nullable<{
      margin: number
      background: Konva.TagConfig
      text: Konva.TextConfig
    }>
  >
}

export declare type Settings = Partial<BaseSettings>
