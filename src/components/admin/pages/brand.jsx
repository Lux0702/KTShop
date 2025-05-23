import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Form,
  Upload,
  Select,
  Pagination,
  Space,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Brand = () => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([
    {
      id: "#154ee693",
      name: "Deepcool",
      email: "deepcool@gmail.com",
      website: "deepcool.com",
      location: "Deepcool, US",
      image: "https://picsum.photos/seed/deepcool/50/50",
    },
    {
      id: "#15479cfb",
      name: "Apple",
      email: "apple@gmail.com",
      website: "apple.com",
      location: "Apple, US",
      image: "https://picsum.photos/seed/apple/50/50",
    },
    {
      id: "#153eb370",
      name: "Samsung",
      email: "samsung@gmail.com",
      website: "samsung.com",
      location: "Samsung, US",
      image: "https://picsum.photos/seed/samsung/50/50",
    },
    {
      id: "#1522d9cd",
      name: "Sony",
      email: "sony@gmail.com",
      website: "sony.com",
      location: "Apples, America",
      image: "https://picsum.photos/seed/sony/50/50",
    },
    {
      id: "#5121b374",
      name: "Logitech",
      email: "logitech@gmail.com",
      website: "logitech.com",
      location: "Apples, Switzerland",
      image: "https://picsum.photos/seed/logitech/50/50",
    },
  ]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <img src={record.image} alt="logo" width={30} height={30} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "WEBSITE",
      dataIndex: "website",
      key: "website",
    },
    {
      title: "LOCATION",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />}  />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    const newBrand = {
      ...values,
      id: `#${Math.random().toString(16).slice(2, 10)}`,
      image: "https://picsum.photos/seed/newbrand/50/50",
    };
    setBrands([...brands, newBrand]);
    form.resetFields();
    message.success("Brand added");
  };

  return (
    <div style={{ display: "flex", gap: 16, padding: 24 }}>
      <div
        style={{ flex: 2, background: "#fff", padding: 20, borderRadius: 8,maxWidth: 500 }}
      >
        <h3>Upload Image</h3>
        <Upload
          beforeUpload={() => false}
          accept=".png,.jpg,.jpeg,.webp"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>

        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          className="mt-4"
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="website" label="Website">
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="location" label="Location">
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="description" label="Description">
            {" "}
            <Input.TextArea rows={2} />{" "}
          </Form.Item>
          <Form.Item name="status" label="Status">
            {" "}
            <Select placeholder="Select...">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>{" "}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Brand
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div style={{ flex: 1 }}>
        <Table
          columns={columns}
          dataSource={brands}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default Brand;
