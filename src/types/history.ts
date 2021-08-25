import Konva from 'konva'

import { UnknownObject } from './common'

export type HistoryNode = Konva.Stage | Konva.Layer | Konva.Shape | Konva.Group
export type HistoryNodeWithChildren = Konva.Stage | Konva.Layer | Konva.Group
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
