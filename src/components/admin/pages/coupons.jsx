// components/admin/CouponManager.jsx
import React, { useState } from "react";
import {
  Table, Button, Tag, Input, Image, Space, Modal, Form, DatePicker, InputNumber, Select, Upload, message
} from "antd";
import {
  EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetCouponsQuery,
  useAddCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "@/redux/features/coupon/couponApi";
import Loader from "@/components/loader/loader";
export default function CouponManager() {
  const { data, isLoading } = useGetCouponsQuery();
  const coupons = data || [];
  const [addCoupon, {isLoading: isAdding}] = useAddCouponMutation();
  const [updateCoupon, {isLoading: isUpdating}] = useUpdateCouponMutation();
  const [deleteCoupon, {isLoading: isDeleting}] = useDeleteCouponMutation();

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [searchText, setSearchText] = useState("");

  const showModal = (record = null) => {
    setVisible(true);
    setEditing(record);
    if (record) {
      form.setFieldsValue({
        ...record,
        dateRange: [record.start_time ? dayjs(record.start_time) : null, record.end_time ? dayjs(record.end_time) : null],
      });
      setLogoUrl(record.logo || "");
    } else {
      form.resetFields();
      setLogoUrl("");
    }
  };

  const handleDelete = async (id) => {
    await deleteCoupon(id);
  };

  const handleSubmit = async (values) => {

  const payload = {
    ...values,
    logo: logoUrl,
    start_time: values.dateRange?.[0]?.toISOString() || null,
    end_time: values.dateRange?.[1]?.toISOString() || null,
  };
  delete payload.dateRange;

  // ⚠️ Kiểm tra thiếu thời gian kết thúc
  if (!payload.start_time || !payload.end_time) {
    message.error("Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc");
    return;
  }

  try {
    if (editing) {
      const data = {};
      for (let key in payload) {
        if (payload[key] !== editing[key]) data[key] = payload[key];
      }
      if (Object.keys(data).length > 0) {
        await updateCoupon({ id: editing.id, data }).unwrap();
        message.success("Cập nhật thành công");
      } else {
        message.info("Không có thay đổi");
      }
    } else {
      await addCoupon(payload).unwrap();
      message.success("Thêm thành công");
    }

    setVisible(false);
    setEditing(null);
    form.resetFields();
    setLogoUrl("");
  } catch (err) {
    console.error(err);
    message.error("Thao tác thất bại");
  }
  
};

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("https://ktshop.onrender.com/api/cloudinary/add-img", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      const url = result.data?.url || result.secure_url;
      setLogoUrl(url);
      onSuccess("ok");
    } catch (err) {
      onError("error");
    }
  };

  const filteredCoupons = coupons.filter(c =>
    c.title?.toLowerCase().includes(searchText.toLowerCase()) ||
    c.coupon_code?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "NAME",
      dataIndex: "title",
      render: (text, record) => (
        <Space>
          <Image src={record.logo} width={40} />
          {text}
        </Space>
      ),
    },
    {
      title: "CODE",
      dataIndex: "coupon_code",
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: "AMOUNT",
      dataIndex: "discount_percentage",
      render: (val) => `${val}%`,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "START",
      dataIndex: "start_time",
      render: (date) => date ? dayjs(date).format("MMM D, YYYY") : "-",
    },
    {
      title: "END",
      dataIndex: "end_time",
      render: (date) => date ? dayjs(date).format("MMM D, YYYY") : "-",
    },
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
      {(isAdding || isUpdating || isLoading || isDeleting) && (
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
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by coupon name"
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Coupon
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredCoupons}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={visible}
        title={editing ? "Edit Coupon" : "Add Coupon"}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Upload
          customRequest={handleUpload}
          showUploadList={true}
          accept=".jpg,.png,.jpeg,.webp"
        >
          <Button icon={<UploadOutlined />}>Upload Logo</Button>
        </Upload>
        {logoUrl && <Image src={logoUrl} width={80} style={{ marginTop: 8 }} />}

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          style={{ marginTop: 16 }}
          initialValues={{ product_type: "fashion" }}
        >
          <Form.Item name="title" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="coupon_code"
            label="Code"
            rules={[{ required: true }]}
          >
            <Input maxLength={9} />
          </Form.Item>
          <Form.Item
            name="discount_percentage"
            label="Discount %"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} max={100} />
          </Form.Item>
          <Form.Item name="minimum_amount" label="Minimum Order">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="product_type"
            label="Product Type"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="expired">Expired</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Start - End"
            rules={[{ required: true }]}
          >
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              {editing ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
