import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sortly, {
  ContextProvider,
  convert,
  flatten,
} from "@regionalboss/react-sortly";
import styled from "styled-components";
import { EditViewContext } from "../../lib/contexts/EditViewContext";
import { TreeItem } from "./TreeItem";

export const SortableMenu = () => {
  const { items, setItems } = React.useContext(EditViewContext);

  return (
    <Wrapper>
      <DndProvider backend={HTML5Backend}>
        <ContextProvider>
          <SortableMenuWrapper items={items} onChange={setItems} />
        </ContextProvider>
      </DndProvider>
    </Wrapper>
  );
};

const SortableMenuWrapper = React.memo(({ items, onChange }) => {
  const _onChange = (modifiedData) => {
    const transformedData = flatten(modifiedData).map((item) => {
      const i = {
        ...item,
        childOrder: item.index,
      };
      delete i.index;
      return i;
    });
    onChange(transformedData);
  };

  const sortlyItems = items.map((item) => {
    const i = {
      ...item,
      index: item.childOrder,
    };
    delete i.childOrder;
    return i;
  });

  return (
    <SortlyWrapper>
      <Sortly items={convert(sortlyItems)} onChange={_onChange}>
        {(props) => <TreeItem {...props.data} key={props.id} />}
      </Sortly>
    </SortlyWrapper>
  );
});

const SortlyWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  flex: 0 1 700px;
  margin-top: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
