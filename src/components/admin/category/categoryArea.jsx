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
  Drawer,
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
import {useAddCategoryMutation, } from "@/redux/features/admin/categoryApi";
  
const CategoryArea = ({dataCategory}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataCategory);
  const [page, setPage] = useState(1);
  const [uploadImage] = useUploadImageMutation();
  const [addCategory] = useAddCategoryMutation();
  const [q, setQ] = useState("");
const [openDrawer, setOpenDrawer] = useState(false);
const [editingCategory, setEditingCategory] = useState(null);

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
      <Button icon={<EditOutlined />} onClick={() => {
        setEditingCategory(record);
        setOpenDrawer(true);
        form.setFieldsValue({
          name: record.parent,
          children: record.children || [],
          description: record.description,
          image: [{ uid: '-1', name: 'current', status: 'done', url: record.img }],
          imageUrl: record.img,
        });
      }} />
      <Button icon={<DeleteOutlined />} danger onClick={() => {
        Modal.confirm({
          title: "Xác nhận xóa",
          content: `Bạn có chắc muốn xóa danh mục "${record.parent}" không?`,
          okText: "Xóa",
          okType: "danger",
          cancelText: "Hủy",
          onOk: async () => {
            try {
              // Gọi API xóa nếu có, ví dụ: await deleteCategory(record.id)
              setData(prev => prev.filter(item => item.id !== record.id));
              message.success("Xóa thành công");
            } catch (error) {
              message.error("Xóa thất bại");
            }
          },
        });
      }} />
    </Space>
  ),
}

  ];

const onFinish = async (values) => {
  try {
    if (editingCategory) {
      // Sửa
      const updated = {
        ...editingCategory,
        parent: values.name,
        img: values.imageUrl,
        children: values.children,
        description: values.description,
      };

      setData(prev =>
        prev.map(item => item.id === editingCategory.id ? updated : item)
      );
      message.success("Cập nhật danh mục thành công");
    } else {
      // Thêm mới
      const response = await addCategory({
        parent: values.name,
        img: values.imageUrl || 'https://placehold.co/300x300',
        children: values.children,
        description: values.description,
        product_type: values.productType,
        status: "Show",
      }).unwrap();

      setData([response.data, ...data]);
      message.success("Thêm danh mục thành công");
    }

    form.resetFields();
    setEditingCategory(null);
    setOpenDrawer(false);
  } catch (error) {
    console.error('Lỗi khi thêm/sửa danh mục:', error);
    message.error(error.data?.message || 'Thêm/sửa danh mục thất bại');
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
        <h3>Add Category</h3>
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
    </div>
    <Drawer
  title="Chỉnh sửa danh mục"
  placement="right"
  width={400}
  onClose={() => {
    setOpenDrawer(false);
    form.resetFields();
  }}
  open={openDrawer}
>
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
    <Form.Item name="imageUrl" noStyle><Input type="hidden" /></Form.Item>
    <Form.Item name="name" label="Category Title" rules={[{ required: true }]}><Input /></Form.Item>
    <Form.Item name="children" label="Tags">
      <Select mode="tags" tokenSeparators={[',']} open={false} />
    </Form.Item>
    <Form.Item name="description" label="Description"><TextArea autoSize /></Form.Item>

    <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
      Cập nhật
    </Button>
  </Form>
</Drawer>

    </>
  );
};

export default CategoryArea;
