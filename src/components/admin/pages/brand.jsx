import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Form,
  Upload,
  Space,
  message,
  Image,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useGetAllBrandsQuery,
  useAddBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} from "@/redux/features/admin/brandApi";
import { useUploadImageMutation } from "@/redux/features/admin/cloudinaryApi";

export default function Brand() {
  const [form] = Form.useForm();
  const { data, refetch } = useGetAllBrandsQuery();
  const [addBrand] = useAddBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const [uploadImage] = useUploadImageMutation();

  const [logoUrl, setLogoUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [editing, setEditing] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localBrands, setLocalBrands] = useState([]);

  const brands = localBrands.length > 0 ? localBrands : data?.result || [];

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData).unwrap();
      const url = res.data?.url || res.secure_url;
      setLogoUrl(url);
      onSuccess("ok");
    } catch (err) {
      console.error("❌ Upload failed", err);
      onError("error");
      message.error("Tải ảnh thất bại");
    }
  };

  const showEditModal = (record) => {
    setIsModalVisible(true);
    setEditing(record);
    setLogoUrl(record.logo || "");
    setPreview(record.logo || "");
    form.setFieldsValue(record);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditing(null);
    form.resetFields();
    setLogoUrl("");
    setPreview("");
  };

  const onFinish = async (values) => {
    try {
      if (editing) {
        // So sánh để chỉ gửi trường thay đổi
        const updateData = {};
        Object.keys(values).forEach((key) => {
          if (values[key] !== editing[key]) {
            updateData[key] = values[key];
          }
        });
        if (logoUrl && logoUrl !== editing.logo) {
          updateData.logo = logoUrl;
        }

        if (Object.keys(updateData).length > 0) {
          await updateBrand({ id: editing.id, data: updateData }).unwrap();
          message.success("Cập nhật brand thành công");
        } else {
          message.info("Không có thay đổi nào");
        }
      } else {
        const res = await addBrand({ ...values, logo: logoUrl }).unwrap();
        message.success("Thêm brand thành công");
        const newBrand = {
            id: res.result.id,
            name: res.result.name || "No name",
            email: res.result.email || "",
            website: res.result.website || "",
            location: res.result.location || "",
            logo: res.result.logo || "https://via.placeholder.com/40",
          };

          setLocalBrands([newBrand, ...brands]);
      }
      handleCloseModal();
      refetch();
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBrand(id).unwrap();
      message.success("Xoá thành công");
      refetch();
      setLocalBrands(brands.filter((b) => b.id !== id));
    } catch {
      message.error("Không thể xoá");
    }
  };

  const columns = [
    {
      title: "NAME",
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          <Image src={record?.logo} width={30} height={30} />
          <strong>{record.name}</strong>
        </Space>
      ),
    },
    { title: "EMAIL", dataIndex: "email" },
    { title: "WEBSITE", dataIndex: "website" },
    { title: "LOCATION", dataIndex: "location" },
    {
      title: "ACTION",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Thêm Brand
      </Button>
      <Table
        columns={columns}
        dataSource={brands}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={isModalVisible}
        title={editing ? "Cập nhật Brand" : "Thêm Brand"}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
      >
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          accept=".jpg,.png,.jpeg,.webp"
        >
          <Button icon={<UploadOutlined />}>Upload Logo</Button>
        </Upload>
        {preview && <Image src={preview} width={80} style={{ marginTop: 8 }} />}

        <Form layout="vertical" onFinish={onFinish} form={form} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editing ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
