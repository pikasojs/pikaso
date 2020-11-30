import Konva from 'konva'

import type { Line } from './Shape/Line'
import type { Rect } from './Shape/Rect'
import type { Arrow } from './Shape/Arrow'
import type { Label } from './Shape/Label'
import type { Image } from './Shape/Image'
import type { Circle } from './Shape/Circle'
import type { Ellipse } from './Shape/Ellipse'
import type { Polygon } from './Shape/Polygon'
import type { Triangle } from './Shape/Triangle'
import type { Shape } from './Shape'

export type Nullable<T> = T | null

export interface IEmitter {
  emit: (eventName: string, data: object) => void
}

export interface UnknownObject {
  [key: string]: boolean | number | string | null | undefined
}
export declare interface Settings {
  container: HTMLDivElement
  width?: number
  height?: number
}

export declare interface Dimensions {
  width: number
  height: number
}

export declare interface Point {
  x: number
  y: number
}

export declare interface ExportOptions {
  pixelRatio?: number
}

export type HistoryNode = Konva.Stage | Konva.Layer | Konva.Shape | Konva.Group
export type HistoryHookFunction = (states: HistoryState[]) => void
export interface HistoryState {
  nodes: HistoryNode[]
  snapshots: UnknownObject[]
}

export interface HistoryHooks {
  undo?: HistoryHookFunction
  redo?: HistoryHookFunction
  execute?: HistoryHookFunction
}

export interface CropOptions extends ExportOptions {
  rect: Point & Dimensions
}

export interface BaseCropperOptions {
  x: number
  y: number
  keepRatio: boolean
  overlayColor: string
  overlayOpacity: number
  fixed: boolean
  borderColor: string
  borderDash: number[]
  borderWidth: number
  anchorSize: number
  anchorColor: string
  anchorBorderColor: string
  anchorBorderWidth: number
  marginRatio: number
  guides: boolean
  guidesCount: number
  guidesColor: string
  guidesWidth: number
  guidesDash: number[]
  minWidth: number
  minHeight: number
}

export interface RectangleCropperOptions extends BaseCropperOptions {
  circular: false
  width: number
  height: number
  aspectRatio: number
}

export interface CircularCropperOptions extends BaseCropperOptions {
  circular: true
  radius: number
  circleBorderColor?: string
  circleBorderDash?: number[]
  circleBorderWidth?: number
}

export declare type CropperOptions =
  | RectangleCropperOptions
  | CircularCropperOptions

export enum DrawType {
  Text = 'Text',
  Pencil = 'Pencil',
  Line = 'Line',
  Arrow = 'Arrow',
  Circle = 'Circle',
  Rect = 'Rect',
  Ellipse = 'Ellipse',
  Polygon = 'Polygon',
  Triangle = 'Triangle'
}

export declare interface Shapes {
  line: Line
  rect: Rect
  arrow: Arrow
  label: Label
  image: Image
  circle: Circle
  ellipse: Ellipse
  triangle: Triangle
  polygon: Polygon
}

export declare interface IDrawableShape {
  draw: (config: Partial<Konva.ShapeConfig>) => void
  stopDrawing: () => void
}

export declare interface IShape {
  insert: (config: Konva.ShapeConfig) => void
}

export declare interface EventListenerCallbackEvent {
  name?: string
  nodes?: (Konva.Shape | Konva.Group)[]
  shapes?: Shape[]
  data?: UnknownObject
}

export declare type EventListenerNames =
  | '*'
  | 'board:rescale'
  | 'board:change-active-drawing'
  | 'board:gc'
  | 'shape:create'
  | 'shape:move'
  | 'shape:delete'
  | 'shape:rotate'
  | 'shape:gc'
  | 'shape:destroy'
  | 'shape:delete'
  | 'shape:undelete'
  | 'flip:x'
  | 'flip:y'
  | 'history:undo'
  | 'history:redo'
  | 'history:reset'
  | 'selection:change'
  | 'selection:move'
  | 'selection:dragstart'
  | 'selection:dragmove'
  | 'selection:dragend'
  | 'selection:transformstart'
  | 'selection:transform'
  | 'selection:transformend'
  | 'selection:delete'
  | 'filter:add'
  | 'filter:remove'

export declare type Filters =
  | {
      name: 'Blur'
      options?: Partial<{
        blurRadius: number
      }>
    }
  | {
      name: 'Contrast'
      options?: Partial<{
        contrast: number
      }>
    }
  | {
      name: 'Brighten'
      options?: Partial<{
        brightness: number
      }>
    }
  | {
      name: 'Solarize'
      options?: Partial<{
        threshold: number
      }>
    }
  | {
      name: 'Mask'
      options?: Partial<{
        threshold: number
      }>
    }
  | {
      name: 'Emboss'
      options?: Partial<{
        embossStrength: number
        embossWhiteLevel: number
        embossBlend: boolean
        embossDirection:
          | 'top-left'
          | 'top'
          | 'top-right'
          | 'right'
          | 'bottom-right'
          | 'bottom-left'
          | 'bottom'
          | 'left'
      }>
    }
  | {
      name: 'Enhance'
      options?: Partial<{
        enhance: number
      }>
    }
  | {
      name: 'HSL'
      options?: Partial<{
        luminance: number
      }>
    }
  | {
      name: 'HSV'
      options?: Partial<{
        value: number
      }>
    }
  | {
      name: 'Noise'
      options?: Partial<{
        noise: number
      }>
    }
  | {
      name: 'Pixelate'
      options?: Partial<{
        pixelSize: number
      }>
    }
  | {
      name: 'Posterize'
      options?: Partial<{
        levels: number
      }>
    }
  | {
      name: 'RGB'
      options?: Partial<{
        red: number
        green: number
        blue: number
      }>
    }
  | {
      name: 'RGBA'
      options?: Partial<{
        alpha: number
        red: number
        green: number
        blue: number
      }>
    }
  | {
      name: 'Kaleidoscope'
      options?: Partial<{
        kaleidoscopePower: number
        kaleidoscopeAngle: number
      }>
    }
  | {
      name: 'Grayscale'
      options?: {}
    }
  | {
      name: 'Invert'
      options?: {}
    }
  | {
      name: 'Sepia'
      options?: {}
    }
