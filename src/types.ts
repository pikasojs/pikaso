import Konva from 'konva'

import type { LineDrawer } from './shape/drawers/LineDrawer'
import type { RectDrawer } from './shape/drawers/RectDrawer'
import type { ArrowDrawer } from './shape/drawers/ArrowDrawer'
import type { LabelDrawer } from './shape/drawers/LabelDrawer'
import type { ImageDrawer } from './shape/drawers/ImageDrawer'
import type { CircleDrawer } from './shape/drawers/CircleDrawer'
import type { EllipseDrawer } from './shape/drawers/EllipseDrawer'
import type { PolygonDrawer } from './shape/drawers/PolygonDrawer'
import type { TriangleDrawer } from './shape/drawers/TriangleDrawer'
import type { PencilDrawer } from './shape/drawers/PencilDrawer'

import type { ShapeModel } from './shape/ShapeModel'

export type Nullable<T> = T | null

export interface IEmitter {
  emit: (eventName: string, data: object) => void
}

export interface UnknownObject {
  [key: string]: boolean | number | string | object | null | undefined
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
  line: LineDrawer
  rect: RectDrawer
  arrow: ArrowDrawer
  label: LabelDrawer
  image: ImageDrawer
  circle: CircleDrawer
  ellipse: EllipseDrawer
  triangle: TriangleDrawer
  polygon: PolygonDrawer
  pencil: PencilDrawer
}

export declare interface IDrawableShape {
  draw: (config: Partial<Konva.ShapeConfig>) => void
  stopDrawing: () => void
}

export declare interface IShape {
  insert: (config: Konva.ShapeConfig) => void
}

export declare interface ShapeConfig {
  transformer?: Konva.TransformerConfig
  selectable?: boolean
}

export declare type ListenerCallback = (
  args: EventListenerCallbackEvent
) => void

export declare interface EventListenerCallbackEvent {
  name?: string
  nodes?: (Konva.Shape | Konva.Group)[]
  shapes?: ShapeModel<Konva.Shape | Konva.Group>[]
  data?: UnknownObject
}

export declare type EventListenerNames =
  | '*'
  | 'board:rescale'
  | 'board:change-active-drawing'
  | 'shape:create'
  | 'shape:move'
  | 'shape:delete'
  | 'shape:rotate'
  | 'shape:destroy'
  | 'shape:delete'
  | 'shape:undelete'
  | 'label:update-text'
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
  | 'rotation:straighten'
  | 'rotation:transform'
  | 'crop'

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

export declare type ExportImageConfig = Parameters<Konva.Stage['toDataURL']>[0]

export declare interface JsonData {
  stage: {
    attrs: UnknownObject
    className: string
  }
  layer: {
    attrs: UnknownObject
    className: string
  }
  background: {
    image: {
      attrs: UnknownObject
      className: string
    }
    overlay: {
      attrs: UnknownObject
      className: string
    }
  }
  shapes: {
    attrs: UnknownObject
    filters?: string[]
    children?: Omit<JsonData['shapes'], 'filters'>
    className: string
  }[]
}

export interface TriangleConfig
  extends Omit<Konva.RegularPolygonConfig, 'sides'> {
  sides?: 3
}
