import { useState } from 'react';
import Button from '../UI/Button/Button';
import UserInput from './UserInput';

const NewUser = (props) => {
  const [username, setUsername] = useState('');
  const [userAge, setUserAge] = useState('');

  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  const changeUserAge = (event) => {
    setUserAge(event.target.value);
  };

  const addUser = (event) => {
    event.preventDefault();
    const user = {
      name: username,
      age: +userAge,
    };
    props.onAddUser(user);
  };

  return (
    <form>
      <div>
        <label>Add User</label>
        <input type="text" onChange={changeUsername} />
      </div>
      <div>
        <label>Age (Years)</label>
        <input type="text" onChange={changeUserAge} />
      </div>
      <Button onClick={addUser}>Add User</Button>
    </form>
  );
};

export default NewUser;
