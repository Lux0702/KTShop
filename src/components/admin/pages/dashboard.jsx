import React from "react";
import Wrapper from "@/layout/wrapper"; 
import {
  useGetDashBoardAmountQuery,
  useGetListOrderQuery,
  useGetSaleReportQuery,
  useGetMostSaleCategoryQuery,
} from "@/redux/features/admin/dashboardApi";
import ErrorMsg from "@/components/common/error-msg";
import WidgetsLoader from "../widget/widget-loader";
import WidgetArea from "../widget/widget-area";
import LineChart from "../charts/LineChart";
import PieChart from "../charts/PieChart";
import TableOrder from "../tableOrder/tableOrder";



const Dashboard = () => {
  const { data: dashboardData, isLoading, isError } = useGetDashBoardAmountQuery();
  const { data: orderData } = useGetListOrderQuery();
  const { data: saleReportData } = useGetSaleReportQuery();
  const { data: mostSaleCategoryData } = useGetMostSaleCategoryQuery();
  let content = null;
  if (isLoading) {
    content = <WidgetsLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && dashboardData && orderData) {
    content = (
      <>
        <WidgetArea data={dashboardData} />
        <div className="chart-container">
          <div className="line-chart">
            <h5>Sales Statistics</h5>
            <LineChart lineData={saleReportData} />
          </div>
          <div className="pie-chart">
            <h5>Most Selling Category</h5>
            <PieChart pieData={mostSaleCategoryData} />
          </div>
        </div>
        <div className="table-order">
          <TableOrder invoices={orderData.data} />
        </div>
      </>
    );
  }
  return <Wrapper>{content}</Wrapper>;
};

export default Dashboard;
