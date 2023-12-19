import React from "react";
import { Form, Select } from "antd";

const { Option } = Select;
const StatusSelect = ({ label, name, options, styledInput }) => (
  <Form.Item
    label={label}
    name={name}
    className="custom-label-input"
    rules={[{ required: true, message: `Please choose ${label.toLowerCase()}!` }]}
  >
    <Select style={styledInput}>
      {options.map((option) => (
        <Option key={option.status_id} value={option.status_name}>
          {option.status_name}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

export default StatusSelect;
