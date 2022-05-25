import React, { useState } from 'react';

import NewUser from './components/User/NewUser';

function App() {
  const [users, setUsers] = useState([]);

  const addUser = (user) => {
    setUsers((prevUser) => {
      return [user, ...prevUser];
    });
    console.log(users);
  };
  return <NewUser onAddUser={addUser} />;
}

export default App;
