// pages/category.js
import React, { useState } from "react";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/categoryApi";
import WidgetsLoader from "../widget/widget-loader";
import ErrorMsg from "@/components/common/error-msg";
import CategoryArea from "@/components/admin/category/categoryArea";
import Wrapper from "@/layout/wrapper";

const Category = () => {
  const {data: listCategory, isLoading, isError} =useGetAllCategoriesQuery();
  let content = null;

  if (isLoading) {
    content = <WidgetsLoader loading={isLoading} />;
  } 
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
   if (!isLoading && !isError && listCategory) {
    console.log("listCategory", listCategory.result, Array.isArray(listCategory.result));
     content = (
       <CategoryArea
         dataCategory={Array.isArray(listCategory.result) ? listCategory.result : []}
       />
     );
   }
  return <Wrapper>{content}</Wrapper>;
  
};

export default Category;
