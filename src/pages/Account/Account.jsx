import { Button, Input, Modal, Table, message } from "antd";
import Banner from "components/Dashboard/Banner/Banner";
import Sidebar from "components/Dashboard/Sidebar/Sidebar";
import Header from "components/Dashboard/Header/Header";
import { useDeleteAccount } from "hooks/accounts/useDeleteAccount";
import { useSearchAccounts } from "hooks/accounts/useSearchAccounts";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import "styles/Account/Account.css";
import CreateAccountModal from "./components/CreateAccountModal/CreateAccountModal";
import EditAccountModal from "./components/EditAccoutModal/EditAccountModal";

const Account = () => {
  const [modals, SetModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
  });
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");

  const { mutateAsync } = useDeleteAccount();
  const { data: fetchAccounts, isFetching } = useSearchAccounts(
    searchText,
    pagination.pageSize,
    pagination.current - 1
  );
  const debouncedSetSearchText = debounce((text) => setSearchText(text), 1500);

  useEffect(() => {
    if (fetchAccounts) {
      setTotal(fetchAccounts?.data?.totalElements || 0);
    }
  }, [fetchAccounts]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      pageSize: pagination.pageSize || 3,
      current: pagination.current || 1,
    });
  };

  const handleEdit = (record) => {
    setEditModal(true);
    setSelectedRecord(record);
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Confirmination",
      content: "Please confirm that you want to delete everything.",
      okText: "Delete",
      okButtonProps: {
        style: { backgroundColor: "#F7685B", color: "white" },
      },
      onOk: async () => {
        try {
          await mutateAsync({ id: record.accountId });
          message.success("Account deleted successfully!");
        } catch (error) {
          console.error("Error deleting account", error);
        }
      },
      className: "DeleteAccountModal-footer",
    });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "accountId",
      key: "accountId",
      align: "center",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      align: "center",
      width: 300,
      render: (_, record) => (
        <div
          style={{
            maxWidth: 250,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {`${record.firstname} ${record.lastname}`}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 250,
      render: (_, record) => (
        <div>
          <Button type="default" onClick={() => handleEdit(record)} className="edit-button">
            Edit
          </Button>{" "}
          <Button type="default" onClick={() => handleDelete(record)} className="delete-button">
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="container">
      <Banner />
      <Header />
      <div className="dashboard_body">
        <Sidebar />
        <div className="content">
          <div className="account-header">
            <div>
              <Input
                type="text"
                style={{ backgroundColor: "#C4C4C4", color: "#000", width: "14em" }}
                placeholder="Search..."
                className="custom-input"
                onChange={(e) => debouncedSetSearchText(e.target.value)}
              />
            </div>
            <div className="account-header__function">
              <Button type="default" style={{ backgroundColor: "#468FAF", color: "#fff", width: "130px" }}>
                Export CSV
              </Button>
              <Button
                type="default"
                onClick={() => SetModal(true)}
                style={{ backgroundColor: "#468FAF", color: "#fff", width: "130px" }}
              >
                Create Account
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={fetchAccounts?.data?.content || []}
            loading={isFetching}
            pagination={{
              ...pagination,
              total: total,
              showSizeChanger: false,
              showQuickJumper: false,
              onChange: (page) => {
                setPagination({ ...pagination, current: page });
              },
              style: {
                display: "flex",
                justifyContent: "center",
              },
            }}
            onChange={handleTableChange}
          />
        </div>
      </div>
      <CreateAccountModal
        isModalOpen={modals}
        handleOk={() => {}}
        handleCancel={() => {
          SetModal(!modals);
        }}
      />
      <EditAccountModal
        isModalOpen={editModal}
        handleOk={() => {}}
        handleCancel={() => {
          SetModal(false);
          setEditModal(false);
          setSelectedRecord(null);
        }}
        initialData={selectedRecord}
      />
    </div>
  );
};

export default Account;
