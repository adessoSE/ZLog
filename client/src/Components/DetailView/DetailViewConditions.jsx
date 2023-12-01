import React from 'react';

function DetailViewConditions(props) {
  const { conditions } = props;

  const cond = JSON.parse(conditions);
  return (
    <div>
      <ul className="nav">
        {Object.keys(cond).map(function (k, idx) {
          return (
            <li key={idx} className="list-group-item">
              <strong>{k}</strong>: {cond[k]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DetailViewConditions;
