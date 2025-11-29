import { createTransaction, getTransactionsByUserId } from "../apiService";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function TransactionAddButton({ movieId, transactionType }) {
  const { user } = useAuth();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => { //on load
    //checks if user already rented/bought movie so we can disable the button
    const checkTransactions = async () => {
      if (!user || !user.id) return;

      const currentUserTransactions = await getTransactionsByUserId(user.id);
      const hasTransaction = currentUserTransactions.some(
        (transactionIndividual) => transactionIndividual.movie_id === movieId
      );
      setIsDisabled(hasTransaction);
    };

    checkTransactions();
  }, [user, movieId]);

  const handleTransaction = async () => {
    try {
      if (!user || !user.id) {
        alert("Sign up and receive easy access to this movie!");
        return;
      }

      // check to make sure there's no transactions with this movieid and userid already
      const currentUserTransactions = await getTransactionsByUserId(user.id);
      const hasTransaction = currentUserTransactions.some(
        (transactionIndividual) => transactionIndividual.movie_id === movieId
      );

      if (hasTransaction) {
        alert("You already own this movie!");
        setIsDisabled(true);
        return;
      }

      const transactionData = {
        movie_id: movieId,
        user_id: user.id,
        date_start: new Date().toISOString().slice(0, 19).replace("T", " "),
        transaction_type: transactionType,
      };

      await createTransaction(transactionData);
      alert("Transaction submitted!");
      setIsDisabled(true); //disable button after submitting
    } catch (err) {
      console.error(err);
      alert("There was an error in submitting your transaction...");
    }
  };

  let buttonText = transactionType === "rent" ? "Rent" : "Buy";

  return (
    <button onClick={handleTransaction} disabled={isDisabled}>
      {buttonText}
    </button>
  );
}
