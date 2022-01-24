export type Orientation = 'vertical' | 'horizontal'
export type Snap = 'start' | 'end' | 'center'

export type LineStops = Record<Orientation, number[]>

export interface NodeEdgeBound {
  guide: number
  offset: number
  snap: Snap
  orientation: Orientation
}

export interface GuideLine {
  stop: number
  diff: number
  snap: Snap
  offset: number
  orientation: Orientation
}
