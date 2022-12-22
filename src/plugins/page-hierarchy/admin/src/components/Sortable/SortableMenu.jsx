import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { SortableItems } from "./SortableItems";

export const SortableMenu = React.memo(() => (
  <DndProvider backend={HTML5Backend}>
    <SortableItems />
  </DndProvider>
));
