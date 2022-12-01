import {
  Box,
  Button,
  Card,
  CardBody,
  CardContent,
  Flex,
  Typography,
} from "@strapi/design-system";

import styled, { keyframes } from "styled-components";

import {
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faFlagCheckered,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import format from "date-fns/format";
import React from "react";
import { useDeploy } from "../hooks/useDeploy";
import { useTranslation } from "../hooks/useTranslation";
import { Spinner } from "./Spinner";
import { ErrorBoundary } from "./ErrorBoundary";

const SuccessIcon = styled(FontAwesomeIcon)`
  font-size: 200%;
`;

const StageCardBody = styled(CardBody)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const WaitingForNextRow = styled.span`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const animateSlideUp = keyframes`
  from {
    transform: translateY(1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Link = styled.a`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  position: relative;
  outline: none;
  color: ${({ theme }) => theme.colors.primary600};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primary700};
  }
`;

const AnimatedStatusCard = styled(Card)`
  animation: ${animateSlideUp} 0.5s ease-in-out;
`;

const STAGE_STATUS_ICON = {
  info: (
    <FontAwesomeIcon
      icon={faInfoCircle}
      style={{ color: "#007bff" }}
    ></FontAwesomeIcon>
  ),
  warning: (
    <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: "orange" }} />
  ),
  error: (
    <FontAwesomeIcon icon={faExclamationCircle} style={{ color: "red" }} />
  ),
};

export function StageContainer({ deploySetting, refetchTimer }) {
  const [deploys, setDeploys] = React.useState([]);
  const { t } = useTranslation();
  const { getDeploys, startDeploy } = useDeploy();

  const isRunning = React.useMemo(
    () => deploys.length > 0 && !deploys[0].isFinal,
    [deploys]
  );

  React.useEffect(async () => {
    loadData();
  }, [refetchTimer]);

  const loadData = async () =>
    setDeploys(await getDeploys({ name: deploySetting.name }));

  return (
    <Box
      padding={4}
      hasRadius
      background="neutral0"
      shadow="tableShadow"
      style={{ maxWidth: "35rem" }}
    >
      <Flex style={{ marginBottom: "1rem" }}>
        <ErrorBoundary>
          <Link
            href={deploySetting?.link ?? ""}
            // isExternal
            title={t("jobs.link")}
            target="_blank"
          >
            <Typography
              as="span"
              style={{ fontWeight: "bold", marginRight: "0.5rem" }}
              title={t("jobs.name.label")}
            >
              {deploySetting?.name ?? ""}
            </Typography>
            <FontAwesomeIcon icon={faLink} />
          </Link>
        </ErrorBoundary>
      </Flex>
      <Button
        disabled={isRunning}
        loading={isRunning}
        onClick={async () =>
          setDeploys([await startDeploy(deploySetting.name)])
        }
      >
        {t(isRunning ? "jobs.state.running" : "jobs.button.start")}
      </Button>
      <ErrorBoundary>
        <ul>
          {deploys?.map((deploy) => (
            <li key={deploy.id}>
              <Typography as="h3" style={{ margin: "1rem 0" }}>
                <span>
                  {deploy?.createdBy?.firstname} {deploy?.createdBy?.lastname}
                </span>
                <small>
                  {deploy.createdAt
                    ? format(new Date(deploy.createdAt), "dd.MM.yyyy HH:mm:ss")
                    : ""}
                </small>
              </Typography>
              {deploy.deployStatuses?.map((deployStatus) => (
                <AnimatedStatusCard
                  id={`${deployStatus.id}`}
                  key={deployStatus.id}
                  style={{ marginBottom: "0.5rem" }}
                >
                  <StageCardBody>
                    <Box style={{ marginRight: "0.5rem" }}>
                      <Typography as="strong" style={{ fontWeight: "bold" }}>
                        {deployStatus.stage}
                      </Typography>
                      <Typography as="div">
                        {deployStatus.createdAt
                          ? format(new Date(deployStatus.createdAt), "HH:mm:ss")
                          : ""}
                      </Typography>
                    </Box>
                    <CardContent style={{ marginRight: "0.5rem" }}>
                      <Typography as="p">{deployStatus.message}</Typography>
                    </CardContent>
                    <Box>
                      {STAGE_STATUS_ICON[deployStatus.status] ??
                        STAGE_STATUS_ICON.info}
                    </Box>
                  </StageCardBody>
                </AnimatedStatusCard>
              ))}
              {deploy.isFinal ? (
                <WaitingForNextRow>
                  <SuccessIcon
                    icon={faFlagCheckered}
                    title="Build finished"
                    style={{ color: "#007bff" }}
                  />
                </WaitingForNextRow>
              ) : (
                <WaitingForNextRow>
                  <Spinner />
                </WaitingForNextRow>
              )}
            </li>
          ))}
        </ul>
      </ErrorBoundary>
    </Box>
  );
}

export default StageContainer;
