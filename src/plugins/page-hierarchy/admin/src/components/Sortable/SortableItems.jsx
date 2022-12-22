import React from "react";

import { EditViewContext } from "../../lib/contexts/EditViewContext";
import { buildTree, flattenTree } from "../../utils/sortableTree";

import { SortableMenuItem } from "./SortableMenuItem";

const indentationWidth = 50;

export function arrayMove(array, from, to) {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );

  return newArray;
}

export const SortableItems = () => {
  const { items, setItems, isEditMode } = React.useContext(EditViewContext);

  const flattenedItems = React.useMemo(() => {
    const flattenedTree = flattenTree(items);

    return flattenedTree;
  }, [items]);

  const handleChange = (newItems) => {
    console.log("handle  change");
    setItems(buildTree(newItems));
  };

  console.log("flattenedItems", flattenedItems);

  return (
    <div>
      {flattenedItems.map((props, index) => {
        // const { id, depth } = props;
        console.log("props", props);
        return (
          <SortableMenuItem
            key={props.id}
            {...props}
            index={index}
            moveCard={(dragIndex, hoverIndex) => {
              console.log("move card", dragIndex, hoverIndex, flattenedItems);
              setItems(
                buildTree(arrayMove(flattenedItems, dragIndex, hoverIndex))
              );
            }}
          />
        );
      })}
    </div>
  );
};
