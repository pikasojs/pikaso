import Konva from 'konva'

import { ShapeModel } from '../shape/ShapeModel'

import type { UnknownObject } from './common'

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
  | 'shape:selectable'
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

export declare type ListenerCallback = (
  args: EventListenerCallbackEvent
) => void

export declare interface EventListenerCallbackEvent {
  name?: string
  nodes?: (Konva.Shape | Konva.Group)[]
  shapes?: ShapeModel<Konva.Shape | Konva.Group>[]
  data?: UnknownObject
}

export interface IEmitter {
  emit: (eventName: string, data: object) => void
}
