import React from "react";
import { UploadOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Select, Upload } from "antd";
const { TextArea } = Input;

const handleUploadImage =
  (form, setPreview, uploadImage) =>
  async ({ file, onSuccess, onError }) => {
    const reader = new FileReader();
    // reader.onload = (e) => setPreview(e.target.result);
    setPreview("");
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData).unwrap();
      form.setFieldsValue({
        imageUrl: res.data.url,
        image: [
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: res.data.url,
          },
        ],
      });
      onSuccess(res.data.url);
    } catch (error) {
      console.error("Upload failed", error);
      onError(error);
    }
  };

const CategoryForm = ({
  form,
  onFinish,
  preview,
  setPreview,
  uploadImage,
  isEdit = false,
}) => (
  <Form form={form} layout="vertical" onFinish={onFinish}>
    <Form.Item name="image" label="Category Image">
      <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
        <Upload
          name="image"
          listType="picture-card"
          maxCount={1}
          accept="image/png,image/jpeg,image/webp"
          customRequest={handleUploadImage(form, setPreview, uploadImage)}
          onChange={({ file }) => {
            if (file.status === "removed") {
              form.setFieldsValue({ imageUrl: null, image: [] });
              setPreview("");
            }
          }}
        >
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
        {preview && (
          <Image
            src={preview}
            width={80}
            style={{ marginTop: 8 }}
            alt="Image Preview"
          />
        )}
      </div>
    </Form.Item>
    <Form.Item name="imageUrl" noStyle>
      <Input type="hidden" />
    </Form.Item>
    <Form.Item name="name" label="Category Title" rules={[{ required: true }]}>
      <Input placeholder="Category name" />
    </Form.Item>
    <Form.Item name="children" label="Tags">
      <Select mode="tags" tokenSeparators={[","]} open={false} />
      {!isEdit && (
        <p style={{ fontStyle: "italic", margin: 0 }}>
          Press enter to add new tags
        </p>
      )}
    </Form.Item>
    {!isEdit && (
      <Form.Item name="productType" initialValue="fashion" noStyle>
        <Input type="hidden" />
      </Form.Item>
    )}
    {isEdit && (
      <Form.Item
        name="status"
        label="Trạng thái hiển thị"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { value: "Show", label: "Hiện" },
            { value: "Hide", label: "Ẩn" },
          ]}
        />
      </Form.Item>
    )}

    <Form.Item name="description" label="Description">
      <TextArea autoSize />
    </Form.Item>
    <Button
      type="primary"
      htmlType="submit"
      icon={isEdit ? <EditOutlined /> : <PlusOutlined />}
    >
      {isEdit ? "Cập nhật" : "Add Category"}
    </Button>
  </Form>
);

export default CategoryForm;
