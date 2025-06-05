import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/features/admin/userSlice"; 
const { Title } = Typography;

export default function AdminLogin({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
const router = useRouter();
 const dispatch = useDispatch();
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post("https://ktshop.onrender.com/api/admin/login", values); // API tuỳ backend
      if (res.data?.token) {
        localStorage.setItem("adminToken", res.data.token);
        // localStorage.setItem("adminUser", JSON.stringify(res.data)); // 💥 thêm dòng này
        dispatch(setUser(res.data)); 
        message.success("Login successful!");
        router.push("/admin/dashboard");
        }
 else {
        message.error("Login failed. Invalid credentials.");
      }
    } catch (error) {
      console.error(error);
      message.error("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", background: "#f0f2f5"
    }}>
      <div style={{ width: 360, padding: 32, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #ccc" }}>
        <Title level={3} style={{ textAlign: "center" }}>Admin Login</Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<UserOutlined />} placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
