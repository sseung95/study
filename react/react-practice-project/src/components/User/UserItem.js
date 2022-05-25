const UserItem = (props) => {
  return (
    <li>
      {props.name} ({props.age} years old)
    </li>
  );
};

export default UserItem;
