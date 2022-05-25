import Button from '../UI/Button/Button';

import styles from './AlertModal.module.css';

const AlertModal = (props) => {
  console.log(+props.userInfo.age);

  let text = '';

  if (props.userInfo.name === '' && props.userInfo.age === '') {
    text = '이름, 나이 모두 써주세요.';
  } else if (props.userInfo.name === '') {
    text = '이름 써주세요';
  } else if (props.userInfo.age === '') {
    text = '나이 써주세요';
  } else if (+props.userInfo.age < 0) {
    text = '나이는 0이상이어야 합니다';
  }

  return (
    <>
      <div className={styles.modal}>
        <div>
          <h2>Invalid Input</h2>
          <p>{text}</p>
          <Button onClick={props.onCloseInvalidModal}>Okay</Button>
        </div>
      </div>
      <div className={styles.overlay} onClick={props.onCloseInvalidModal}></div>
    </>
  );
};

export default AlertModal;
