import { useState } from 'react';

const UserInput = (props) => {
  return (
    <div>
      <label>{props.label}</label>
      <input type={props.type} onChange={props.onChangeUsername} />
    </div>
  );
};

export default UserInput;
