import React, { useState, useMemo, useEffect } from "react";
import { Table, Input, Button, Tag, Space, Rate, Image, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import DrawerArea from "@/components/admin/drawer/drawerArea";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/redux/features/admin/productApi";
import { message, Popconfirm } from "antd";
import { useGetProductQuery } from "@/redux/features/productApi";

const init = [
  {
    img: "https://via.placeholder.com/200?text=T-Shirt",
    title: "Basic T-Shirt",
    sku: "TSHIRT001",
    quantity: 150,
    price: "19.99",
    status: "in-stock",
    category_name: "Clothing",
  },
];
export default function ProductsArea({ dataProduct = init || [] }) {
  const [productList, setProductList] = useState(dataProduct || []);

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
const [updateProduct] = useUpdateProductMutation();
const [deleteProduct] = useDeleteProductMutation();

const [selectedId, setSelectedId] = useState(null);
const { data: productData, isFetching } = useGetProductQuery(selectedId, {
  skip: !selectedId,
});

const handleEdit = (record) => {
  setSelectedId(record.id);
};

useEffect(() => {
  if (productData) {
    setEditingProduct(productData);
    setOpen(true);
  }
}, [productData]);

const handleDelete = async (id) => {
  try {
    await deleteProduct(id).unwrap();
    message.success("Xoá sản phẩm thành công");
  } catch (error) {
    console.error(error);
    message.error("Xoá thất bại");
  }
};

    const showDrawer = () => {
      setOpen(true);
    };
const onClose = (updatedItem) => {
  setOpen(false);
  setEditingProduct(null);
  setSelectedId(null);

  // Cập nhật dữ liệu nếu có update
  if (updatedItem) {
    setProductList(prev =>
      prev.map(p => (p.id === updatedItem.id ? { ...p, ...updatedItem } : p))
    );
  }
};


  // 2. Chuẩn hóa dữ liệu với Type Checking
  const normalizedData = useMemo(() => {
    try {
      if (!Array.isArray(productList)) return initData;

      return productList.map((item) => ({
        id: Number(item.id) || Math.random(),
        img: String(item.img || "https://via.placeholder.com/50"),
        title: String(item.title || "No Title"),
        sku: String(item.sku || "N/A"),
        quantity: Number(item.quantity) || 0,
        price: String(item.price || "0.00"),
        status: ["in-stock", "out-of-stock"].includes(item.status)
          ? item.status
          : "unknown",
        category_name: String(item.category_name || ""),
      }));
    } catch (error) {
      console.error("Data normalization failed:", error);
      return initData;
    }
  }, [productList]);

  // 3. Filter với kiểm tra an toàn
const filteredData = useMemo(() => {
  const query = q.toLowerCase();
  return normalizedData.filter((item) => {
    try {
      return (
        item.title.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        (item.category_name &&
          item.category_name.toLowerCase().includes(query))
      );
    } catch {
      return false;
    }
  });
}, [normalizedData, q]);


  // 4. Columns đơn giản nhất có thể
  const columns = [
    {
      title: "PRODUCT",
      render: (_, record) => (
        <Space>
          <Image
            src={record.img}
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
            preview={false}
            alt="Img"
          />
          <span>{record.title}</span>
        </Space>
      ),
    },
    { title: "SKU", dataIndex: "sku" },
    { title: "QTY", dataIndex: "quantity" },
    { title: "PRICE", dataIndex: "price", render: (price) => `$${price}` },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "in-stock" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
  title: "ACTION",
  render: (_, record) => (
    <Space>
      <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
      <Popconfirm
        title="Bạn có chắc muốn xoá sản phẩm này?"
        onConfirm={() => handleDelete(record.id)}
        okText="Xoá"
        cancelText="Huỷ"
      >
        <Button icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </Space>
  ),
}

  ];
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Input.Search
          placeholder="Search by product name"
          onSearch={setQ}
          value={q}
          style={{ maxWidth: 300 }}
          onChange={(e) => setQ(e.target.value)}
        />
        <Space>
          <span>Status:</span>
          {/* <Select
            placeholder="Status"
            allowClear
            onChange={setFilter}
            style={{ width: 120 }}
          >
            <Option value="in">in-stock</Option>
            <Option value="out">out-of-stock</Option>
          </Select> */}
          <Button icon={<PlusOutlined />} type="primary" onClick={showDrawer}>
            Add Product
          </Button>
        </Space>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "No products found" }}
      />
<DrawerArea
  open={open}
  onClose={onClose}
  onAddSuccess={(newProduct) => {
    setProductList(prev => [newProduct, ...prev]);
  }}
  initialValues={editingProduct}
/>

    </Space>

  );
}
