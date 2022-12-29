import React from "react";
import { Tree } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { EditViewContext } from "../../lib/contexts/EditViewContext";
import styled from "styled-components";
import { TreeItem } from "./TreeItem";
import { useTheme } from "@strapi/design-system";

const StyledTree = styled(Tree)`
  .ant-tree-treenode-draggable {
    align-items: center;
  }
  .ant-tree-treenode-draggable.dragging::after {
    content: none;
  }
  .ant-tree-node-selected {
    background: none !important;
  }
  .ant-tree-draggable-icon {
    opacity: 0.6 !important;
    &:hover {
      cursor: grab;
    }
  }
`;

export const SortableMenu = () => {
  const { items, setItems, isEditMode } = React.useContext(EditViewContext);
  const { colors } = useTheme();

  const onDrop = (info) =>
    setItems((prevData) => {
      const dropKey = info.node.id;
      const dragKey = info.dragNode.id;
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const loop = (data, id, callback) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === id) {
            return callback(data[i], i, data);
          }
          if (data[i].children) {
            loop(data[i].children, id, callback);
          }
        }
      };
      const data = [...prevData];

      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj);
        });
      } else if (
        (info.node.props.data.children || []).length > 0 &&
        info.node.props.expanded &&
        dropPosition === 1
      ) {
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          item.children.unshift(dragObj);
        });
      } else {
        let ar = [];
        let i;
        loop(data, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      return data;
    });

  return (
    <StyledTree
      className="draggable-tree"
      draggable={isEditMode}
      blockNode
      selectable={false}
      autoExpandParent
      switcherIcon={
        <span
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            padding: "0 0.5rem",
          }}
        >
          <DownOutlined />
        </span>
      }
      rootStyle={{
        backgroundColor: colors.neutral100,
        color: colors.neutral1000,
      }}
      onDrop={onDrop}
      fieldNames={{
        title: "name",
        key: "id",
      }}
      treeData={items}
      titleRender={(nodeData) => <TreeItem value={nodeData} />}
      defaultExpandAll
    />
  );
};
