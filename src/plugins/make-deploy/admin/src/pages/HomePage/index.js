/*
 *
 * HomePage
 *
 */

import React, { useEffect } from "react";
import pluginId from "../../pluginId";

import axiosInstance from "../../utils/axiosInstance";

import {
  BaseHeaderLayout,
  ContentLayout,
  Grid,
  GridItem,
  GridLayout,
  Box,
  Button,
} from "@strapi/design-system";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";
import { useSettingsData } from "../../api/settings";
import { Illo } from "../../components/Illo";
import { Flex } from "@strapi/design-system/Flex";
import { IconButton } from "@strapi/design-system/IconButton";
import { Typography } from "@strapi/design-system/Typography";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";

import { useTranslation } from "../../hooks/useTranslation";

const HomePage = () => {
  const { settingsData, isLoading } = useSettingsData();
  const { t } = useTranslation();

  useEffect(async () => {
    const res = await axiosInstance.get("/admin/users/me");
    console.log("me: ", res);
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
              <Box
                padding={4}
                hasRadius
                background="neutral0"
                key={entry.id}
                shadow="tableShadow"
              >
                <Box style={{ marginBottom: "1rem" }}>
                  <Typography>{entry.name}</Typography>
                </Box>
                <Button>Spustit</Button>
              </Box>
            ))}
          </GridLayout>
        </Box>
      </ContentLayout>
    </>
  );
};

export default HomePage;
