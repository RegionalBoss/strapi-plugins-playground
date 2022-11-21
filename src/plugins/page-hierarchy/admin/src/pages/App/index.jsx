/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Switch, Route } from "react-router-dom";
import { NotFound } from "@strapi/helper-plugin";
import pluginId from "../../pluginId";
import HomePage from "../HomePage";
import { EditViewContextProvider } from "../../lib/contexts/EditViewContext";
import { ConfirmDialogProvider } from "../../lib/contexts/ConfirmDialogContext";

const App = () => {
  return (
    <div>
      <ConfirmDialogProvider>
        <EditViewContextProvider>
          <Switch>
            <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
            <Route component={NotFound} />
          </Switch>
        </EditViewContextProvider>
      </ConfirmDialogProvider>
    </div>
  );
};

export default App;
