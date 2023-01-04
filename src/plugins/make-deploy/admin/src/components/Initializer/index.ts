/**
 *
 * Initializer
 *
 */

import React, { useEffect, useRef } from "react";
import pluginId from "../../pluginId";

const Initializer: React.FC<{ setPlugin: any }> = ({ setPlugin }) => {
  const ref = useRef(setPlugin);

  useEffect(() => {
    ref.current(pluginId);
  }, []);

  return null;
};

export default Initializer;
