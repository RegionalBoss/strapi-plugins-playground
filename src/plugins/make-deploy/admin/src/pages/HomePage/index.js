/*
 *
 * HomePage
 *
 */

import React from "react";
import pluginId from "../../pluginId";

import { BaseHeaderLayout, ContentLayout } from "@strapi/design-system/Layout";
import { useIntl } from "react-intl";
import getTrad from "../../utils/getTrad";

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <BaseHeaderLayout
        title={formatMessage({
          id: getTrad("plugin.name"),
          defaultMessage: "Todo Plugin",
        })}
      ></BaseHeaderLayout>
      <ContentLayout>
        <div>
          <h1>{pluginId}&apos;s HomePage</h1>
          <p>Happy coding</p>
        </div>
      </ContentLayout>
    </>
  );
};

export default HomePage;
