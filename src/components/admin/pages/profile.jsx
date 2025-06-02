import React, { useState } from "react";
import { Upload, Button, Input, Select, Form, message, Row, Col, Typography, Divider, Avatar } from "antd";
import { UploadOutlined, CameraOutlined } from "@ant-design/icons";

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState("https://via.placeholder.com/150");

  const handleUpload = ({ file }) => {
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    message.success("Uploaded");
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>My Profile</Typography.Title>

      <div style={{ position: "relative", width: 128, height: 128, marginBottom: 24 }}>
        <Avatar size={128} src={avatarUrl} style={{ border: '1px solid #d9d9d9' }} />
        <Upload showUploadList={false} customRequest={handleUpload}>
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
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Typography.Title level={4}>Basic Information</Typography.Title>
            <Divider />
            <Form layout="vertical" form={form}>
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
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Save</Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Typography.Title level={4}>Security</Typography.Title>
            <Divider />
            <Form layout="vertical" form={securityForm}>
              <Form.Item name="currentPassword" label="Current Password">
                <Input.Password placeholder="Current Password" />
              </Form.Item>
              <Form.Item name="newPassword" label="New Password">
                <Input.Password placeholder="New Password" />
              </Form.Item>
              <Form.Item name="confirmPassword" label="Confirm Password">
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Save</Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}
