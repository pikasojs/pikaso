import Konva from 'konva'

export enum DrawType {
  Svg = 'Svg',
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

export declare interface IDrawableShape {
  draw: (config: Partial<Konva.ShapeConfig>) => void
  stopDrawing: () => void
}

export interface TriangleConfig
  extends Omit<Konva.RegularPolygonConfig, 'sides'> {
  sides?: 3
}
