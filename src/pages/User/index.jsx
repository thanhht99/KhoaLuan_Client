import React from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import { NotFound } from "../../_components/NotFound";

import { Info } from "./Info";

const User = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}/info`} component={Info} />
      <Redirect
        exact
        refresh={true}
        from={`${path}/info/reload`}
        to={`${path}/info`}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export { User };
