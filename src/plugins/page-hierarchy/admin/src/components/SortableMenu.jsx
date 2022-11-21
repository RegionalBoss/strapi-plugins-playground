import React from "react";
import { useHistory, Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { SortableMenuItem } from "./SortableMenuItem";

const SortlyWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  flex: 0 1 700px;
  margin-top: 10px;
  overflow-x: hidden;
`;

export const SortableMenu = React.memo(({ items }) => {
  return (
    <SortlyWrapper>
      {items.map((item) => (
        <SortableMenuItem {...item} key={item.id} />
      ))}
    </SortlyWrapper>
  );
});
