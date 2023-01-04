import React, { useState } from "react";

import { Box } from "@strapi/design-system/Box";
import { Button } from "@strapi/design-system/Button";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";
import { Flex } from "@strapi/design-system/Flex";
import { IconButton } from "@strapi/design-system/IconButton";
import { BaseHeaderLayout, ContentLayout } from "@strapi/design-system/Layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@strapi/design-system/Table";
import { Typography } from "@strapi/design-system/Typography";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import Pencil from "@strapi/icons/Pencil";
import Plus from "@strapi/icons/Plus";
import Trash from "@strapi/icons/Trash";
import { useTranslation } from "../../hooks/useTranslation";

import { settingsRequests } from "../../api/settings";
import { FormModal } from "../../components/FormModal";
import { Illo } from "../../components/Illo";
import { useSettingsData } from "../../hooks/useSettingsData";
import { IDeploySetting } from "../../../../server/content-types/setting";

const COL_COUNT = 4;

export default () => {
  const { settingsData, isLoading, refresh } = useSettingsData();
  const [showFormModal, setShowFormModal] = useState(false);
  const [deployToEdit, setDeployToEdit] = useState<IDeploySetting>();
  const { t } = useTranslation();

  return (
    <>
      {showFormModal && (
        <FormModal
          handleClose={() => {
            refresh();
            setShowFormModal(false);
            setDeployToEdit(undefined);
          }}
          values={deployToEdit}
          isUpdate={typeof deployToEdit !== "undefined"}
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
                            onClick={async () => {
                              await settingsRequests.deleteSetting(entry.id);
                              refresh();
                            }}
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
