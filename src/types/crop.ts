import Konva from 'konva'

import { Dimensions, Point } from './common'
import { ExportOptions } from './export'

export interface CropOptions extends ExportOptions {
  rect: Point & Dimensions
}

export interface BaseCropperOptions {
  x: number
  y: number
  keepRatio: boolean
  fixed: boolean
  marginRatio: number
  minWidth: number
  minHeight: number
  overlay: {
    color: string
    opacity: number
  }
  guides: {
    show: boolean
    count: number
    color: string
    width: number
    dash: number[]
  }
  transformer: Partial<Konva.TransformerConfig>
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
  circle: {
    stroke?: string
    borderDash?: number[]
    borderWidth?: number
  }
}

export declare type CropperOptions =
  | RectangleCropperOptions
  | CircularCropperOptions
