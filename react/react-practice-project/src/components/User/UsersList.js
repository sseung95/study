import Card from '../UI/Card/Card';
import styles from './UsersList.module.css';

const UsersList = (props) => {
  if (props.users.length === 0) {
    return <></>;
  }
  return (
    <Card className={styles.users}>
      <ul>
        {props.users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.age} years old)
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default UsersList;
