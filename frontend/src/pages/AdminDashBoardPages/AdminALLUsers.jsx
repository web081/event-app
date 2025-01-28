import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  UserCircle,
  Search,
  Check,
  X,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { FaCheck, FaTimes } from "react-icons/fa";
import moment from "moment";

// MUI Imports
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";

// Simulated backend URL (replace with actual config)
import backendURL from "../../config";

export default function AdminALLUsers() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 9;

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const fetchUsers = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${backendURL}/api/getAllUsers?page=${page}&limit=${usersPerPage}`
        );
        const data = await res.json();

        if (res.ok) {
          const { users, totalUsers, totalPages, currentPage } = data;
          setUsers(users);
          setTotalUsers(totalUsers);
          setTotalPages(totalPages);
          setCurrentPage(currentPage);
        } else {
          showSnackbar(data.message || "Failed to fetch users", "error");
        }
      } catch (error) {
        showSnackbar(
          error.message || "An error occurred while fetching users",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [backendURL, showSnackbar, usersPerPage]
  );

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const handleDeleteUser = useCallback(async () => {
    try {
      const res = await fetch(`${backendURL}/api/Delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        const newTotalUsers = totalUsers - 1;
        const newTotalPages = Math.ceil(newTotalUsers / usersPerPage);
        const pageToFetch =
          currentPage > newTotalPages ? newTotalPages : currentPage;

        setDeleteOpen(false);
        showSnackbar("User deleted successfully", "success");
        fetchUsers(pageToFetch);
      } else {
        showSnackbar(data.message || "Failed to delete user", "error");
      }
    } catch (error) {
      showSnackbar(
        error.message || "An error occurred while deleting user",
        "error"
      );
    }
  }, [
    backendURL,
    userIdToDelete,
    currentPage,
    totalUsers,
    usersPerPage,
    fetchUsers,
    showSnackbar,
  ]);

  const handleDeleteClick = useCallback((userId) => {
    setUserIdToDelete(userId);
    setDeleteOpen(true);
  }, []);

  const filteredUsers = useMemo(
    () =>
      users?.filter(
        (user) =>
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <AlertCircle className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-transparent">
      {/* Search and Total Users */}
      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="text-gray-600">Total Users: {totalUsers}</div>
      </div>

      {/* Users Table */}
      {users?.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">Date Created</th>
                  <th className="px-4 py-3 text-left">User Image</th>
                  <th className="px-4 py-3 text-left">UserName</th>

                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-center">Admin</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {moment(user.updatedAt).format("MMMM D")}
                    </td>
                    <td className="px-4 py-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/fallback-image.png";
                          }}
                        />
                      ) : (
                        <UserCircle className="w-10 h-10 text-gray-400" />
                      )}
                    </td>
                    <td className="px-4 py-3">{user.username}</td>

                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                      {user.role === "admin" ? (
                        <FaCheck className="text-green-500 mx-auto" />
                      ) : (
                        <FaTimes className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="w-full sm:w-auto font-medium text-red-500 bg-transparent border border-red-500 cursor-pointer hover:bg-red-500 hover:text-white p-1 rounded-md text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">You have no users yet!</p>
      )}

      {/* MUI Dialog for Delete Confirmation */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this user?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* MUI Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
