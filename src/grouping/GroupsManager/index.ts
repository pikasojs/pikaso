import Konva from 'konva'

import { Board } from '../../Board'
import { ShapeModel } from '../../shape/ShapeModel'
import { GroupModel } from '../../shape/models/GroupModel'
import { NODE_GROUP_ATTRIBUTE } from '../../constants'
import type { Group } from '../../types'

/**
 * Shapes can be arranged into multiple groups using the Groups Manager
 * The class provides a variety of APIs for working with groups
 */
export abstract class GroupsManager {
  /**
   * Represents the [[Board]]
   */
  private board: Board

  /**
   * Represents list of the created gropus
   */
  private groups: Group[] = []

  /**
   * Creates the GroupsManaer
   * @param board The [[Board]]
   */
  constructor(board: Board) {
    this.board = board
  }

  /**
   * Returns list of the created gropus
   */
  public get list() {
    return this.groups
  }

  /**
   * Looks up a group by the given name
   *
   * @param groupName The name of the group
   * @returns The found [[Group]]
   */
  protected findGroup(groupName: string): Group | undefined {
    return this.groups.find(
      ({ container }) => container.name === groupName && container.isActive
    )
  }

  /**
   * Creates a new group
   *
   * @param groupName The group name
   * @param config The group configurations
   * @param history Indicates whether to create a history for this action
   * @returns The created [[Group]]
   */
  protected createGroup(
    groupName: string,
    config: Konva.ContainerConfig = {},
    history = true
  ): Group {
    const group = {
      container: new GroupModel(
        this.board,
        new Konva.Group({
          name: groupName,
          draggable: this.isDraggable(),
          ...config
        }),
        {
          history
        }
      ),
      children: []
    }

    this.groups = [...this.groups, group]

    if (history) {
      this.board.history.create(this.board.layer, [], {
        undo: () => this.destroyGroup(groupName),
        redo: () => this.createGroup(groupName, config, false)
      })
    }

    this.board.events.emit('group:create', {
      data: {
        groupName: groupName
      }
    })

    return group
  }

  /**
   * Looks up a group by its name and creates a new one if it doesn't exist
   *
   * @param groupName The group name
   * @param config The group configurations
   * @param history Indicates whether to create a history for this action
   * @returns The created group
   */
  protected findOrCreateGroup(
    groupName: string,
    config: Konva.ContainerConfig = {},
    history = true
  ): Group {
    const group = this.findGroup(groupName)

    return group ?? this.createGroup(groupName, config, history)
  }

  /**
   * Deletes a group
   *
   * @param groupName The group name
   * @param history Indicates whether to create a history for this action
   */
  protected deleteGroup(groupName: string, history = true): void {
    const group = this.findGroup(groupName)

    if (!group) {
      return
    }

    group.container.delete()
    group.children.forEach(shape => shape.delete())

    if (history) {
      this.board.history.create(this.board.layer, [], {
        undo: () => this.undeleteGroup(groupName, false),
        redo: () => this.deleteGroup(groupName, false)
      })
    }

    this.board.events.emit('group:delete', {
      data: {
        groupName: groupName
      }
    })
  }

  /**
   * Restores a group
   *
   * @param groupName The group name
   * @param history Indicates whether to create a history for this action
   */
  protected undeleteGroup(groupName: string, history = true): void {
    const group = this.groups.find(
      ({ container }) => container.name === groupName
    )

    if (!group) {
      return
    }

    group.container.undelete()
    group.children.forEach(shape => shape.undelete())

    if (history) {
      this.board.history.create(this.board.layer, [], {
        undo: () => this.deleteGroup(groupName, false),
        redo: () => this.undeleteGroup(groupName, false)
      })
    }

    this.board.events.emit('group:undelete', {
      data: {
        groupName: groupName
      }
    })
  }

  /**
   * Destory a group. Undoing this action is not possible
   *
   * @param groupName The group name
   */
  protected destroyGroup(groupName: string): void {
    const group = this.findGroup(groupName)

    if (!group) {
      return
    }

    group.container.destroy()
    group.children.forEach(shape => shape.destroy())

    this.groups = this.groups.filter(
      ({ container }) => group.container.name !== container.name
    )

    this.board.events.emit('group:destroy', {
      data: {
        groupName: groupName
      }
    })
  }

  /**
   * Splits the shapes of the given group
   *
   * @param groupName The group name
   * @param history Indicates whether to create a history for this action
   */
  protected splitGroup(groupName: string, history = true): void {
    const group = this.findGroup(groupName)

    if (!group || group.container.node.isCached()) {
      return
    }

    this.removeFromGroup(group.children, groupName, false)
    group.container.delete()

    this.groups = this.groups.filter(
      ({ container }) => group.container.name !== container.name
    )

    if (history) {
      this.board.history.create(this.board.layer, [], {
        undo: () => this.addToGroup(group.children, groupName, false),
        redo: () => this.splitGroup(groupName, false)
      })
    }

    this.board.events.emit('group:ungroup', {
      data: {
        groupName: groupName
      }
    })
  }

  /**
   * Adds a list of the given shapes to the group
   *
   * @param shapes The array of [[ShapeModel]]
   * @param groupName The group name
   * @param history Indicates whether to create a history for this action
   * @returns The created [[Group]]
   */
  protected addToGroup(
    shapes: ShapeModel[],
    groupName: string,
    history = true
  ): Group {
    const group = this.findOrCreateGroup(groupName, {}, history)

    shapes.forEach(shape => {
      if (group.children.includes(shape)) {
        return
      }

      this.groups = this.groups.map(({ container, children }) =>
        container.name === groupName
          ? {
              container,
              children: [...children, shape]
            }
          : {
              container,
              children
            }
      )

      const groupNode = group.container.node as Konva.Group
      groupNode.add(shape.node)

      shape.node.draggable(false)
      ;(shape.node as Konva.Node).setAttr(NODE_GROUP_ATTRIBUTE, groupName)
    })

    if (history) {
      this.board.history.create(this.board.layer, [], {
        undo: () => {
          this.removeFromGroup(shapes, groupName, false)
          this.deleteEmpty(groupName, false)
        },
        redo: () => this.addToGroup(shapes, groupName, false)
      })
    }

    this.board.events.emit('group:attach', {
      shapes,
      data: {
        groupName
      }
    })

    return group
  }

  /**
   * Removes a list of the given shapes from the group
   *
   * @param shapes The array of [[ShapeModel]]
   * @param groupName The group name
   * @param history Indicates whether to create a history for this action
   */
  protected removeFromGroup(
    shapes: ShapeModel[],
    groupName: string,
    history = true
  ): void {
    const group = this.findGroup(groupName)

    if (!group) {
      return
    }

    shapes.forEach(shape => {
      if (group.children.includes(shape) === false) {
        return
      }

      this.groups = this.groups.map(({ container, children }) =>
        container.name === groupName
          ? {
              container,
              children: children.filter(item => shape.node !== item.node)
            }
          : {
              container,
              children
            }
      )

      const abs = shape.node.getAbsolutePosition()
      const scale = shape.node.getAbsoluteScale()
      const rotation = shape.node.getAbsoluteRotation()

      shape.node.moveTo(group.container.node.parent)
      shape.node.x(abs.x)
      shape.node.y(abs.y)
      shape.node.scale({
        x: scale.x,
        y: scale.y
      })
      shape.node.rotation(rotation)
      shape.node.draggable(this.isDraggable())

      const groupNode = group.container.node as Konva.Group
      groupNode.children = groupNode.children?.filter(
        node => node !== shape.node
      )
      ;(shape.node as Konva.Node).setAttr(NODE_GROUP_ATTRIBUTE, null)
    })

    if (history) {
      this.board.history.create(this.board.layer, [], {
        undo: () => this.addToGroup(shapes, groupName, false),
        redo: () => {
          this.removeFromGroup(shapes, groupName, false)
          this.deleteEmpty(groupName, false)
        }
      })
    }

    this.board.events.emit('group:detach', {
      shapes,
      data: {
        groupName
      }
    })
  }

  /**
   * Checks whether the group can be dragged
   *
   * @Returns a boolean value indicating whether a group can be dragged
   */
  private isDraggable(): boolean {
    return this.board.settings.selection?.interactive ?? true
  }

  /**
   * Deletes a group if it's empty
   *
   * @param groupName The group name
   * @param history Indicates whether to create a history for this action
   */
  private deleteEmpty(groupName: string, history = true): void {
    if (this.findGroup(groupName)?.children?.length === 0) {
      this.deleteGroup(groupName, history)
    }
  }
}
