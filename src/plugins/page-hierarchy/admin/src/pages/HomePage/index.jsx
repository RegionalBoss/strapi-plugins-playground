/*
 *
 * HomePage
 *
 */

import { BaseHeaderLayout, ContentLayout } from "@strapi/design-system";
import React from "react";

import { SortableMenu } from "../../components/SortableMenu";
import { useTranslation } from "../../hooks/useTranslation";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <BaseHeaderLayout
        title={t("plugin.name")}
        subtitle={t("description")}
        as="h2"
      />
      <ContentLayout>
        <SortableMenu />
      </ContentLayout>
    </>
  );
};

export default HomePage;
