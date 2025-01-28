// components/ConfirmationModal.jsx
import React from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";

Modal.setAppElement("#root"); // Set the app element for accessibility

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmation Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold">Confirm Deletion</h2>
        <button onClick={onRequestClose} className="text-gray-500">
          <FaTimes />
        </button>
      </div>
      <p className="mt-4">
        Are you sure you want to delete your account? This action cannot be
        undone.
      </p>
      <div className="flex justify-end mt-6 space-x-4">
        <button
          onClick={onRequestClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
