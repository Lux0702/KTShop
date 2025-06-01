import React, { useState, useEffect } from 'react';
import {
  Drawer, Form, Input, Button, Select, Upload, InputNumber, DatePicker,
  Row, Col, message
} from 'antd';
import { PlusOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useUploadImageMutation } from '@/redux/features/admin/cloudinaryApi';
import { useAddProductMutation, useUpdateProductMutation } from '@/redux/features/admin/productApi';
import { useGetAllCategoriesQuery } from '@/redux/features/admin/categoryApi';
import { useGetActiveBrandsQuery } from '@/redux/features/brandApi';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const DrawerArea = ({ open, onClose, initialValues }) => {



  const [form] = Form.useForm();
  const [variations, setVariations] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState([]);
  const [fileList, setFileList] = useState([]);

  const [uploadImage] = useUploadImageMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [addProduct] = useAddProductMutation();

  const { data: categoryResponse } = useGetAllCategoriesQuery();
  const categories = categoryResponse?.result || [];
  const { data: brandResponse } = useGetActiveBrandsQuery();
  const brands = brandResponse?.result || [];

  const handleVariationAdd = () => {
    setVariations([...variations, { name: '', clrCode: '', img: '' }]);
  };

  const handleAdditionalAdd = () => {
    setAdditionalInfo([...additionalInfo, { key: '', value: '' }]);
  };

  const handleUpload = async ({ file, onSuccess, onError }, index = null) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadImage(formData).unwrap();
      if (index === null) {
        form.setFieldsValue({ img: res.data.url });
      } else {
        const newVariations = [...variations];
        newVariations[index].img = res.data.url;
        setVariations(newVariations);
      }
      onSuccess('OK');
    } catch (err) {
      onError(err);
    }
  };

  const onFinish = async (values) => {
  try {
    const imageURLs = variations.map(v => ({
      color: { name: v.name, clrCode: v.clrCode },
      img: v.img
    }));

    const additional_information = additionalInfo.reduce((acc, cur) => {
      if (cur.key) acc[cur.key] = cur.value;
      return acc;
    }, {});

    const selectedBrand = brands.find(b => b.id === values.brand_id);
    const selectedCategory = categories.find(c => c.id === values.category_id);

    const payload = {
      ...values,
      imageURLs,
      additional_information,
      offer_start_date: values.offerDates?.[0]?.toISOString() || null,
      offer_end_date: values.offerDates?.[1]?.toISOString() || null,
      parent: 'featured',
      children: 'Phone',
      brand_name: selectedBrand?.name || 'Unknown',
      category_name: selectedCategory?.parent || 'Unknown',
      img: values.img,
      product_type: 'fashion'
    };

    if (initialValues?.id) {
      await updateProduct({ id: initialValues.id, ...payload }).unwrap();
      message.success('Cập nhật sản phẩm thành công');
    } else {
      await addProduct(payload).unwrap();
      message.success('Thêm sản phẩm thành công');
    }

    form.resetFields();
    setVariations([]);
    setAdditionalInfo([]);
    onClose();
  } catch (err) {
    message.error(initialValues?.id ? 'Cập nhật thất bại' : 'Thêm sản phẩm thất bại');
  }
};

useEffect(() => {
    console.log("📥 initialValues:", initialValues);
  if (initialValues) {
    const { image_urls = [], additional_information = [], offer_start_date, offer_end_date, ...rest } = initialValues;

    if (initialValues?.img) {
        setFileList([
          {
            uid: '-1',
            name: 'image.jpg',
            status: 'done',
            url: initialValues.img,
          },
        ]);
      } else {
        setFileList([]);
      }
    // Chuyển image_urls thành variations
    const variations = image_urls.map(item => ({
      name: item.color?.name || '',
      clrCode: item.color?.clrCode || '',
      img: item.img || ''
    }));
    setVariations(variations);

    // Chuyển additional_information từ object -> array
    const additionalInfo = Array.isArray(additional_information)
      ? additional_information.flatMap(obj => {
          const key = Object.keys(obj)[0];
          return key ? [{ key, value: obj[key] }] : [];
        })
      : [];

    setAdditionalInfo(additionalInfo);

    // Convert offerDates
    const offerDates = offer_start_date && offer_end_date
      ? [dayjs(offer_start_date), dayjs(offer_end_date)]
      : undefined;

    form.setFieldsValue({
      ...rest,
      offerDates,
      sizes: rest.sizes || [],
      tags: rest.tags || [],
    });
  } else {
    form.resetFields();
    setVariations([]);
    setAdditionalInfo([]);
  }
}, [initialValues]);

  return (
    <Drawer title={initialValues ? "Edit Product" : "Add Product"} width={800} onClose={onClose} open={open}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input  style={{ height: 30 }}/>
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea rows={3}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Upload Image">
              <Upload name="img" listType="picture" maxCount={1} customRequest={handleUpload} fileList={fileList}
  onChange={({ fileList }) => setFileList(fileList)}>
                <Button icon={<UploadOutlined />} style={{ height: 30 }}>Upload Image</Button>
              </Upload>
              <Form.Item name="img" noStyle><Input type="hidden" /></Form.Item>
            </Form.Item>
            <Form.Item name="category_id" label="Product Category">
              <Select placeholder="Chọn danh mục" style={{ height: 30 }}
              onChange={(value) => {
                  const selected = categories.find(b => b.id === value);
                  form.setFieldsValue({
                    category_id: selected?.parent || 'Unknown',
                  });
                }}
              >
                {categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.parent}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}><Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item></Col>
          <Col span={6}><Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input style={{ height: 30 }} />
          </Form.Item></Col>
          <Col span={6}><Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }}  />
          </Form.Item></Col>
          <Col span={6}><Form.Item name="discount" label="Discount Percentage">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}><Form.Item name="offerDates" label="Start And End Date">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item></Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}><Form.Item name="brand_id" label="Brands">
            <Select placeholder="Chọn thương hiệu" style={{ height: 30 }} 
            onChange={(value) => {
                  const selected = brands.find(b => b.id === value);
                  form.setFieldsValue({
                    brand_name: selected?.name || 'Unknown',
                  });
                }}>
              {brands.map(brand => <Option key={brand.id} value={brand.id}>{brand.name}</Option>)}
            </Select>
          </Form.Item></Col>
          <Col span={8}><Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
            <Input style={{ height: 30 }} />
          </Form.Item></Col>
        </Row>

        <Form.Item name="tags" label="Product Tags">
          <Select mode="tags" style={{ height: 30 }} tokenSeparators={[',']}
                 onChange={(value) => {
                  console.log("Selected tags:", value);
                  form.setFieldsValue({ tags: value }); 
                
                }}                 open={false}
 />
        </Form.Item>
        <Form.Item name="sizes" label="Sizes">
          <Select mode="tags" style={{ height: 30 }} tokenSeparators={[',']}
                //  onChange={(value) => {
                //   console.log("Selected tags:", value);
                //   form.setFieldsValue({ sizes: value }); 
                // }}
                >
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <Option key={size} value={size}>{size}</Option>
            ))}
          </Select>
        </Form.Item>

        <h3>Additional Information</h3>
        {additionalInfo.map((item, idx) => (
          <Row gutter={16} key={idx} align="middle">
            <Col span={10}>
              <Input style={{ height: 30 }} placeholder="Key" value={item.key} onChange={e => {
                const updated = [...additionalInfo];
                updated[idx].key = e.target.value;
                setAdditionalInfo(updated);
              }} />
            </Col>
            <Col span={10}>
              <Input style={{ height: 30 }} placeholder="Value" value={item.value} onChange={e => {
                const updated = [...additionalInfo];
                updated[idx].value = e.target.value;
                setAdditionalInfo(updated);
              }} />
            </Col>
            <Col span={4}>
              <Button danger icon={<MinusCircleOutlined />} onClick={() => {
                const updated = [...additionalInfo];
                updated.splice(idx, 1);
                setAdditionalInfo(updated);
              }} />
            </Col>
          </Row>
        ))}
        <Button onClick={handleAdditionalAdd} icon={<PlusOutlined />}>Add Field</Button>

        <h3 style={{ marginTop: 24 }}>Product Variations</h3>
        {variations.map((v, index) => (
          <Row gutter={16} key={index} align="middle">
            <Col span={5}>
              <Input style={{ height: 30 }} placeholder="Color Name" value={v.name} onChange={e => {
                const updated = [...variations];
                updated[index].name = e.target.value;
                setVariations(updated);
              }} />
            </Col>
            <Col span={5}>
              <Input style={{ height: 30 }} placeholder="Color Code" value={v.clrCode} onChange={e => {
                const updated = [...variations];
                updated[index].clrCode = e.target.value;
                setVariations(updated);
              }} />
            </Col>
            <Col span={6}>
              <Upload listType="picture" maxCount={1} customRequest={(opt) => handleUpload(opt, index)}>
                <Button style={{ height: 30 }} icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Col>
            <Col span={4}>
              {v.img && <img src={v.img} alt="color" width={50} />}
            </Col>
            <Col span={4}>
              <Button danger icon={<MinusCircleOutlined />} onClick={() => {
                const updated = [...variations];
                updated.splice(index, 1);
                setVariations(updated);
              }} />
            </Col>
          </Row>
        ))}
        <Button onClick={handleVariationAdd} icon={<PlusOutlined />}>Add Field</Button>

        <div style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" style={{ height: 30 }}>Submit</Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default DrawerArea;
