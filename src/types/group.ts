import { ShapeModel } from '../shape/ShapeModel'
import { GroupModel } from '../shape/models/GroupModel'

export interface Group {
  container: GroupModel
  children: ShapeModel[]
}
