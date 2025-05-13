import React from "react";
import Wrapper from "@/layout/wrapper"; 
import { useGetDashBoardAmountQuery } from "@/redux/features/admin/dashboardApi";
import ErrorMsg from "@/components/common/error-msg";
import WidgetsLoader from "../widget/widget-loader";
import WidgetArea from "../widget/widget-area";
import LineChart from "../charts/LineChart";
import PieChart from "../charts/PieChart";



const Dashboard = () => {
  const { data: dashboardData, isLoading, isError } = useGetDashBoardAmountQuery();
  let content = null;
  if (isLoading) {
    content = <WidgetsLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && dashboardData) {
    content = (
      <>
        <WidgetArea data={dashboardData} />
        <div className="chart-container">
          <div className="line-chart">
            <h5>Sales Statistics</h5>
            <LineChart />
          </div>
          <div className="pie-chart">
            <h5>Most Selling Category</h5>
            <PieChart />
          </div>
        </div>
      </>
    );
  }
  return <Wrapper>{content}</Wrapper>;
};

export default Dashboard;
