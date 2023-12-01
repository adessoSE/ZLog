import React from 'react';

import '../SCSS/Utils.scss';

function Divider(params) {
  const margin = params.margin ? params.margin : 4;
  return <div className="utils-divider" style={{ marginTop: margin, marginBottom: margin }}></div>;
}

const Utils = {
  Divider: Divider,
};

export default Utils;
