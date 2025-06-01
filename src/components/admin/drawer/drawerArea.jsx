import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, InputNumber, Tag } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

const DrawerArea = ({ open, onClose }) => {
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    console.log('Received values of form:', values);
    // Xử lý dữ liệu form ở đây
    onClose();
  };

  const tagChildren = [];
  for (let i = 0; i < 3; i++) {
    tagChildren.push(<Option key={i.toString(36) + i}>tag{i}</Option>);
  }
const handleTitleChange = (e) => {
    const title = e.target.value;
    form.setFieldsValue({
      slug: convertToSlug(title)
    });
  };
    const convertToSlug = (text) => {
    if (!text) return '';
    
    // Chuyển đổi tiếng Việt có dấu thành không dấu
    const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ";
    const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD";
    
    let newText = text;
    for (let i = 0; i < from.length; i++) {
      newText = newText.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    
    return newText
      .toLowerCase()
      .replace(/ /g, '-')           // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/[^\w-]+/g, '')     // Loại bỏ ký tự đặc biệt
      .replace(/--+/g, '-')        // Thay nhiều gạch ngang bằng 1 gạch
      .replace(/^-+/, '')          // Loại bỏ gạch ngang ở đầu
      .replace(/-+$/, '');         // Loại bỏ gạch ngang ở cuối
  };
  return (
    <Drawer
      title="Tạo sản phẩm mới"
      width={720}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={() => form.submit()} type="primary">
            Tạo sản phẩm
          </Button>
        </Space>
      }
    >
      <Form 
        layout="vertical" 
        hideRequiredMark
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="sku"
              label="SKU"
              rules={[{ required: true, message: 'Vui lòng nhập SKU' }]}
            >
              <Input placeholder="PROD01" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              onChange={handleTitleChange}
            >
              <Input placeholder="Test Product 1" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="slug"
              label="Slug"
              rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
            >
              <Input placeholder="test-product-1" disabled  />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="unit"
              label="Đơn vị"
              rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}
            >
              <Select placeholder="piece" size='large'>
                <Option value="piece">Cái</Option>
                <Option value="pair">Cặp</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="brand_id"
              label="Thương hiệu"
              rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
            >
              <Select placeholder="Samsung">
                <Option value={1}>Samsung</Option>
                <Option value={2}>Apple</Option>
                <Option value={3}>Xiaomi</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category_id"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            >
              <Select placeholder="Smartphones">
                <Option value={1}>Smartphones</Option>
                <Option value={2}>Laptops</Option>
                <Option value={3}>Accessories</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="price"
              label="Giá"
              rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
            >
              <InputNumber 
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="discount"
              label="Giảm giá (%)"
            >
              <InputNumber 
                style={{ width: '100%' }}
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="in-stock">
                <Option value="in-stock">Còn hàng</Option>
                <Option value="out-of-stock">Hết hàng</Option>
                <Option value="pre-order">Đặt trước</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="product_type"
              label="Loại sản phẩm"
              rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}
            >
              <Select placeholder="electronics">
                <Option value="electronics">Điện tử</Option>
                <Option value="clothing">Quần áo</Option>
                <Option value="furniture">Nội thất</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="featured"
              label="Nổi bật"
              valuePropName="checked"
            >
              <Select placeholder="false">
                <Option value={true}>Có</Option>
                <Option value={false}>Không</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea rows={4} placeholder="Test product description." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="video_id"
              label="ID Video"
            >
              <Input placeholder="abc123" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sell_count"
              label="Đã bán"
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="offer_start_date"
              label="Ngày bắt đầu khuyến mãi"
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="offer_end_date"
              label="Ngày kết thúc khuyến mãi"
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="sizes"
              label="Kích cỡ"
            >
              <Select mode="tags" placeholder="S, M, L">
                <Option value="S">S</Option>
                <Option value="M">M</Option>
                <Option value="L">L</Option>
                <Option value="XL">XL</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="tags"
              label="Tags"
            >
              <Select mode="tags" placeholder="tag1, tag2">
                {tagChildren}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="additional_information"
              label="Thông tin bổ sung"
            >
              <TextArea rows={4} placeholder='{"origin": "Korea"}' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default DrawerArea;