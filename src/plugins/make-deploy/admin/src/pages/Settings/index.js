import React, { useState } from "react";

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
import { useTranslation } from "../../hooks/useTranslation";

import { useSettingsData } from "../../api/settings";
import { Illo } from "../../components/Illo";
import { FormModal } from "../../components/FormModal";

const COL_COUNT = 4;

export default () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [deployToEdit, setDeployToEdit] = useState();
  const { t } = useTranslation();
  const { settingsData, isLoading } = useSettingsData();

  return (
    <>
      {showFormModal && (
        <FormModal
          handleClose={() => {
            setShowFormModal(false);
            setDeployToEdit(undefined);
          }}
          values={deployToEdit}
        ></FormModal>
      )}
      <BaseHeaderLayout
        id="title"
        title={t("settings.header.label", "Deploy plugin settings")}
        subtitle={t("settings.sub-header.label", "Manage your deploy settings")}
        as="h2"
        primaryAction={
          <Button startIcon={<Plus />} onClick={() => setShowFormModal(true)}>
            {t("settings.addEnv", "Deploy plugin settings")}
          </Button>
        }
      ></BaseHeaderLayout>
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <ContentLayout>
          {settingsData?.length === 0 && (
            <EmptyStateLayout
              icon={<Illo />}
              content="You don't have any deploys yet..."
            />
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
                      <Flex style={{ justifyContent: "flex-end" }}>
                        <IconButton
                          onClick={() => {
                            setShowFormModal(true);
                            setDeployToEdit(entry);
                          }}
                          label="Upravit"
                          noBorder
                          icon={<Pencil />}
                        />
                        <Box paddingLeft={4}>
                          <IconButton
                            onClick={() => console.log("delete")}
                            label="Smazat"
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
