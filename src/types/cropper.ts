import Konva from 'konva'

import { Dimensions, Point } from './common'
import { ExportImageConfig } from './export'

interface BaseCropOptions {
  rect: Point & Dimensions
}
export type CropOptions = BaseCropOptions & ExportImageConfig

export interface BaseCropperOptions {
  x: number
  y: number
  keepRatio: boolean
  fixed: boolean
  marginRatio: number
  minWidth: number
  minHeight: number
  overlay: Partial<{
    color: string
    opacity: number
  }>
  guides: Partial<{
    show: boolean
    count: number
    color: string
    width: number
    dash: number[]
  }>
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
    borderStroke?: string
    borderDash?: number[]
    borderStrokeWidth?: number
  }
}

export declare type CropperOptions =
  | RectangleCropperOptions
  | CircularCropperOptions
