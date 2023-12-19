import { UploadOutlined } from "@ant-design/icons";
import { Button, Collapse, Form, Image, Input, Modal, Upload, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import * as appConstant from "constants/AppConstants";
import * as errorMessage from "constants/ErrorMessages";
import useEditCampaign from "hooks/campaigns/useEditCampaign";
import moment from "moment";
import { useEffect, useState } from "react";
import "styles/Campaign/EditCampaignModal.css";
import * as validators from "utils/validation";
import DatePickerSection from "./Sections/DatePickerSection";
import FileUploadSection from "./Sections/FileUploadSection";
import FormSection from "./Sections/FormSection";
import StatusSelect from "./Sections/StatusSelect";

const { Panel } = Collapse;

const EditCampaignModal = ({ isModalOpen, handleOk, handleCancel, initialData }) => {
  const [form] = useForm();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, form]);

  const { editCampaign } = useEditCampaign();

  const styledInput = {
    marginLeft: "2.5em",
  };
  const userStatus = [
    {
      status_id: "1",
      status_name: "ACTIVE",
    },
    {
      status_id: "2",
      status_name: "INACTIVE",
    },
  ];

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const styledCollapse = { backgroundColor: appConstant.MAIN_COLOR, color: "#FFFFFF" };

  const onFinish = async (values) => {
    const campaignData = {
      campaignDTO: {
        name: values.name,
        startDate: moment(values.startDate.$d).format(appConstant.DATE_CAMPAIGN_DTO_DATE_FORMAT),
        endDate: moment(values.endDate.$d).format(appConstant.DATE_CAMPAIGN_DTO_DATE_FORMAT),
        budget: values.budget,
        bidAmount: values.bidamount ? values.bidamount : 0,
        status: values.status === "ACTIVE",
      },
      creativesDTO: {
        title: values.title,
        description: values.description,
        finalUrl: values.final_url,
      },
    };
    try {
      const formData = new FormData();

      if (values.createpreview && values.createpreview.length > 0) {
        formData.append("file", values.createpreview[0].originFileObj);
      }

      formData.append("data", new Blob([JSON.stringify(campaignData)], { type: "application/json" }));

      const id = initialData.campaignId.toString();
      const token = window.localStorage.getItem("accessToken");
      const response = await editCampaign({ id, formData, token });
      if (response?.code === 400) {
        return message.error(response?.message);
      } else {
        message.success(response?.message);
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleStartDateChange = (value, date) => {
    if (date) {
      const formattedStartTimestamp = moment(date).format(appConstant.DATE_FORMAT).toString();
      setStartDate(formattedStartTimestamp);
      setEndDate(endDate);
    }
  };
  const handleEndDateChange = (value, date) => {
    if (date) {
      const formattedEndTimestamp = moment(date).format(appConstant.DATE_FORMAT).toString();
      setStartDate(startDate);
      setEndDate(formattedEndTimestamp);
    }
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
  return (
    <Modal
      title={appConstant.MODAL_EDIT_CAMPAIGN_TITLE}
      footer={[
        <div className="CreateAccountModal-footer" key="footer">
          <Button
            key="cancel"
            onClick={() => {
              form.resetFields();
              handleCancel();
            }}
          >
            {appConstant.BUTTON_CANCEL_TEXT}
          </Button>
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {appConstant.BUTTON_SUBMIT_TEXT}
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
        style={styledCollapse}
        className="custom-collapse"
      >
        <Panel header={<div style={styledCollapse}>{appConstant.PANEL_HEADER_DETAILS}</div>} key="1">
          <Form form={form} {...formItemLayout} labelAlign="left" onFinish={onFinish}>
            <FormSection
              label={appConstant.LABEL_CAMPAIGN_MODAL_NAME}
              name="name"
              rules={[{ required: false }, { validator: (_, value) => validators.validateName(value) }]}
            >
              <Input style={styledInput} />
            </FormSection>
            <StatusSelect
              label={appConstant.LABEL_CAMPAIGN_MODAL_STATUS}
              name="status"
              options={userStatus}
              styledInput={styledInput}
              rules={[{ required: true, message: errorMessage.ERROR_CAMPAIGN_BUDGET_REQUIRED }]}
            />
          </Form>
        </Panel>
      </Collapse>
      <Collapse
        defaultActiveKey={["2"]}
        accordion
        expandIconPosition="right"
        style={styledCollapse}
        className="custom-collapse"
      >
        <Panel header={<div style={styledCollapse}>{appConstant.PANEL_HEADER_SCHEDULE}</div>} key="2">
          <div className="schedule-panel-content">
            <div className="schedule-label">{appConstant.LABEL_CAMPAIGN_MODAL_SCHEDULE}</div>
            <Form form={form} {...formItemLayout} labelAlign="left" onFinish={onFinish}>
              <div className="date-picker-container">
                <DatePickerSection
                  label={appConstant.LABEL_CAMPAIGN_MODAL_STARTDATE}
                  name="startDate"
                  onChange={handleStartDateChange}
                  styledInput={styledInput}
                />
                <DatePickerSection
                  label={appConstant.LABEL_CAMPAIGN_MODAL_ENDDATE}
                  name="endDate"
                  disabledDate={disabledEndDate}
                  disabledTime={(current, type) => disabledEndDateTime(current, type)}
                  onChange={handleEndDateChange}
                  styledInput={styledInput}
                />
              </div>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <Collapse
        defaultActiveKey={["3"]}
        accordion
        expandIconPosition="right"
        style={styledCollapse}
        className="custom-collapse"
      >
        <Panel header={<div style={styledCollapse}>{appConstant.PANEL_HEADER_BUDGET}</div>} key="3">
          <Form form={form} {...formItemLayout} labelAlign="left" onFinish={onFinish}>
            <FormSection
              label={appConstant.LABEL_CAMPAIGN_MODAL_BUDGET}
              name="budget"
              rules={[
                { required: false },
                {
                  validator: (_, value) =>
                    validators.validateNumber(
                      value,
                      errorMessage.ERROR_CAMPAIGN_BUDGET_REQUIRED,
                      errorMessage.ERROR_CAMPAIGN_BUDGET_NUMBER_REQUIRED,
                      "Budget"
                    ),
                },
              ]}
            >
              <Input style={styledInput} />
            </FormSection>
          </Form>
        </Panel>
      </Collapse>
      <Collapse
        defaultActiveKey={["4"]}
        accordion
        expandIconPosition="right"
        style={styledCollapse}
        className="custom-collapse"
      >
        <Panel header={<div style={styledCollapse}>{appConstant.PANEL_HEADER_BIDDING}</div>} key="4">
          <Form form={form} {...formItemLayout} labelAlign="left" onFinish={onFinish}>
            <FormSection
              label={appConstant.LABEL_CAMPAIGN_MODAL_BIDAMOUNT}
              name="bidAmount"
              rules={[
                { required: false },
                { validator: (_, value) => validators.validateBidAmount(value, form.getFieldValue("budget")) },
              ]}
            >
              <Input style={styledInput} />
            </FormSection>
          </Form>
        </Panel>
      </Collapse>
      <Collapse
        defaultActiveKey={["5"]}
        accordion
        expandIconPosition="right"
        style={styledCollapse}
        className="custom-collapse"
      >
        <Panel header={<div style={styledCollapse}>{appConstant.PANEL_HEADER_CREATIVE}</div>} key="5">
          <Form form={form} {...formItemLayout} labelAlign="left" onFinish={onFinish}>
            <FormSection
              label={appConstant.LABEL_CAMPAIGN_MODAL_TITLE}
              name="title"
              rules={[{ required: false }, { validator: (_, value) => validators.validateTitle(value) }]}
            >
              <Input style={styledInput} />
            </FormSection>
            <FormSection
              label={appConstant.LABEL_CAMPAIGN_MODAL_DESCRIPTION}
              name="description"
              rules={[{ required: false }]}
            >
              <Input style={styledInput} />
            </FormSection>
            <FileUploadSection
              label={appConstant.LABEL_CAMPAIGN_MODAL_CREATIVE_PREVIEW}
              name="createpreview"
              rules={[{ required: true, message: errorMessage.ERROR_CAMPAIGN_IMAGE_REQUIRED }]}
              beforeUpload={beforeUpload}
              styledInput={styledInput}
            >
              <Upload showUploadList={false} beforeUpload={beforeUpload}>
                <Button style={styledInput} icon={<UploadOutlined />}>
                  {appConstant.BUTTON_UPLOAD_TEXT}
                </Button>
              </Upload>
            </FileUploadSection>
            {imageUrl && (
              <FormSection label={appConstant.LABEL_CAMPAIGN_MODAL_PREVIEW_IMAGE}>
                <div style={{ overflow: "hidden", marginLeft: "2.5em" }}>
                  <Image src={imageUrl} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </FormSection>
            )}
            <FormSection
              label={appConstant.LABEL_CAMPAIGN_MODAL_FINAL_URL}
              name="finalUrl"
              rules={[{ required: false }]}
            >
              <Input style={styledInput} />
            </FormSection>
          </Form>
        </Panel>
      </Collapse>
    </Modal>
  );
};
export default EditCampaignModal;
