// pages/category.js
import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Upload,
  Form,
  Select,
  Tag,
  Pagination,
  Space,
  Modal,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const initialData = [
  {
    id: "#19723bd7",
    name: "Bluetooth",
    image: "/img1.png",
    productType: "/electronics",
    items: 2,
  },
  {
    id: "#19723bd7",
    name: "Smart Watch",
    image: "/img2.png",
    productType: "/electronics",
    items: 3,
  },
  {
    id: "#19723bd7",
    name: "CPU Heat Pipes",
    image: "/img3.png",
    productType: "/electronics",
    items: 2,
  },
  {
    id: "#19723bd7",
    name: "Mobile Tablets",
    image: "/img4.png",
    productType: "/electronics",
    items: 3,
  },
  {
    id: "#1d424bdb",
    name: "Headphones",
    image: "/img5.png",
    productType: "/electronics",
    items: 9,
  },
];

const Category = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "NAME",
      dataIndex: "name",
      render: (text, record) => (
        <Space>
          <img
            src={record.image}
            alt="thumb"
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: "PRODUCT TYPE",
      dataIndex: "productType",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "ITEMS",
      dataIndex: "items",
    },
    {
      title: "ACTION",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    const newItem = {
      id: `#${Math.random().toString(16).substr(2, 8)}`,
      name: values.name,
      image: "/img1.png",
      productType: values.productType,
      items: Math.floor(Math.random() * 10),
    };
    setData([newItem, ...data]);
    form.resetFields();
  };

  return (
    <div style={{ display: "flex", gap: 16, padding: 24 }}>
      {/* Form */}
      <div
        style={{ flex: 1, background: "#fff", padding: 20, borderRadius: 8 }}
      >
        <h3>Upload Image</h3>
        <Upload
          name="image"
          listType="picture-card"
          maxCount={1}
          accept="image/png,image/jpeg,image/webp"
        >
          <UploadOutlined /> Upload
        </Upload>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Parent" rules={[{ required: true }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="children" label="Children">
            <Input placeholder="Enter children" />
          </Form.Item>
          <Form.Item
            name="productType"
            label="Product Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select..">
              <Option value="/electronics">/electronics</Option>
              <Option value="/books">/books</Option>
              <Option value="/clothing">/clothing</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea placeholder="Description here" autoSize />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add Category
          </Button>
        </Form>
      </div>

      {/* Table */}
      <div
        style={{ flex: 2, background: "#fff", padding: 20, borderRadius: 8 }}
      >
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Pagination
            current={page}
            onChange={setPage}
            total={15}
            pageSize={5}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;
