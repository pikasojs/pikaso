import Konva from 'konva'

import { Nullable, UnknownObject } from '.'

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
    attrs: Record<string, any>
    filters?: string[]
    children?: Omit<JsonData['shapes'], 'filters'>
    className: string
    group: Nullable<string>
  }[]
}

export declare type ExportImageConfig = Parameters<Konva.Stage['toDataURL']>[0]
