// Calculates depth of a dragged item
const getDragDepth = (offset, indentationWidth) =>
  Math.round(offset / indentationWidth);

// Calculates the max depth of a dragged item
const getMaxDepth = ({ previousItem }) =>
  previousItem ? previousItem.depth + 1 : 0;

// Calculates the min depth of a dragged item
const getMinDepth = ({ nextItem }) => (nextItem ? nextItem.depth : 0);

// Returns flat list of items without nesting children
const flatten = (items = [], parentId = null, depth = 0) =>
  items.reduce(
    (acc, item, index) => [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten(item.children, item.id, depth + 1),
    ],
    []
  );

// Returns flat list of items
export const flattenTree = (items) => flatten(items);

export function removeChildrenOf(items, ids) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}

export function setProperty(items, id, property, setter) {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property]);
      continue;
    }

    if (item.children.length) {
      item.children = setProperty(item.children, id, property, setter);
    }
  }

  return [...items];
}

export function findItemDeep(items = [], itemId) {
  for (const item of items) {
    const { id, children = [] } = item;

    if (id === itemId) {
      return item;
    }

    if (children.length) {
      const child = findItemDeep(children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}

export function buildTree(flattenedItems) {
  const root = { id: 0, children: [] };
  const nodes = { [root.id]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children = [] } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children };
    parent.children.push(item);
  }

  return root.children;
}

export const findItem = (items, itemId) =>
  items.find(({ id }) => id === itemId);

function countChildren(items = [], count = 0) {
  return items.reduce((acc, { children = [] }) => {
    if (children.length) {
      return countChildren(children, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount(items = [], id) {
  const item = findItemDeep(items, id);

  return item ? countChildren(item.children) : 0;
}
