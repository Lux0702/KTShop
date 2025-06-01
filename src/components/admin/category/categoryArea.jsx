// pages/category.js
import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Upload,
  Form,
  Select,
  Tag,
  Pagination,
  Space,
  Modal,
  Image,
  message,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
const { TextArea } = Input;
const { Option } = Select;
import {useUploadImageMutation} from "@/redux/features/admin/cloudinaryApi";
import {useAddCategoryMutation} from "@/redux/features/admin/categoryApi";
  
const CategoryArea = ({dataCategory}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataCategory);
  const [page, setPage] = useState(1);
  const [uploadImage] = useUploadImageMutation();
  const [addCategory] = useAddCategoryMutation();
  const [q, setQ] = useState("");

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    // },
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
          <strong>{text}</strong>
        </Space>
      ),
    },
    // {
    //   title: "CHILDREN",
    //   dataIndex: "children",
    //   render: (children) => (
    //     <div style={{ maxWidth: 200 }}>
    //       {children.map((child, index) => (
    //         <Tag key={index} color="blue">
    //           {child}
    //         </Tag>
    //       ))}
    //     </div>
    //   ),
    // },
    // {
    //   title: "PRODUCT TYPE",
    //   dataIndex: "product_type",
    //   render: (type) => <Tag color="purple">{type}</Tag>,
    // },
    {
      title: "ITEMS",
      render: (_, record) => record.products?.length || 0,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Show" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "ACTION",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];


  const onFinish = async (values) => {
    console.log("Form values before API call:", values, values.children);

    try {
      // Gọi API addCategory
      const response = await addCategory({
        parent: values.name,
        img: values.imageUrl || 'https://placehold.co/300x300',
        children: values.children,
        description: values.description,
        product_type: values.productType,
        status: "Show",
      }).unwrap();

      // Cập nhật state với dữ liệu mới từ server
      setData([response.data, ...data]);
      form.resetFields();
      message.success('Thêm danh mục thành công');
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      message.error(error.data?.message || 'Thêm danh mục thất bại');
    }
  };

const handleUpload = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await uploadImage(formData).unwrap();
    console.log("Upload success:", res);
    
    // Lưu URL ảnh vào form
    form.setFieldsValue({ 
      imageUrl: res.data.url,
      image: [{ uid: file.uid, name: file.name, status: 'done', url: res.data.url }]
    });
    
    onSuccess(res.data.url);
  } catch (error) {
    console.error("Upload failed", error);
    onError(error);
  }
};

  return (
    <>
      <div style={{ justifyContent: "flex-end", width: "100%",display:'flex',paddingLeft:24, paddingRight:24  }}>
        <Input
          placeholder="Search by Category name"
          onChange={(e) => setQ(e.target.value)}
          value={q}
          style={{ maxWidth: 200 }}
        />
      </div>
    <div style={{ display: "flex", gap: 16, padding: 24 }}>
   
      {/* Form */}
      <div
        style={{ flex: 1, background: "#fff", padding: 20, borderRadius: 8 }}
      >
        <h3>Upload Image</h3>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="image" label="Category Image">
            <Upload
              name="image"
              listType="picture-card"
              maxCount={1}
              accept="image/png,image/jpeg,image/webp"
              customRequest={handleUpload}
              onChange={({ file }) => {
                if (file.status === 'removed') {
                  form.setFieldsValue({ imageUrl: null, image: [] });
                }
              }}
            >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              
            </Upload>
          </Form.Item>

          <Form.Item name="imageUrl" noStyle>
            <Input type="hidden" />
          </Form.Item>
          
          <Form.Item name="name" label="Category Title" rules={[{ required: true }]}>
            <Input placeholder="Category name" />
          </Form.Item>
          
          <Form.Item name="children" label="Tags" >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="enter Tags"
                tokenSeparators={[',']}
                 onChange={(value) => {
                  console.log("Selected tags:", value);
                  form.setFieldsValue({ children: value }); 
                }}
                open={false}
              />
            <p style={{ fontStyle: 'italic', margin:'0' }}>press enter to add new tags</p>

            </Form.Item>
          <Form.Item
              name="productType"
              initialValue="fashion"
              noStyle // ẩn field khỏi giao diện
            >
              <Input type="hidden" />
            </Form.Item>

          
          <Form.Item name="description" label="Description">
            <TextArea placeholder="Category description" autoSize />
          </Form.Item>
          
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add Category
          </Button>
        </Form>
      </div>

      {/* Table */}
      <div
        style={{ flex: 2, background: "#fff", padding: 20, borderRadius: 8 }}
      >
        <Table
          dataSource={data
            .filter(item =>
              item?.parent?.toLowerCase().includes(q.toLowerCase())
            )
            .slice((page - 1) * 5, page * 5) // chia trang
          }        
          columns={columns}
          rowKey="id"
          pagination={false}
          expandable={{
            expandIcon: () => null, // ẩn nút +
          }}
        />
        <div style={{ marginTop: 16, textAlign: "right", display: "flex", justifyContent: "flex-end" }}>
          <Pagination
            current={page}
            onChange={setPage}
            total={data.length}
            pageSize={5}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div></>
  );
};

export default CategoryArea;
