import { Button, DatePicker, Input, Modal, Table, message } from "antd";
import Banner from "components/Dashboard/Banner/Banner";
import Header from "components/Dashboard/Header/Header";
import Sidebar from "components/Dashboard/Sidebar/Sidebar";
import * as appConstants from "constants/AppConstants";
import * as commonMessages from "constants/CommonMessages";
import * as errorMessages from "constants/ErrorMessages";
import { useDeleteCampaign } from "hooks/campaigns/useDeteleCampaign";
import { useSearchCampaign } from "hooks/campaigns/useSearchCampaign";
import { debounce } from "lodash";
import moment from "moment";
import "moment-timezone";
import { campaignColumns } from "pages/TableColumn/CampaignColumns";
import { useEffect, useState } from "react";
import "styles/Campaign/Campaign.css";
import CreateCampaignModal from "./components/CreateCampaignModal";
import EditCampaignModal from "./components/EditCampaignModal";

const Campaign = () => {
  const [modals, setModals] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { mutateAsync } = useDeleteCampaign();
  const [editModal, setEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
  });
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const { data: fetchCampaigns, isFetching } = useSearchCampaign(
    searchText,
    startDate,
    endDate,
    pagination.pageSize,
    pagination.current - 1
  );
  useEffect(() => {
    if (fetchCampaigns) {
      setTotal(fetchCampaigns?.data?.totalElements || 0);
    }
  }, [fetchCampaigns]);

  const disabledEndDate = (current) => {
    return startDate ? current && current < moment(startDate).endOf("day") : false;
  };

  const disabledEndDateTime = (current, type) => {
    if (type === "start") {
      return false;
    }

    if (!startDate) {
      return true;
    }

    const endOfDay = moment(startDate).endOf("day");

    return current && current < endOfDay;
  };

  const debouncedSetSearchAndDate = debounce((text, start, end) => {
    if (start && !end) {
      setSearchText(null);
      setStartDate(start);
      setEndDate(null);
    } else if (!start && end) {
      setSearchText(null);
      setStartDate(null);
      setEndDate(end);
    } else if (start && end) {
      setSearchText(text);
      setStartDate(start);
      setEndDate(end);
    } else {
      setSearchText(text);
      setStartDate(null);
      setEndDate(null);
    }
  }, 1500);
  const handleStartDateChange = (value, date) => {
    if (date) {
      const formattedStartTimestamp = moment(date).format(appConstants.DATE_FORMAT).toString();
      setStartDate(formattedStartTimestamp);
      debouncedSetSearchAndDate(searchText, formattedStartTimestamp, endDate);
    } else {
      debouncedSetSearchAndDate(searchText, null, endDate);
    }
  };

  const handleEndDateChange = (value, date) => {
    if (date) {
      const formattedEndTimestamp = moment(date).format(appConstants.DATE_FORMAT).toString();
      debouncedSetSearchAndDate(searchText, startDate, formattedEndTimestamp);
    } else {
      debouncedSetSearchAndDate(searchText, startDate, null);
    }
  };
  const handleSearchInputChange = (e) => {
    debouncedSetSearchAndDate(e.target.value, startDate, endDate);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      pageSize: pagination.pageSize || 3,
      current: pagination.current || 1,
    });
  };
  const handleEdit = (record) => {
    setEditModal(true);
    record.startDate = moment(record.startDate);
    record.endDate = moment(record.endDate);
    setSelectedRecord(record);
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: appConstants.MODAL_CONFIRM_TITLE,
      content: commonMessages.MESSAGE_CONFIRM_DELETE,
      okText: appConstants.MODAL_OK_TEXT,
      okButtonProps: {
        style: { backgroundColor: "#F7685B", color: "white" },
      },
      onOk: async () => {
        try {
          await mutateAsync({ id: record.campaignId });
          message.success(commonMessages.MESSAGE_CAMPAIGN_DELETED_SUCCESSFULLY);
        } catch (error) {
          console.error(errorMessages.ERROR_DELETE_CAMPAIGN_FAILED, error);
        }
      },
      className: "DeleteAccountModal-footer",
    });
  };

  const actionColumn = [
    {
      title: appConstants.TABLE_CAMPAIGN_ACTION,
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 250,
      render: (_, record) => (
        <div>
          <Button type="default" onClick={() => handleEdit(record)} className="edit-button">
            {appConstants.BUTTON_EDIT_TEXT}
          </Button>{" "}
          <Button type="default" onClick={() => handleDelete(record)} className="delete-button">
            {appConstants.BUTTON_DELETE_TEXT}
          </Button>
        </div>
      ),
    },
  ];
  const columns = [...campaignColumns, ...actionColumn];
  return (
    <div className="container">
      <Banner />
      <Header />
      <div className="dashboard_body">
        <Sidebar />
        <div className="content">
          <div className="campaign-header">
            <div>
              <div className="date-picker">
                <div className="date-picker-label">{appConstants.LABEL_START_DATE}</div>
                <DatePicker
                  id="start-date-picker"
                  showTime={{ format: "HH:mm" }}
                  format={appConstants.DATE_PICKER_FORMAT}
                  placeholder={appConstants.DATE_PICKER_STARTDATE_PLACEHOLDER}
                  onChange={handleStartDateChange}
                />
                <div className="date-picker-label">{appConstants.LABEL_END_DATE}</div>
                <DatePicker
                  id="end-date-picker"
                  showTime={{ format: "HH:mm" }}
                  format={appConstants.DATE_PICKER_FORMAT}
                  placeholder={appConstants.DATE_PICKER_ENDDATE_PLACEHOLDER}
                  disabledDate={disabledEndDate}
                  disabledTime={(current, type) => disabledEndDateTime(current, type)}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
            <div className="campaign-header__function">
              <Input
                type="text"
                style={{ backgroundColor: "#C4C4C4", color: "#000", width: "14em" }}
                placeholder={appConstants.INPUT_SEARCH_PLACEHOLDER}
                className="custom-input"
                onChange={handleSearchInputChange}
              />
              <div className="campaign-function-button">
                <Button
                  type="default"
                  style={{ backgroundColor: appConstants.MAIN_COLOR, color: "#fff", width: "150px" }}
                >
                  {appConstants.BUTTON_EXPORT_CSV_TEXT}
                </Button>
                <Button
                  onClick={() => setModals(true)}
                  type="default"
                  style={{ backgroundColor: appConstants.MAIN_COLOR, color: "#fff", width: "150px" }}
                >
                  {appConstants.BUTTON_CREATE_CAMPAIGN_TEXT}
                </Button>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={fetchCampaigns?.data?.content || []}
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
      <CreateCampaignModal
        isModalOpen={modals}
        handleOk={() => {}}
        handleCancel={() => {
          setModals(!modals);
        }}
      />
      <EditCampaignModal
        isModalOpen={editModal}
        handleOk={() => {}}
        handleCancel={() => {
          setModals(false);
          setEditModal(false);
          setSelectedRecord(null);
        }}
        initialData={selectedRecord}
      />
    </div>
  );
};

export default Campaign;
