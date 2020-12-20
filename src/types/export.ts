import Konva from 'konva'

import { UnknownObject } from './common'

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

export declare type ExportImageConfig = Parameters<Konva.Stage['toDataURL']>[0]
