import { deleteTransaction, getTransactionsByUserId } from "../apiService";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function TransactionDeleteButton({ movieId }) {
  const { user } = useAuth();
  const [isDisabled, setIsDisabled] = useState(false);
  const [transactionId, setTransactionId] = useState(null);  

  useEffect(() => {
    //checking if user already has a transaction for this movie
    const checkTransactions = async () => {
      if (!user || !user.id) return; //whatever

      const currentUserTransactions = await getTransactionsByUserId(user.id);
      const existingTransaction = currentUserTransactions.find(
        (transactionIndividual) => transactionIndividual.movie_id === movieId
      );

      if (existingTransaction) {
        setIsDisabled(true);
        setTransactionId(existingTransaction.id); // save transaction ID for deletion
      } else {
        setIsDisabled(false);
        setTransactionId(null);
      }
    };

    checkTransactions();
  }, [user, movieId]);

  const handleDeleteTransaction = async () => {
    try {
      if (!user || !user.id || !transactionId) {
        alert("No transaction found to delete!");
        return;
      }

      await deleteTransaction(transactionId); 
      alert("Transaction deleted!");
      setIsDisabled(false);
      setTransactionId(null);

    } catch (err) {
      console.error(err);
      alert("There was an error deleting your transaction");
    }
  };

  return (
    <button onClick={handleDeleteTransaction} disabled={!isDisabled}>
      {isDisabled ? "Owned – Click to Delete" : "Not Owned"}
    </button>
  );
}
