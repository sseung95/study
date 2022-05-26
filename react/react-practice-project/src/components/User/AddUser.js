import { useState } from 'react';
import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import ErrorModal from '../UI/Modal/ErrorModal';

import styles from './AddUser.module.css';

const AddUser = (props) => {
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredAge, setEnteredAge] = useState('');
  const [error, setError] = useState();

  const addUserHandler = (e) => {
    e.preventDefault();

    // 이름, 나이 빈 값이 있을 때
    if (enteredUsername.trim().length === 0 || enteredAge.trim().length === 0) {
      setError({
        title: 'Input Invalid',
        message: 'Please enter username and age.',
      });
      return;
    }
    if (+enteredAge < 1) {
      setError({
        title: 'Input Invalid',
        message: 'Please enter valid age (> 0)',
      });
      return;
    }

    props.onAddUser(enteredUsername, enteredAge);

    setEnteredUsername('');
    setEnteredAge('');
  };

  const errorHandler = () => {
    setError();
  };

  const usernameChangeHandler = (e) => {
    setEnteredUsername(e.target.value);
  };

  const ageChangeHandler = (e) => {
    setEnteredAge(e.target.value);
  };

  return (
    <>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      <Card className={styles.input}>
        <form onSubmit={addUserHandler}>
          <label>Username</label>
          <input
            type="text"
            value={enteredUsername}
            onChange={usernameChangeHandler}
          />
          <label>Age (Years)</label>
          <input type="number" value={enteredAge} onChange={ageChangeHandler} />
          <Button>Add User</Button>
        </form>
      </Card>
    </>
  );
};

export default AddUser;
