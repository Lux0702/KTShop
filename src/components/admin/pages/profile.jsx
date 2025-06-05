import React, { useState, useEffect, use } from "react";
import { Upload, Button, Input, Select, Form, message, Row, Col, Typography, Divider, Avatar } from "antd";
import {
  UploadOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import {
  useUpdateStaffMutation,
  useChangePasswordMutation,
} from "@/redux/features/admin/staffApi";
import Loader from "@/components/loader/loader";
import { useUploadImageMutation } from "@/redux/features/admin/cloudinaryApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/features/admin/userSlice";
export default function ProfilePage() {
  const [form] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState("https://placehold.co/400");
  const user = useSelector((state) => state.adminUser.user);

  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [changePassword, { isLoading, isError, isSuccess }] =
    useChangePasswordMutation();
    const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("adminUser") || "{}");
    if (user) {
      form.setFieldsValue({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "Admin",
      });
      setAvatarUrl(user.image);
    }
  }, []);

  const handlePasswordSubmit = async () => {
    try {
      const values = await securityForm.validateFields();
      const { oldPass, newPass, confirmPassword } = values;
      if (newPass !== confirmPassword) {
        message.warning("New password and confirmation do not match.");
        return;
      }
      const user = JSON.parse(localStorage.getItem("adminUser") || "{}");
      if (!user?.email) {
        message.error("User email not found.");
        return;
      }

      await changePassword({
        email: user.email,
        oldPass,
        newPass,
      }).unwrap();
      message.success("Password changed successfully");
      securityForm.resetFields();
    } catch (err) {
      message.error("Failed to change password");
    }
  };
  const handleBasicSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { name, email, phone, role } = values;

      if (!name || !email) {
        message.warning("Name và Email là bắt buộc.");
        return;
      }

      const updated = {};
      if (name !== user.name) updated.name = name;
      if (phone !== user.phone) updated.phone = phone;
      if (role !== user.role) updated.role = role;
      // if (avatarUrl !== user.image) updated.image = avatarUrl;

      if (Object.keys(updated).length === 0) {
        message.info("Không có thay đổi nào");
        return;
      }

      await updateStaff({
        id: user._id,
        data: { ...updated , email: user.email },
      }).unwrap();

      message.success("Cập nhật thông tin thành công");
      // localStorage.setItem(
      //   "adminUser",
      //   JSON.stringify({ ...user, ...updated })
      // );
      dispatch(setUser({ ...user, ...updated }));
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData).unwrap();
      const imageUrl = res.data?.url || res.secure_url;

      setAvatarUrl(imageUrl);
      message.success("Tải ảnh lên thành công");

      if (user?.name && user?.email) {
        const updateData = {
          name: user.name,
          email: user.email,
          image: imageUrl,
        };
        await updateStaff({ id: user._id, data: updateData }).unwrap();

        const updatedUser = { ...user, image: imageUrl };
        localStorage.setItem("adminUser", JSON.stringify(updatedUser));
        dispatch(setUser(updatedUser));
        setAvatarUrl(imageUrl);
      }

      onSuccess("ok");
    } catch (err) {
      console.error("Upload thất bại:", err);
      message.error("Tải ảnh thất bại");
      onError("error");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {(isLoading || isUpdating || isUploading) && (
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
      <Typography.Title level={2}>My Profile</Typography.Title>

      <div
        style={{
          position: "relative",
          width: 128,
          height: 128,
          marginBottom: 24,
        }}
      >
        <Avatar
          size={128}
          src={avatarUrl || "https://placehold.co/400"}
          style={{ border: "1px solid #d9d9d9" }}
        />
        <Upload
          showUploadList={false}
          customRequest={handleUpload}
          accept="image/*"
        >
          <Button
            type="primary"
            shape="circle"
            icon={<CameraOutlined />}
            style={{ position: "absolute", bottom: 0, right: 0 }}
          />
        </Upload>
      </div>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography.Title level={4}>Basic Information</Typography.Title>
            <Divider />
            <Form layout="vertical" form={form} onFinish={handleBasicSubmit}>
              <Form.Item name="name" label="Name">
                <Input placeholder="Enter name" />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input placeholder="Enter email" disabled />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="Enter phone" />
              </Form.Item>
              <Form.Item name="role" label="Role">
                <Select placeholder="Select role">
                  <Select.Option value="CEO">CEO</Select.Option>
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="Manager">Manager</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography.Title level={4}>Security</Typography.Title>
            <Divider />
            <Form
              layout="vertical"
              form={securityForm}
              onFinish={handlePasswordSubmit}
            >
              <Form.Item
                name="oldPass"
                label="Current Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password",
                  },
                ]}
              >
                <Input.Password placeholder="Current Password" />
              </Form.Item>
              <Form.Item
                name="newPass"
                label="New Password"
                rules={[
                  { required: true, message: "Please enter a new password" },
                ]}
              >
                <Input.Password placeholder="New Password" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}
