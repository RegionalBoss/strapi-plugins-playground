"use strict";

import schema from "./schema.json";
import lifecycles from "./lifecycles";

export type ItemType = "SYMBOLIC_LINK" | "HARD_LINK" | "URL" | "PAGE" | "LABEL";

export interface IItem {
  id: string;
  name: string;
  absoluteLinkUrl: string;
  absolute_link_url: string;
  childOrder: string;
  pageId: number;
  parentId: number;
  page: unknown;
  parent_item: IItem;
  child_order: number;
  isVisible: boolean;
  is_visible: boolean;
  isProtected: boolean;
  is_protected: boolean;
  isHighlighted: boolean;
  is_highlighted: boolean;
  excludeFromHierarchy: boolean;
  exclude_from_hierarchy: boolean;
  goToClosestChild: boolean;
  go_to_closest_child: boolean;
  visibleFrom: Date;
  visible_from: Date;
  visibleTo: Date;
  visible_to: Date;
  type: ItemType;
}

export default {
  lifecycles,
  schema,
};
