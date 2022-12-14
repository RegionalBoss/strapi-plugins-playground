/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import { NotFound } from "@strapi/helper-plugin";
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ConfirmDialogProvider } from "../../contexts/ConfirmDialogContext";
import pluginId from "../../pluginId";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { axiosInstance } from "../../utils/axiosInstance";
import HomePage from "../HomePage";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [newsletterUrl, setNewsletterUrl] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/${pluginId}/getAcousticNewsletterConfig`
        );
        setNewsletterUrl(data.url);
      } catch (err) {
        console.error(err);
        setIsError(true);
      }

      setLoading(false);
    };
    fetchConfig();
  }, []);

  if (loading) {
    return <LoadingIndicatorPage />;
  }
  if (isError) {
    return <div>There is an error while loading plugin configuration</div>;
  }

  return (
    <div>
      <ConfirmDialogProvider>
        <Switch>
          <Route
            path={`/plugins/${pluginId}`}
            render={() => <HomePage newsletterUrl={newsletterUrl} />}
            exact
          />
          <Route component={NotFound} />
        </Switch>
      </ConfirmDialogProvider>
    </div>
  );
};

export default App;
