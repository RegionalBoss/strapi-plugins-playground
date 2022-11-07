import {
  Box,
  Button,
  Card,
  CardBody,
  CardContent,
  Flex,
  Link,
  Typography,
} from "@strapi/design-system";

import styled, { keyframes } from "styled-components";

import {
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import format from "date-fns/format";
import React from "react";
import { useDeploy } from "../hooks/useDeploy";
import { useTranslation } from "../hooks/useTranslation";
import { Spinner } from "./Spinner";

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
    <Box padding={4} hasRadius background="neutral0" shadow="tableShadow">
      <Flex style={{ marginBottom: "1rem" }}>
        <Link href={deploySetting.link} isExternal title={t("jobs.link")}>
          <Typography
            as="h2"
            style={{ fontWeight: "bold" }}
            title={t("jobs.name.label")}
          >
            {deploySetting.name}
          </Typography>
        </Link>
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
    </Box>
  );
}

export default StageContainer;
