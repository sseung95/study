import { useSelector } from 'react-redux';
import classes from './CartButton.module.css';

const CartButton = (props) => {
  const items = useSelector((state) => state.cart.items);
  return (
    <button className={classes.button}>
      <span>My Cart</span>
      <span className={classes.badge}>{items.length}</span>
    </button>
  );
};

export default CartButton;
