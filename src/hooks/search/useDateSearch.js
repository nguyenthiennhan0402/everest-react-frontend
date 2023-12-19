import { useSearchCampaign } from "hooks/campaigns/useSearchCampaign";
import { debounce } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";

const useDateSearch = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
  });
  const [total, setTotal] = useState(0);
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

  const handleSearchInputChange = (e) => {
    debouncedSetSearchAndDate(e.target.value, startDate, endDate);
  };

  return {
    startDate,
    endDate,
    searchText,
    isFetching,
    handleStartDateChange,
    handleEndDateChange,
    handleSearchInputChange,
    disabledEndDate,
    disabledEndDateTime,
    pagination,
    total,
    fetchCampaigns,
    handleTableChange,
  };
};
export default useDateSearch;
