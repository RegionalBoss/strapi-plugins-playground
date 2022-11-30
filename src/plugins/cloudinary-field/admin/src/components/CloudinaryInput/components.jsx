import styled from "styled-components";
import { Button, Typography, Card } from "@strapi/design-system";
import { CSS } from "@dnd-kit/utilities";

export const PREVIEW_FORMATS = ["jpg", "png", "svg"];

const renderFileByType = (format, url) => {
  if (PREVIEW_FORMATS.includes(format))
    return url.length > 0 ? `url(${url})` : "none";
  return "none";
};

export const FieldLabel = styled(Typography)`
  font-size: 1rem;
  font-weight: 500;
`;

export const FieldDescription = styled(Typography)`
  color: ${({ theme }) => theme.colors.neutral600};
`;

export const File = styled.div`
  display: block;
  position: relative;
  min-height: 100px;

  &::before {
    content: "";
    background-image: ${(props) => renderFileByType(props.format, props.url)};
    background-size: contain;
    background-position: center;
    position: absolute;
    width: 100%;
    height: 100%;
    /* background-color: #0000006b; */
    left: 0;
    top: 0;
  }

  &::after {
    content: ${(props) =>
      props.format ? props.format.toString().toUpperCase() : ""};
    font-size: 28px;
    position: absolute;
    left: 50%;
    top: 50%;
    color: #ffffff;
    -webkit-text-stroke: 1px #000;
    transform: translate(-50%, -50%);
    text-decoration: none;
  }
`;

export const FileLink = styled.a`
  position: relative;
  width: 100%;

  &:hover {
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: #0000006b;
      left: 0;
      top: 0;
    }

    &::after {
      content: "\\1F50D";
      font-size: 150%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-decoration: none;
    }
  }
`;

export const Wrapper = styled.div`
  position: relative;
  margin-top: 14px;
  line-height: 18px;

  > div {
    border-radius: 3px;

    > div:last-of-type {
      min-height: 315px;
      max-height: 635px;
      font-weight: 500;
      font-size: 1.3rem !important;
    }
  }

  .colored {
    background-color: yellow;
    color: black !important;
  }
`;

export const ActionButton = styled(Button)`
  margin-right: 5px;
  margin-top: 5px;
`;

export const FileWrapper = styled.div`
  width: 20rem;
  margin-right: 0.5rem;
  margin-bottom: 1rem;
  opacity: ${({ ghost }) => (ghost ? 0.2 : 1)};
  box-shadow: ${({ clone, theme }) =>
    clone ? theme.shadows.filterShadow : "none"};
`;
