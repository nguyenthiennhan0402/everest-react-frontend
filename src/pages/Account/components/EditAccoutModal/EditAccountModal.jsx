import { Button, Collapse, Form, Input, Modal, Select, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { useFetchRoles } from "hooks/accounts/useFetchRoles";
import { useUpdataAccount } from "hooks/accounts/useUpdataAccount";
import { addressRegex, nameRegex, phoneRegex } from "utils/RegularExpression";
import "styles/Account/EditAccountModal.css";

const { Option } = Select;
const { Panel } = Collapse;

const EditAccountModal = ({ isModalOpen, handleOk, handleCancel, initialData }) => {
  const [form] = useForm();
  const { mutateAsync } = useUpdataAccount();
  const { data: fetchRoles } = useFetchRoles();
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, form]);
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const styledInput = {
    marginLeft: "2.5em",
  };
  const onFinish = async (values) => {
    try {
      const initValue = {
        email: values.email,
        password: values.password,
        firstname: values.firstname,
        lastname: values.lastname,
        role: values.role,
        address: values.address,
        phone: values.phone,
      };
      const response = await mutateAsync({
        id: initialData.accountId,
        record: initValue,
      });
      if (response?.code === 400) {
        return message.error(response?.message);
      }
      form.resetFields();
      message.success(response?.message);
      handleCancel();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  return (
    <Modal
      title="Edit Account"
      footer={[
        <div className="EditAccountModal-footer" key="footer">
          <Button
            key="cancel"
            onClick={() => {
              form.resetFields();
              handleCancel();
            }}
          >
            Cancel
          </Button>
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Submit
          </Button>
        </div>,
      ]}
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={650}
    >
      <Collapse
        defaultActiveKey={["1"]}
        accordion
        expandIconPosition="right"
        style={{ backgroundColor: "#468FAF", color: "#FFFFFF" }}
        className="custom-collapse"
      >
        <Panel header={<div style={{ color: "#fff", backgroundColor: "#468FAF" }}>Details</div>} key="1">
          <Form form={form} initialValues={initialData || {}} {...formItemLayout} labelAlign="left" onFinish={onFinish}>
            <Form.Item
              label="First Name"
              name="firstname"
              className="custom-label-input"
              rules={[
                {
                  required: true,
                  message: "Please input your first name!",
                },
                {
                  message: "Please input a valid first name!",
                  pattern: nameRegex,
                },
              ]}
              hasFeedback
            >
              <Input style={styledInput} onBlur={() => form.validateFields(["firstname"])} />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastname"
              className="custom-label-input"
              rules={[
                {
                  required: true,
                  message: "Please input your last name!",
                },
                {
                  message: "Please input a valid last name!",
                  pattern: nameRegex,
                },
              ]}
              hasFeedback
            >
              <Input style={styledInput} onBlur={() => form.validateFields(["lastname"])} />
            </Form.Item>
            <Form.Item label="Email" name="email" className="custom-label-input" hasFeedback>
              <Input disabled style={styledInput} />
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              className="custom-label-input"
              rules={[
                {
                  required: true,
                  message: "Please input your role!",
                },
              ]}
              hasFeedback
            >
              <Select style={styledInput}>
                {fetchRoles?.data?.map((role) => (
                  <Option key={role.roleId} value={role.roleName}>
                    {role.role_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              className="custom-label-input"
              rules={[
                {
                  required: true,
                  message: "Please input an address!",
                },
                {
                  message: "Please input an valid address!",
                  pattern: addressRegex,
                },
              ]}
              hasFeedback
            >
              <Input style={styledInput} onBlur={() => form.validateFields(["address"])} />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              className="custom-label-input"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
                {
                  message: "Please input a valid phone number!",
                  pattern: phoneRegex,
                },
              ]}
              hasFeedback
            >
              <Input style={styledInput} onBlur={() => form.validateFields(["phone"])} />
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </Modal>
  );
};

export default EditAccountModal;
