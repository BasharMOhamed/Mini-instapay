import React, { useState, useEffect } from "react";

const SendMoney = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const validateForm = () => {
    let errors = {};
    if (!recipient) {
      errors.recipient = "Recipient email is required";
    } else if (!/\S+@\S+\.\S+/.test(recipient)) {
      errors.recipient = "Recipient email is invalid";
    }

    if (!amount) {
      errors.amount = "Amount is required";
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      errors.amount = "Amount must be a positive number";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log("Money transfer initiated", { recipient, amount, note });
      // Here you would typically call an API to process the payment
      alert(`$${amount} sent to ${recipient} successfully!`);
      // Reset form
      setRecipient("");
      setAmount("");
      setNote("");
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
      style={{ height: `calc(100vh - ${navbarHeight}px)` }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="mb-6 text-center text-3xl font-extrabold text-[#4c096e]">
            Send Money
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="recipient"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Recipient Email
              </label>
              <input
                id="recipient"
                name="recipient"
                type="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4c096e] focus:border-[#4c096e] focus:z-10 sm:text-sm"
                placeholder="recipient@example.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              {errors.recipient && (
                <p className="text-red-500 text-xs italic">
                  {errors.recipient}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Amount ($)
              </label>
              <input
                id="amount"
                name="amount"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4c096e] focus:border-[#4c096e] focus:z-10 sm:text-sm"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs italic">{errors.amount}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="note"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Note (Optional)
              </label>
              <textarea
                id="note"
                name="note"
                rows="3"
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4c096e] focus:border-[#4c096e] focus:z-10 sm:text-sm"
                placeholder="What's this payment for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4c096e] hover:bg-[#3a0753] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4c096e] cursor-pointer"
              >
                Send Money
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
