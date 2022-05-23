import React, { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import './NewExpense.css';

const NewExpense = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const saveExpenseData = (enteredExpenseData) => {
    const expenseData = {
      id: Math.random().toString(),
      ...enteredExpenseData,
    };
    props.onAddExpense(expenseData);
    setIsEditing(false);
  };

  const startEditingHandler = () => {
    setIsEditing(true);
  };

  const stopEditingHandler = () => {
    setIsEditing(false);
  };

  // 유의할 점은 함수를 실행하지 않고 함수 자체를 ExpenseForm 컴포넌트에 전달했다는 것이다.
  return (
    <div className="new-expense">
      {!isEditing && (
        <button onClick={startEditingHandler}>Add New Expense</button>
      )}
      {isEditing && (
        <ExpenseForm
          onSaveExpenseData={saveExpenseData}
          stopEditing={stopEditingHandler}
        />
      )}
    </div>
  );
};

export default NewExpense;
