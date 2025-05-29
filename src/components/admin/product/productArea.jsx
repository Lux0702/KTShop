import React, { useState, useMemo } from "react";
import { Table, Input, Button, Tag, Space, Rate, Image } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

export default function ProductsArea({ dataProduct = [] }) {
  const [q, setQ] = useState("");
  const safeData = useMemo(() => (
    Array.isArray(dataProduct) ? dataProduct : []
  ), [dataProduct]);
  
  const filteredData = useMemo(() => {
    const query = q.toLowerCase();
    return safeData.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category_name.toLowerCase().includes(query)
      );
    });
  }, [safeData, q]);

  const tableDataSource = useMemo(() => {
    return [...filteredData];
  }, [filteredData]);
  const columns = [
    {
      title: "PRODUCT",
      key: "product",
      render: (_, record) => (
        <Space>
          <Image
            src={record.image_urls?.[0]?.img}
            alt="product"
            width={50}
            height={50}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
          <span style={{ fontWeight: 500 }}>{record.title}</span>
        </Space>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "RATING",
      dataIndex: "reviews",
      key: "reviews",
      render: (reviews) => {
        if (!reviews?.length) return "No rating";
        const avgRating =
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
        return <Rate disabled allowHalf defaultValue={avgRating} />;
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "in-stock" ? (
          <Tag color="green">in-stock</Tag>
        ) : (
          <Tag color="red">out-of-stock</Tag>
        ),
    },
    {
      title: "ACTION",
      key: "action",
      render: () => (
        <Space>
          <Button icon={<EditOutlined />} type="primary" />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];
  
  const simpleData = [{ id: 1, name: "Test" }];
  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm, SKU, hoặc danh mục"
          onChange={(e) => setQ(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm sản phẩm
        </Button>
      </Space>
      {/* <Table
        dataSource={simpleData}
        columns={[{ title: "Name", dataIndex: "name" }]}
      /> */}
      <Table
        columns={columns}
        dataSource={tableDataSource}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </>
  );
}
