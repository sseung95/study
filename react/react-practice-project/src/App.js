import React, { useState } from 'react';

import AddUser from './components/User/AddUser';
import UsersList from './components/User/UsersList';

function App() {
  const [users, setUsers] = useState([]);

  const addUserHandler = (uName, uAge) => {
    setUsers((prevUsers) => {
      return [
        ...prevUsers,
        { name: uName, age: uAge, id: new Date().getTime().toString() },
      ];
    });
  };
  return (
    <>
      <AddUser onAddUser={addUserHandler} />
      <UsersList users={users} />
    </>
  );
}

export default App;
