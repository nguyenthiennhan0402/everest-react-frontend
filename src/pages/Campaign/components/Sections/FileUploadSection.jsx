import React from "react";
import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileUploadSection = ({ label, name, styledInput, beforeUpload }) => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form.Item
      label={label}
      name={name}
      className="custom-label-input"
      rules={[
        {
          required: true,
          message: `Please submit your ${label.toLowerCase()}`,
        },
      ]}
      valuePropName="fileList"
      getValueFromEvent={(e) => normFile(e)}
    >
      <Upload showUploadList={false} beforeUpload={beforeUpload}>
        <Button style={styledInput} icon={<UploadOutlined />}>
          Click to Upload
        </Button>
      </Upload>
    </Form.Item>
  );
};

export default FileUploadSection;
