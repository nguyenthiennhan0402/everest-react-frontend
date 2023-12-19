import React from "react";
import moment from "moment";
import * as appConstants from "constants/AppConstants";

export const campaignColumns = [
  {
    title: appConstants.TABLE_CAMPAIGN_CAMPAIGN_NAME,
    dataIndex: "name",
    key: "campaignname",
    align: "center",
    render: (_, record) => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
        <div>
          <img className="campaign-img" alt="an img of campaign" src={`${record.imgUrl}`} />
        </div>
        <div>{`${record.name}`}</div>
      </div>
    ),
  },
  {
    title: appConstants.TABLE_CAMPAIGN_STATUS,
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
    title: appConstants.TABLE_CAMPAIGN_USED_AMOUNT,
    dataIndex: "usedAmount",
    key: "usedamount",
    align: "center",
    render: (_, record) => <div>{`¥ ${record.usedAmount}`}</div>,
  },
  {
    title: appConstants.TABLE_CAMPAIGN_USAGE_RATE,
    dataIndex: "usageRate",
    key: "usagerate",
    align: "center",
    render: (_, record) => <div>{` ${record.usageRate}%`}</div>,
  },
  {
    title: appConstants.TABLE_CAMPAIGN_BUDGET,
    dataIndex: "budget",
    key: "budget",
    align: "center",
  },
  {
    title: appConstants.TABLE_CAMPAIGN_START_DATE,
    dataIndex: "startDate",
    key: "startdate",
    align: "center",
    render: (_, record) => <div>{moment(record.startDate).tz(moment.tz.guess()).format("YYYY-MM-DD HH:mm")}</div>,
  },
  {
    title: appConstants.TABLE_CAMPAIGN_END_DATE,
    dataIndex: "endDate",
    key: "enddate",
    align: "center",
    render: (_, record) => <div>{moment(record.endDate).tz(moment.tz.guess()).format("YYYY-MM-DD HH:mm")}</div>,
  },
];
