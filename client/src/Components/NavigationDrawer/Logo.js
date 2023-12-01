import React, { useState } from 'react';
import Constants from '../../utils/Constants';

const Image = ({ src, alt, defaultImg, height }) => {
  const [error, setError] = useState(false);

  const onError = () => {
    setError(true);
  };

  return (error ? defaultImg : <img src={src} height={height} alt={alt} onError={onError} />);
};

export default function Logo(props) {
  const { zColor = 'white', logColor = 'gray', zBackgroundColor = Constants.primaryColor, custom, height } = props;
  
  return (
      <Image
        height={height}
        src={custom}
        alt=""
        defaultImg={<svg
          version="1.1"
          id="Ebene_1"
          x="0px"
          y="0px"
          width="75.812px"
          height="26.333px"
          viewBox="0 0 75.812 26.333"
          enableBackground="new 0 0 75.812 26.333"
          xmlSpace="preserve"
        >
          <rect fill={zBackgroundColor} width="20.833" height="26.333" />
          <path
            fill={zColor}
            d="M17.526,3.156v2.018L7.673,20.181h7.006l0.332-2.432h3.068l-0.304,5.528H2.753v-2.101l9.812-14.911H6.167
      L5.849,8.697H2.768l0.304-5.542H17.526z"
          />
          <path
            fill={logColor}
            d="M22.883,23.277v-2.418l2.142-0.415V6.002l-2.142-0.415V3.156h2.142h4.035h2.156v2.432L29.06,6.002v14.179h5.68l0.193-2.529
      h3.082v5.625H22.883z"
          />
          <path
            fill={logColor}
            d="M57.515,13.368c0,2.948-0.843,5.385-2.529,7.311c-1.686,1.926-3.893,2.888-6.62,2.888c-2.718,0-4.913-0.962-6.585-2.888
      c-1.672-1.925-2.508-4.362-2.508-7.311v-0.304c0-2.93,0.834-5.362,2.501-7.297s3.86-2.902,6.578-2.902
      c2.727,0,4.936,0.967,6.626,2.902c1.69,1.935,2.536,4.367,2.536,7.297V13.368z M53.493,13.037c0-2.082-0.433-3.772-1.299-5.072
      c-0.866-1.299-2.147-1.948-3.842-1.948c-1.695,0-2.96,0.645-3.793,1.935c-0.834,1.29-1.251,2.985-1.251,5.085v0.332
      c0,2.119,0.422,3.826,1.265,5.12c0.843,1.294,2.107,1.942,3.793,1.942c1.705,0,2.985-0.647,3.842-1.942
      c0.857-1.294,1.285-3.001,1.285-5.12V13.037z"
          />
          <path
            fill={logColor}
            d="M75.812,21.038c-0.654,0.645-1.608,1.228-2.861,1.748c-1.253,0.521-2.838,0.781-4.754,0.781
      c-2.718,0-4.929-0.91-6.633-2.729s-2.557-4.185-2.557-7.097V13.05c0-3.013,0.841-5.463,2.522-7.352s3.876-2.833,6.585-2.833
      c1.576,0,3.015,0.251,4.319,0.753c1.303,0.502,2.388,1.182,3.254,2.039v4.049h-2.985l-0.567-2.695
      c-0.369-0.313-0.854-0.564-1.458-0.753s-1.297-0.283-2.08-0.283c-1.76,0-3.128,0.649-4.104,1.948
      c-0.977,1.299-1.465,2.999-1.465,5.1v0.718c0,2.045,0.479,3.679,1.438,4.899c0.958,1.221,2.34,1.831,4.146,1.831
      c0.811,0,1.467-0.069,1.969-0.208s0.896-0.299,1.182-0.483v-3.414l-2.875-0.221v-2.833h6.924V21.038z"
          />
        </svg>}
      />
  );


}