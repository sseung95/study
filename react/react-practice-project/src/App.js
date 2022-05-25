import React, { useState } from 'react';

import NewUser from './components/User/NewUser';
import UserList from './components/User/UserList';
import AlertModal from './components/User/AlertModal';

function App() {
  const [users, setUsers] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [invalidUser, setInvalidUser] = useState('');

  const addUser = (user) => {
    setUsers((prevUser) => {
      return [user, ...prevUser];
    });
  };

  const showInvalidModal = (user) => {
    setInvalidUser(user);
    setIsInvalid(true);
  };

  const closeInvalidModal = () => {
    setIsInvalid(false);
  };

  return (
    <>
      <NewUser onAddUser={addUser} onShowInvalidModal={showInvalidModal} />
      <UserList users={users} />
      {isInvalid && (
        <AlertModal
          userInfo={invalidUser}
          onCloseInvalidModal={closeInvalidModal}
        />
      )}
    </>
  );
}

export default App;
