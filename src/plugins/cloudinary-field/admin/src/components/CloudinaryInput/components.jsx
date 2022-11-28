import styled from "styled-components";
import { Button } from "@strapi/design-system";

const renderFileByType = (format, url) => {
  switch (format) {
    case "jpg":
    case "png":
    case "svg":
      return url.length > 0 ? `url(${url})` : "none";
    case "pdf":
    default:
      return "none";
  }
};

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
    content: "${(props) => props.format ? props.format.toString().toUpperCase() : ""}";
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
  display: block;

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
  flex: 0 1 25%;
  min-height: 50px;
  padding: 5px;

  @media (max-width: 768px) {
    flex: 0 1 50%;
    min-height: 30px;
  }
`;
