import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  message,
  Upload,
  Image,
  DatePicker
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useGetAllStaffsQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "@/redux/features/admin/staffApi";
import { useUploadImageMutation } from "@/redux/features/admin/cloudinaryApi";
import dayjs from "dayjs";

export default function StaffManager() {
  const { data, refetch } = useGetAllStaffsQuery();
  const staffs = data?.data || [];
  const [addStaff] = useAddStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();
  const [uploadImage] = useUploadImageMutation();

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [search, setSearch] = useState("");

  const showModal = (record = null) => {
  setVisible(true);
  setEditing(record);
  setAvatarUrl(record?.image || "");
  if (record) {
    form.setFieldsValue({ ...record });
  } else {
    form.resetFields();
  }
};


  const handleDelete = async (id) => {
    try {
      await deleteStaff(id).unwrap();
      message.success("Deleted successfully");
      refetch();
    } catch {
      message.error("Delete failed");
    }
  };

const handleSubmit = async (values) => {
  const payload = {
    name: values.name || editing?.name,
    email: values.email || editing?.email,
    phone: values.phone,
    role: values.role,
    image: avatarUrl,
  };

  if (!editing) {
    // Khi tạo mới thì cần password
    payload.password = values.password;
  }
  console.log("payload,",payload)
  try {
    if (editing) {
      
      if (Object.keys(payload).length > 0) {
        await updateStaff({ id: editing.id, data: payload }).unwrap();
        message.success("Updated successfully");
      } else {
        message.info("No changes made");
      }
    } else {
      await addStaff(payload).unwrap();
      message.success("Added successfully");
    }
    refetch();
    handleClose();
  } catch {
    message.error("Operation failed");
  }
};




const handleUpload = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const res = await uploadImage(formData).unwrap();
    const imageUrl = res.data?.url;
    setAvatarUrl(imageUrl);
    onSuccess("ok");
    message.success("Image uploaded");
  } catch (err) {
    console.error(err);
    onError("error");
    message.error("Upload failed");
  }
};



  const handleClose = () => {
    setVisible(false);
    setEditing(null);
    form.resetFields();
    setAvatarUrl("");
  };

  const filteredData = staffs.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "NAME",
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          <Image src={record.image || "https://via.placeholder.com/40"} width={40} />
          <strong>{record.name}</strong>
        </Space>
      ),
    },
    { title: "EMAIL", dataIndex: "email" },
    { title: "CONTACT", dataIndex: "phone" },
    { title: "STATUS", dataIndex: "status" },
    { title: "ROLE", dataIndex: "role" },
    {
      title: "ACTION",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by name"
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={() => showModal()}>Add Staff</Button>
      </Space>
      <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 5 }} />

      <Modal open={visible} title={editing ? "Edit Staff" : "Add Staff"} onCancel={handleClose} footer={null}>
        <Upload
            customRequest={handleUpload}
            showUploadList={false}
            accept=".jpg,.png,.jpeg,.webp"
          >
            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
          </Upload>
          {avatarUrl && (
            <Image
              src={avatarUrl}
              width={80}
              style={{ marginTop: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
          )}

        <Form layout="vertical" onFinish={handleSubmit} form={form} style={{ marginTop: 16 }}>
         <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="phone" label="Phone"><Input /></Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
                <Select.Option value="Admin">Admin</Select.Option>
                <Select.Option value="Manager">Manager</Select.Option>
                <Select.Option value="CEO">CEO</Select.Option>
            </Select>
            </Form.Item>
            {!editing && (
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password />
            </Form.Item>
            )}

          <Form.Item> <Button htmlType="submit" type="primary" block>{editing ? "Update" : "Add"}</Button> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
