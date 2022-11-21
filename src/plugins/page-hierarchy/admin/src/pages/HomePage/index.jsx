/*
 *
 * HomePage
 *
 */

import React from "react";
import { createPortal } from "react-dom";
import { BaseHeaderLayout, ContentLayout } from "@strapi/design-system";
import { EditViewContext } from "../../lib/EditViewContext";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableMenuItem } from "../../components/SortableMenuItem";
import {
  flattenTree,
  removeChildrenOf,
  getProjection,
  getChildCount,
  buildTree,
} from "../../utils";

import { useTranslation } from "../../hooks/useTranslation";

const dropAnimationConfig = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform?.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform?.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: "ease-out",
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

const indentationWidth = 50;

const HomePage = () => {
  const { items, setItems } = React.useContext(EditViewContext);
  const [activeId, setActiveId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);
  const [offsetLeft, setOffsetLeft] = React.useState(0);

  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    console.log("ITEMS: ", { items });
  }, [items]);

  // const sortlyItems = React.useMemo(
  //   () =>
  //     items.map((item) => {
  //       const i = {
  //         ...item,
  //         index: item.childOrder,
  //       };
  //       delete i.childOrder;
  //       return i;
  //     }),
  //   [items]
  // );

  const flattenedItems = React.useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth
        )
      : null;

  const sortedIds = React.useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );

  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  return (
    <>
      <BaseHeaderLayout
        title={t("plugin.name")}
        subtitle={t("description")}
        as="h2"
      />
      <ContentLayout>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={sortedIds}
            strategy={verticalListSortingStrategy}
          >
            {flattenedItems.map(({ id, depth }) => (
              <SortableMenuItem
                key={id}
                id={id}
                value={id}
                depth={id === activeId && projected ? projected.depth : depth}
                indentationWidth={indentationWidth}
                onRemove={() => handleRemove(id)}
              />
            ))}
            {/* <SortableMenu items={flattenedItems} /> */}
            {createPortal(
              <DragOverlay dropAnimation={dropAnimationConfig}>
                {activeId && activeItem ? (
                  <SortableMenuItem
                    id={activeId}
                    depth={activeItem.depth}
                    clone
                    childCount={getChildCount(items, activeId) + 1}
                    value={activeId.toString()}
                    indentationWidth={indentationWidth}
                  />
                ) : null}
              </DragOverlay>,
              document.body
            )}
          </SortableContext>
        </DndContext>
      </ContentLayout>
    </>
  );

  function handleCollapse(id) {
    setItems((items) =>
      setProperty(items, id, "collapsed", (value) => {
        return !value;
      })
    );
  }

  function handleRemove(id) {
    console.log("REMOVE", id);
  }

  function handleDragStart({ active: { id: activeId } }) {
    console.log("handleDragStart", activeId);
    setActiveId(activeId);
    setOverId(activeId);

    document.body.style.setProperty("cursor", "grabbing");
  }

  function handleDragMove({ delta }) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }) {
    console.log("handleDragOver", handleDragOver);
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }) {
    console.log("handleDragEnd", event);

    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems = JSON.parse(JSON.stringify(flattenTree(items)));
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setItems(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);

    document.body.style.setProperty("cursor", "");
  }
};

export default HomePage;
