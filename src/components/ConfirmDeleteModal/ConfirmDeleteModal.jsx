import React from "react";
import { Modal, message, Button } from "antd";
import "styles/ConfirmDeleteModal/ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ record, onConfirm }) => {
  const handleDelete = async () => {
    Modal.confirm({
      title: "Confirmation",
      content: "Please confirm that you want to delete everything.",
      okText: "Delete",
      okButtonProps: {
        style: { backgroundColor: "#F7685B", color: "white" },
      },
      onOk: async () => {
        try {
          await onConfirm(record.campaignId);
          message.success("Campaign Deleted Successfully");
        } catch (error) {
          console.error("Error deleting campaign", error);
        }
      },
      className: "DeleteAccountModal-footer",
    });
  };

  return (
    <Button type="default" onClick={handleDelete} className="delete-button">
      Delete
    </Button>
  );
};

export default ConfirmDeleteModal;
