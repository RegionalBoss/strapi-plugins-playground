import { Box, Button, Typography, Flex, Link } from "@strapi/design-system";
import React from "react";
import { useDeploy } from "../hooks/useDeploy";
import format from "date-fns/format";
import { useTranslation } from "../hooks/useTranslation";

export function StageContainer({ deploySetting, refreshTimer }) {
  const [deploys, setDeploys] = React.useState([]);
  const { t } = useTranslation();
  const { getDeploys } = useDeploy();

  const actionDisabled = React.useMemo(
    () => deploys.length > 0 && !deploys[0].isFinal,
    [deploys]
  );

  React.useEffect(async () => {
    setDeploys(
      await getDeploys({
        where: { name: deploySetting.name },
        populate: { "deploy-statuses": true, createdBy: true, updatedBy: true },
      })
    );
  }, [refreshTimer]);

  return (
    <Box padding={4} hasRadius background="neutral0" shadow="tableShadow">
      <Flex style={{ marginBottom: "1rem" }}>
        <Typography
          as="h2"
          style={{ fontWeight: "bold" }}
          title={t("jobs.name.label")}
        >
          {deploySetting.name}
        </Typography>
        <Link
          href={deploySetting.link}
          isExternal
          title={t("jobs.link")}
        ></Link>
      </Flex>
      <Button disabled={actionDisabled} loading={actionDisabled}>
        {t(actionDisabled ? "jobs.state.running" : "jobs.button.start")}
      </Button>
      <ul>
        {deploys?.map((deploy) => (
          <li key={deploy.id}>
            <Typography as="h3" style={{ marginTop: "1rem" }}>
              <span>
                {deploy?.createdBy?.firstname} {deploy?.createdBy?.lastname}
              </span>
              <small>
                {format(new Date(deploy.createdAt), "dd.MM.yyyy HH:mm:ss")}
              </small>
            </Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
}

export default StageContainer;
