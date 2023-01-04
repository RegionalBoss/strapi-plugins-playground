/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
import { StageContainer } from "../../components/StageContainer";

import {
  BaseHeaderLayout,
  Box,
  ContentLayout,
  GridLayout,
  EmptyStateLayout,
} from "@strapi/design-system";
import intersection from "lodash/intersection";
import { useSettingsData } from "../../hooks/useSettingsData";
import { useUser } from "../../hooks/useUser";
import { Illo } from "../../components/Illo";
import styled from "styled-components";

import { useTranslation } from "../../hooks/useTranslation";

const CustomGridLayout = styled(GridLayout)`
  grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
`;

const HomePage = () => {
  const { settingsData, isLoading } = useSettingsData();
  const { t } = useTranslation();
  const { user } = useUser();
  const [count, setCount] = useState(0);

  // Loop every 2 seconds over API
  useEffect(() => {
    const interval = setInterval(async () => {
      setCount((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <BaseHeaderLayout
        title={t("plugin.name")}
        subtitle={t("header.description")}
        as="h2"
      />
      <ContentLayout>
        {!isLoading && settingsData?.length === 0 && (
          <EmptyStateLayout
            icon={<Illo />}
            content="You don't have any deploys yet..."
          />
        )}
        <Box padding={8} background="neutral100">
          <CustomGridLayout>
            {(settingsData ?? [])
              ?.filter(
                (setting) =>
                  intersection(
                    ((user && user.roles) || []).map((role) => role.id),
                    ((setting && setting.roles) || []).map((role) => role.id)
                  ).length > 0
              )
              .map((entry) => (
                <StageContainer
                  key={entry.id}
                  deploySetting={entry}
                  refetchTimer={count}
                />
              ))}
          </CustomGridLayout>
        </Box>
      </ContentLayout>
    </>
  );
};

export default HomePage;
