// 둥근 모서리, 옅은 그림자 등 카드 모양 스타일 컴포넌트
import './Card.css';
const Card = (props) => {
  const classes = 'card ' + props.className;
  return <div className={classes}>{props.children}</div>;
};

export default Card;
