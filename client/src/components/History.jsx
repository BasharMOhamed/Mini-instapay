import React, { useState, useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";

const History = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const { fetchTransactions } = useTransactions();

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    fetchTransactions();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const filteredTransactions = transactions
    .filter((transaction) => {
      if (filter !== "all" && transaction.type !== filter) return false;

      const searchLower = searchTerm.toLowerCase();
      return (
        searchTerm === "" ||
        (transaction.from &&
          transaction.from.toLowerCase().includes(searchLower)) ||
        (transaction.to &&
          transaction.to.toLowerCase().includes(searchLower)) ||
        transaction.note.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

  return (
    <div
      className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 font-montserrat"
      style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Transaction History
        </h1>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label
                  htmlFor="filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Filter
                </label>
                <select
                  id="filter"
                  className="rounded-md border-gray-300 shadow-sm focus:border-[#4c096e] focus:ring focus:ring-[#4c096e] focus:ring-opacity-50"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Transactions</option>
                  <option value="sent">Money Sent</option>
                  <option value="received">Money Received</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort By
                </label>
                <select
                  id="sortBy"
                  className="rounded-md border-gray-300 shadow-sm focus:border-[#4c096e] focus:ring focus:ring-[#4c096e] focus:ring-opacity-50"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Order
                </label>
                <select
                  id="sortOrder"
                  className="rounded-md border-gray-300 shadow-sm focus:border-[#4c096e] focus:ring focus:ring-[#4c096e] focus:ring-opacity-50"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            <div className="w-full md:w-64">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#4c096e] focus:ring focus:ring-[#4c096e] focus:ring-opacity-50"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Note
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            transaction.type === "received"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type === "received" ? "↓" : "↑"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.type === "received"
                          ? `From: ${transaction.from}`
                          : `To: ${transaction.to}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.note}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                          transaction.type === "received"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "received" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination*/}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {filteredTransactions.length}
                </span>{" "}
                transactions
              </div>
              <div className="flex-1 flex justify-end">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
