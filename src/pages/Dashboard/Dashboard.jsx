import { DatePicker, Input, Table } from "antd";
import Banner from "components/Dashboard/Banner/Banner";
import Header from "components/Dashboard/Header/Header";
import Sidebar from "components/Dashboard/Sidebar/Sidebar";
import { useSearchCampaign } from "hooks/campaigns/useSearchCampaign";
import { debounce } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import "styles/Dashboard/Dashboard.css";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
      const formattedStartTimestamp = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ").toString();
      setStartDate(formattedStartTimestamp);
      debouncedSetSearchAndDate(searchText, formattedStartTimestamp, endDate);
    } else {
      debouncedSetSearchAndDate(searchText, null, endDate);
    }
  };
  const handleEndDateChange = (value, date) => {
    if (date) {
      const formattedEndTimestamp = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ").toString();
      debouncedSetSearchAndDate(searchText, startDate, formattedEndTimestamp);
    } else {
      debouncedSetSearchAndDate(searchText, startDate, null);
    }
  };
  const handleSearchInputChange = (e) => {
    debouncedSetSearchAndDate(e.target.value, startDate, endDate);
  };
  const disabledEndDate = (current) => {
    return startDate ? current && current < moment(startDate).endOf("day") : false;
  };
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

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      pageSize: pagination.pageSize || 3,
      current: pagination.current || 1,
    });
  };

  const columns = [
    {
      title: "Campaign Name",
      dataIndex: "name",
      key: "campaignname",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
          <div>
            <img className="campaign-img" alt="campaign img" src={`${record.imgUrl}`}></img>
          </div>
          <div>{`${record.name}`}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              border: `2px solid ${record.status ? "green" : "red"}`,
              backgroundColor: "transparent",
            }}
          />
        </div>
      ),
    },
    {
      title: "Used Amount",
      dataIndex: "usedAmount",
      key: "usedamount",
      align: "center",
      render: (_, record) => <div>{`¥ ${record.usedAmount}`}</div>,
    },
    {
      title: "Usage Rate",
      dataIndex: "usageRate",
      key: "usagerate",
      align: "center",
      render: (_, record) => <div>{` ${record.usageRate}%`}</div>,
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      align: "center",
      render: (_, record) => <div>{`¥ ${record.budget}`}</div>,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startdate",
      align: "center",
      render: (_, record) => <div>{moment.utc(record.startDate).format("YYYY-MM-DD HH:mm")}</div>,
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "enddate",
      align: "center",
      render: (_, record) => <div>{moment.utc(record.endDate).format("YYYY-MM-DD HH:mm")}</div>,
    },
  ];

  return (
    <div className="container">
      <Banner />
      <Header />
      <div className="dashboard_body">
        <Sidebar />
        <div className="content">
          <div className="dashboard-header">
            <div>
              <Input
                type="text"
                style={{ backgroundColor: "#C4C4C4", color: "#000", width: "14em" }}
                placeholder="Search..."
                className="custom-input"
                onChange={handleSearchInputChange}
              />
            </div>
            <div className="dashboard-header__function">
              <div className="date-picker-label">Start Date:</div>
              <DatePicker
                id="start-date-picker"
                style={{ marginRight: "10px" }}
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                placeholder="Select Start Date"
                onChange={handleStartDateChange}
              />

              <div className="date-picker-label">End Date:</div>
              <DatePicker
                id="end-date-picker"
                style={{ marginRight: "10px" }}
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                placeholder="Select End Date"
                disabledDate={disabledEndDate}
                disabledTime={(current, type) => disabledEndDateTime(current, type)}
                onChange={handleEndDateChange}
              />
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
    </div>
  );
};
export default Dashboard;
