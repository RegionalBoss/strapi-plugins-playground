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
} from "@strapi/design-system";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";
import { useSettingsData } from "../../hooks/useSettingsData";
import { useUser } from "../../hooks/useUser";
import { Illo } from "../../components/Illo";

import { useTranslation } from "../../hooks/useTranslation";

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
          <GridLayout>
            {settingsData.map((entry) => (
              <StageContainer
                key={entry.id}
                deploySetting={entry}
                refetchTimer={count}
              />
            ))}
          </GridLayout>
        </Box>
      </ContentLayout>
    </>
  );
};

export default HomePage;
