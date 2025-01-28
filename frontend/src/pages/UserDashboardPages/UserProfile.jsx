import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProfileById,
  updateProfile,
  deleteAccount,
} from "../../features/Users/userAction";
import {
  Box,
  Modal,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import backendURL from "../../config";

import { BsPersonBoundingBox } from "react-icons/bs";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { AiTwotoneDelete } from "react-icons/ai";
import Spinner from "../../components/tools/Spinner";
import { resetSuccess } from "../../features/Users/UserSlice";

function AdminProfile() {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Deleteopen, setDeleteOpen] = useState(false);

  const dispatch = useDispatch();

  // Memoized selectors
  const { userInfo } = useSelector((state) => state.auth);
  const { profile, loading, success, error } = useSelector(
    (state) => state.profiles
  );
  const userId = userInfo?._id;

  // Memoized handlers
  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const DeleteOpen = useCallback(() => {
    setDeleteOpen(true);
  }, []);

  const DeleteClose = useCallback(() => {
    setDeleteOpen(false);
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Load profile data
  useEffect(() => {
    let isSubscribed = true;

    const loadProfile = async () => {
      if (userId && isSubscribed) {
        try {
          await dispatch(fetchProfileById(userId));
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Failed to load profile",
            severity: "error",
          });
        }
      }
    };

    loadProfile();

    return () => {
      isSubscribed = false;
    };
  }, [dispatch, userId]);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        username: profile.username || "",
        email: profile.email || "",
        password: "", // Do not prefill password
      }));

      if (profile.image) {
        setImagePreview(`${profile.image}`);
      }
    }
  }, [profile, backendURL]);

  // Memoize submit handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!userId) return;

      const updateData = new FormData();
      updateData.append("username", formData.username);
      updateData.append("email", formData.email);

      if (formData.password.trim()) {
        if (formData.password.length < 6) {
          setSnackbar({
            open: true,
            message: "Password must be at least 6 characters long",
            severity: "error",
          });
          return;
        }
        updateData.append("password", formData.password);
      }

      if (selectedFile) {
        updateData.append("image", selectedFile);
      }

      try {
        await dispatch(
          updateProfile({ userId, formData: updateData })
        ).unwrap();
        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });
        setFormData((prev) => ({ ...prev, password: "" }));
        dispatch(resetSuccess());
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "Failed to update profile",
          severity: "error",
        });
      }
    },
    [dispatch, userId, formData, selectedFile]
  );

  // Memoize delete handler
  const handleDelete = useCallback(async () => {
    if (!userId) return;

    try {
      await dispatch(deleteAccount(userId)).unwrap();
      setSnackbar({
        open: true,
        message: "Account deleted successfully!",
        severity: "success",
      });
      setDeleteOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete account",
        severity: "error",
      });
    }
  }, [dispatch, userId]);

  // Memoize loading state component
  const LoadingSpinner = useMemo(
    () => (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <CircularProgress size={40} className="text-btColour" />
      </div>
    ),
    []
  );

  // Memoize form inputs configuration
  const formInputs = useMemo(
    () => [
      {
        id: "username",
        label: "Username",
        type: "text",
        required: true,
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        required: true,
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        required: false,
        placeholder: "********",
      },
    ],
    []
  );

  if (loading) {
    return LoadingSpinner;
  }

  return (
    <div className="mid:mt-20">
      <div>
        <div className="col-span-full mx-auto text-center items-center align-middle">
          <label className="block text-xl font-bold leading-6 text-gray-900">
            My profile
          </label>
          <div className="mt-1 flex justify-center rounded-lg px-6 pt-10">
            <div className="relative text-center">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-[15rem] w-[15rem] rounded-full object-cover border-4 border-white"
                  />
                  <label
                    htmlFor="file-upload"
                    className="absolute bottom-0 right-4 cursor-pointer h-12 w-12 bg-white rounded-full flex justify-center items-center border-2 border-white"
                  >
                    <MdOutlineAddAPhoto className="h-8 w-8 text-gray-500" />
                    <input
                      id="file-upload"
                      name="image"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                </>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer h-40 w-40 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-full"
                >
                  <BsPersonBoundingBox className="h-12 w-12 text-gray-300" />
                  <input
                    id="file-upload"
                    name="image"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:px-[5rem] p-16 mx-auto md:w-[35rem] mid:mx-[1rem] rounded-xl">
        <form onSubmit={handleSubmit}>
          {formInputs.map(({ id, label, type, required, placeholder }) => (
            <div key={id} className="mb-5">
              <label
                htmlFor={id}
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                {label}
              </label>
              <input
                type={type}
                id={id}
                name={id}
                value={formData[id]}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                required={required}
                placeholder={placeholder}
              />
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none focus:ring-offset-2 focus:ring-btColour transition-all duration-300 ease-in-out hover:scale-105 focus:ring-4  font-medium rounded-lg text-sm w-[30%] py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {loading ? <Spinner /> : "Update"}
            </button>
          </div>
        </form>
      </div>

      <Button>
        <React.Fragment>
          <button
            onClick={DeleteOpen}
            className="px-2 first-letter:uppercase pt-[10rem] text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition ease-in-out duration-200 transform hover:scale-110 hover:text-red-600 underline"
          >
            Delete Account
          </button>
          <Dialog
            open={Deleteopen}
            onClose={DeleteClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Are you sure you want to delete your account?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Confirm delete or cancel
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={DeleteClose}>
                <IoClose
                  size={24}
                  className="text-red-500 border-red-500 rounded-sm transition ease-in-out duration-200 transform hover:scale-125 hover:text-red-600"
                />
              </Button>
              <Button onClick={handleDelete}>
                <AiTwotoneDelete
                  size={24}
                  className="text-red-500 border-red-500 rounded-sm transition ease-in-out duration-200 transform hover:scale-125 hover:text-red-600"
                />
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminProfile;
