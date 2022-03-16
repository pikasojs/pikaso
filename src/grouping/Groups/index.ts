import Konva from 'konva'

import { ShapeModel } from '../../shape/ShapeModel'
import { GroupsManager } from '../GroupsManager'
import type { Group } from '../../types'

export class Groups extends GroupsManager {
  /**
   * Creates a new group
   *
   * @param groupName The group name
   * @param config The group configurations
   * @returns The created [[Group]]
   */
  public create(groupName: string, config: Konva.ContainerConfig = {}): Group {
    return this.createGroup(groupName, config)
  }

  /**
   * Searches for a group by the given name.
   * If nothing is found, it will return undefinedit will return undefined if nothing is found
   *
   * @param groupName The name of the group
   * @returns The found [[Group]]
   */
  public find(groupName: string): Group | undefined {
    return this.findGroup(groupName)
  }

  /**
   * Searches a group by its name
   * If nothing is found, it will create a new group
   *
   * @param groupName The group name
   * @param config The group configurations
   * @returns The created group
   */
  public findOrCreate(
    groupName: string,
    config: Konva.ContainerConfig = {}
  ): Group {
    return this.findOrCreateGroup(groupName, config)
  }

  /**
   * Deletes a group based on the give name
   * Undoing this action is possible
   *
   * @param groupName The group name
   */
  public delete(groupName: string): void {
    this.deleteGroup(groupName)
  }

  /**
   * Restores a group based on the given name
   *
   * @param groupName The group name
   */
  public undelete(groupName: string): void {
    this.undeleteGroup(groupName)
  }

  /**
   * Destory a group.
   * Undoing this action is impossible
   *
   * @param groupName The group name
   */
  public destroy(groupName: string): void {
    this.destroyGroup(groupName)
  }

  /**
   * Splits the shapes of the given group and removes the group
   * Groups that are cached cannot be split
   *
   * @param groupName The group name
   */
  public ungroup(groupName: string): void {
    this.splitGroup(groupName)
  }

  /**
   * Adds a list of the given shapes to the group
   * Whenever a group doesn't exist, it automatically creates one
   *
   * @param shapes The array of [[ShapeModel]]
   * @param groupName The group name
   * @returns The created [[Group]]
   */
  public attach(shapes: ShapeModel[], groupName: string): Group {
    return this.addToGroup(shapes, groupName)
  }

  /**
   * Removes list of the given shapes from the group
   * The group won't be removed if it remains empty
   *
   * @param shapes The array of [[ShapeModel]]
   * @param groupName The group name
   */
  public detach(shapes: ShapeModel[], groupName: string): void {
    this.removeFromGroup(shapes, groupName)
  }
}
