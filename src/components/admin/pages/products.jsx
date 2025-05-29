import React, { useState } from "react";
import { Table, Input, Button, Select, Tag, Space, Rate, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetListProductQuery } from "@/redux/features/admin/productApi";
import WidgetsLoader from "../widget/widget-loader";
import ErrorMsg from "@/components/common/error-msg";
import ProductArea from "@/components/admin/product/productArea";
import Wrapper from "@/layout/wrapper";

export default function Products() {
  const { data: listProduct, isLoading, isError } = useGetListProductQuery();
  let content = null;

  if (isLoading) {
    content = <WidgetsLoader loading={isLoading} />;
  } 
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
   if (!isLoading && !isError && listProduct) {
    console.log("listProduct", listProduct.data, Array.isArray(listProduct.data));
     content = (
       <ProductArea
         dataProduct={Array.isArray(listProduct.data) ? listProduct.data : []}
       />
     );
   }

  return <Wrapper>{content}</Wrapper>;
}
