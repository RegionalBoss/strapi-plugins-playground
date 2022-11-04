import React from "react";

import { Box } from "@strapi/design-system/Box";
import { Stack } from "@strapi/design-system/Stack";
import { Button } from "@strapi/design-system/Button";
import { Flex } from "@strapi/design-system/Flex";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { ContentLayout } from "@strapi/design-system/Layout";
import { IconButton } from "@strapi/design-system/IconButton";
import { Typography } from "@strapi/design-system/Typography";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { Table, Thead, Tr, Th, Td, Tbody } from "@strapi/design-system/Table";
import Plus from "@strapi/icons/Plus";
import Pencil from "@strapi/icons/Pencil";
import Trash from "@strapi/icons/Trash";
import pluginId from "../../pluginId";

import { useIntl } from "react-intl";
import getTrad from "../../utils/getTrad";
import { useSettingsData } from "../../api/settings";

const COL_COUNT = 4;

export default () => {
  const { formatMessage } = useIntl();
  const { settingsData, isLoading } = useSettingsData();

  return (
    <>
      <BaseHeaderLayout
        id="title"
        title={formatMessage({
          id: getTrad("settings.header.label"),
          defaultMessage: "Deploy plugin settings",
        })}
        subtitle={formatMessage({
          id: getTrad("settings.sub-header.label"),
          defaultMessage: "Manage your deploy settings",
        })}
        as="h2"
        primaryAction={
          <Button startIcon={<Plus />}>
            {formatMessage({
              id: getTrad("settings.addEnv"),
              defaultMessage: "Deploy plugin settings",
            })}
          </Button>
        }
      ></BaseHeaderLayout>
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <ContentLayout>
          {settingsData?.length === 0 && (
            <EmptyStateLayout content="You don't have any deploys yet..." />
          )}
          {settingsData?.length > 0 && (
            <Table colCount={COL_COUNT} rowCount={settingsData?.length}>
              <Thead>
                <Tr>
                  <Th>
                    <Typography variant="sigma">Nazev</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">URL nasazeni</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">URL odkazu</Typography>
                  </Th>
                  <Th>
                    <VisuallyHidden>Actions</VisuallyHidden>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {settingsData.map((entry, index) => (
                  <Tr key={index}>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.name}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.deploy}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.link}
                      </Typography>
                    </Td>
                    <Td>
                      <Flex>
                        <IconButton
                          onClick={() => console.log("edit")}
                          label="Edit"
                          noBorder
                          icon={<Pencil />}
                        />
                        <Box paddingLeft={1}>
                          <IconButton
                            onClick={() => console.log("delete")}
                            label="Delete"
                            noBorder
                            icon={<Trash />}
                          />
                        </Box>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </ContentLayout>
      )}
    </>
  );
};
