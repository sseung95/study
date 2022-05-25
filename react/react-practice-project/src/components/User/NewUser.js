import { useState } from 'react';
import Button from '../UI/Button/Button';

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
      age: userAge,
    };

    if (username === '' || userAge === '' || +userAge < 0) {
      // 모달창 띄우도록 부모에게 알림
      props.onShowInvalidModal(user);
    } else {
      props.onAddUser(user);
      setUsername('');
      setUserAge('');
    }
  };

  // 유효성 검사

  return (
    <form>
      <div className="input-control">
        <label>Add User</label>
        <input type="text" onChange={changeUsername} value={username} />
      </div>
      <div>
        <label>Age (Years)</label>
        <input type="text" onChange={changeUserAge} value={userAge} />
      </div>
      <Button onClick={addUser}>Add User</Button>
    </form>
  );
};

export default NewUser;
