import UserItem from './UserItem';

const UserList = (props) => {
  return (
    <ul>
      {props.users.map((user) => (
        <UserItem name={user.name} age={user.age} />
      ))}
    </ul>
  );
};

export default UserList;
