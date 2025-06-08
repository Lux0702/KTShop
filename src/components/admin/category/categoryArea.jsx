import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Space,
  Tag,
  Pagination,
  Image,
  Drawer,
  message,
  Form,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useUploadImageMutation } from "@/redux/features/admin/cloudinaryApi";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/features/admin/categoryApi";

import CategoryForm from "@/components/admin/category/CategoryForm";

import Loader from "@/components/loader/loader";
const CategoryArea = ({ dataCategory }) => {
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [data, setData] = useState(dataCategory);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [previewAdd, setPreviewAdd] = useState("");
  const [previewEdit, setPreviewEdit] = useState("");

  const [uploadImage] = useUploadImageMutation();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();


  const onFinishAdd = async (values) => {
    try {
      const response = await addCategory({
        parent: values.name,
        img: values.imageUrl || "https://placehold.co/300x300",
        children: values.children,
        description: values.description,
        product_type: values.productType,
        status: "Show",
      }).unwrap();

      setData([response.data, ...data]);
      message.success("Thêm danh mục thành công");
      formAdd.resetFields();
      setPreviewAdd("");
    } catch (error) {
      message.error(error.data?.message || "Thêm danh mục thất bại");
    }
  };

  const onFinishEdit = async (values) => {
    try {
      const updated = {};
      if (values.name !== editingCategory.parent) updated.parent = values.name;
      if (values.imageUrl !== editingCategory.img)
        updated.img = values.imageUrl;
      if (
        JSON.stringify(values.children || []) !==
        JSON.stringify(editingCategory.children || [])
      ) {
        updated.children = values.children;
      }
      if (values.description !== editingCategory.description)
        updated.description = values.description;
      if (values.status && values.status !== editingCategory.status)
        updated.status = values.status;

      if (Object.keys(updated).length === 0) {
        message.info("Không có thay đổi nào");
        return;
      }
      const res = await updateCategory({
        id: editingCategory.id,
        data: updated,
      }).unwrap();

      setData((prev) =>
        prev.map((item) =>
          item.id === editingCategory.id
            ? { ...item, ...res.result }
            : item
        )
      );
      
      message.success("Cập nhật danh mục thành công");
      formEdit.resetFields();
      setEditingCategory(null);
      setOpenDrawer(false);
      setPreviewEdit("");
    } catch (error) {
      message.error(error.data?.message || "Cập nhật danh mục thất bại");
    }
  };
  

  const columns = [
    {
      title: "NAME",
      dataIndex: "parent",
      render: (text, record) => (
        <Space>
          <Image
            src={record.img}
            alt="thumb"
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
          <strong style={{marginLeft:'10px'}}>{text}</strong>
        </Space>
      ),
    },
    {
      title: "ITEMS",
      render: (_, record) => record.products?.length || 0,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Show" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "ACTION",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record);
              setPreviewEdit(record.img || "");
              setOpenDrawer(true);
              setTimeout(() => {
                formEdit.setFieldsValue({
                  name: record.parent,
                  children: record.children || [],
                  description: record.description,
                  status: record.status,
                  image: [
                    {
                      uid: "-1",
                      name: "current",
                      status: "done",
                      url: record.img,
                    },
                  ],
                  imageUrl: record.img,
                });
              }, 100);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => {
              Modal.confirm({
                title: "Xác nhận xóa",
                content: `Bạn có chắc muốn xóa danh mục "${record.parent}" không?`,
                okText: "Xóa",
                okType: "danger",
                cancelText: "Hủy",
                onOk: async () => {
                try {
                  console.log("record.id",record.id)
                  await deleteCategory(record.id).unwrap();
                  setData((prev) => prev.filter((item) => item.id !== record.id));
                  message.success("Xóa danh mục thành công");
                } catch (err) {
                  message.error("Xóa thất bại: " + (err?.data?.message || "Có lỗi xảy ra"));
                }
              },

              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 24 }}>
        <Input
          placeholder="Search by Category name"
          onChange={(e) => setQ(e.target.value)}
          value={q}
          style={{ maxWidth: 200 }}
        />
      </div>
      <div style={{ display: "flex", gap: 16, padding: 24 }}>
        <div
          style={{ flex: 1, background: "#fff", padding: 20, borderRadius: 8 }}
        >
          <h3>Add Category</h3>
          <CategoryForm
            form={formAdd}
            onFinish={onFinishAdd}
            preview={previewAdd}
            setPreview={setPreviewAdd}
            uploadImage={uploadImage}
          />
        </div>
        <div
          style={{ flex: 2, background: "#fff", padding: 20, borderRadius: 8 }}
        >
          <Table
            dataSource={data
              .filter((item) =>
                item?.parent?.toLowerCase().includes(q.toLowerCase())
              )
              .slice((page - 1) * 5, page * 5)}
            columns={columns}
            rowKey="id"
            pagination={false}
            expandable={{ expandIcon: () => null }}
          />
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Pagination
              current={page}
              onChange={setPage}
              total={data.length}
              pageSize={5}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <Drawer
        title="Chỉnh sửa danh mục"
        placement="right"
        width={400}
        onClose={() => {
          setOpenDrawer(false);
          formEdit.resetFields();
          setPreviewEdit("");
        }}
        open={openDrawer}
      >
        <div style={{ padding: 24 }}>
          {(isAdding || isUpdating || isDeleting) && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255,255,255,0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              <Loader loading spinner="fade" />
            </div>
          )}

          <CategoryForm
            form={formEdit}
            onFinish={onFinishEdit}
            preview={previewEdit}
            setPreview={setPreviewEdit}
            uploadImage={uploadImage}
            isEdit
          />
        </div>
      </Drawer>
    </>
  );
};

export default CategoryArea;
