import React from "react";
import Wrapper from "@/layout/wrapper";
import {
  useGetListOrderQuery,
} from "@/redux/features/admin/dashboardApi";
import ErrorMsg from "@/components/common/error-msg";
import WidgetsLoader from "../widget/widget-loader";
import TableOrder from "../tableOrder/tableOrder";

const Orders = () => {
  const { data: orderData ,isLoading, isError} = useGetListOrderQuery();
  let content = null;
  if (isLoading) {
    content = <WidgetsLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && orderData) {
    content = (
      <>
       
        <div className="table-order">
          <TableOrder invoices={orderData.data} />
        </div>
      </>
    );
  }
  return <Wrapper>{content}</Wrapper>;
};

export default Orders;
