import { Form } from "antd";
import React from "react";

const FormSection = ({ label, name, rules, children }) => (
  <Form.Item label={label} name={name} className="custom-label-input" rules={rules} hasFeedback>
    {children}
  </Form.Item>
);

export default FormSection;
