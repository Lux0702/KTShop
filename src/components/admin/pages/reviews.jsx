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
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from "@/redux/features/admin/reviewApi";
import Loader from "@/components/loader/loader";
export default function Reviews() {
  const [form] = Form.useForm();
 
  const { data, refetch, isLoading } = useGetAllReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();

  const [logoUrl, setLogoUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [editing, setEditing] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
    const [localBrands, setLocalBrands] = useState([]);
  

  const reviews = localBrands.length > 0 ? localBrands : data || [];


  const handleDelete = async (id) => {
    try {
      await deleteReview(id).unwrap();
      message.success("Xoá thành công");
      refetch();
      setLocalBrands(brands.filter((b) => b.id !== id));
    } catch {
      message.error("Không thể xoá");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      // render: (_, record) => (
      //   <Space>
      //     <Image src={record.logo} width={30} height={30} />
      //     <strong>{record.name}</strong>
      //   </Space>
      // ),
    },
    { title: "RATING", dataIndex: "rating" },
    { title: "COMMENT", dataIndex: "comment" },
   
    {
      title: "ACTION",
      render: (_, record) => (
        <Space>
         
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {isLoading && (
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
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
