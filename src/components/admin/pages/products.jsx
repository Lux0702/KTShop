import React, { useState } from "react";
import { Table, Input, Button, Select, Tag, Space, Rate, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {useGetListProductQuery}  from "@/redux/features/admin/productApi";
import WidgetsLoader from "../widget/widget-loader";
import ErrorMsg from "@/components/common/error-msg";

const { Option } = Select;

const init = [
  { key:1, img:"/img/lenovo.png", name:"Lenovo Wireless Bluetooth", sku:"#DG8SDVX32", qty:0, price:70, rate:3.5, status:"out" },
  { key:2, img:"/img/sony.png",   name:"Sony Smart Watch",          sku:"#EF7SDVX73", qty:5, price:100, rate:3,   status:"in"  },
  // ...
];

export default function Products() {
  const {data: listProduct, isLoading , isError} = useGetListProductQuery();
  const [data,setData]=useState(init);
  const [q,setQ]=useState("");
  const [filter,setFilter]=useState("");
  let content = null;

  if(isLoading){
    content = <WidgetsLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  const cols=[
    {title:"PRODUCT",render:(_,r)=><Space>
        <Image width={40} src={r.img}/>
        {r.name}
      </Space>},
    {title:"SKU",dataIndex:"sku"},
    {title:"QTY",dataIndex:"qty"},
    {title:"PRICE",render:(_,r)=>`$${r.price}`},
    {title:"RATING",render:(_,r)=><Rate disabled allowHalf defaultValue={r.rate}/>},
    {title:"STATUS",render:(_,r)=>r.status==="in"
        ?<Tag color="green">in-stock</Tag>
        :<Tag color="red">out-of-stock</Tag>},
    {title:"ACTION",render:()=>(
        <Space>
          <Button icon={<EditOutlined />} />
          <Button danger icon={<DeleteOutlined />} />
        </Space>)}
  ];

  const filtered=data.filter(d=>
      d.name.toLowerCase().includes(q.toLowerCase()) &&
      (!filter|| (filter==="in"?d.status==="in":d.status==="out"))
  );

  return (
    <Space direction="vertical" style={{width:"100%"}}>
      <Space style={{justifyContent:"space-between",width:"100%"}}>
        <Input.Search
          placeholder="Search by product name"
          onSearch={setQ}
          style={{maxWidth:300}}
        />
        <Space>
          <span>Status:</span>
          <Select
            placeholder="Status"
            allowClear
            onChange={setFilter}
            style={{width:120}}
          >
            <Option value="in">in-stock</Option>
            <Option value="out">out-of-stock</Option>
          </Select>
          <Button icon={<PlusOutlined />} type="primary">
            Add Product
          </Button>
        </Space>
      </Space>
      <Table columns={cols} dataSource={filtered} pagination={{pageSize:8}}/>
    </Space>
  );
}
