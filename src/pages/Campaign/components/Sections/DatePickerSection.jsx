import { DatePicker, Form } from "antd";
import React from "react";

const DatePickerSection = ({ label, name, onChange, disabledDate, disabledTime }) => (
  <Form.Item label={label} name={name}>
    <DatePicker
      id={`${name}-picker`}
      showTime={{ format: "HH:mm" }}
      format="YYYY-MM-DD HH:mm"
      placeholder={`Select ${label}`}
      onChange={onChange}
      disabledDate={disabledDate}
      disabledTime={disabledTime}
    />
  </Form.Item>
);

export default DatePickerSection;
