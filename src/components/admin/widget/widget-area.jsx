import React from "react";
import Widget from "./widget";
 
const WidgetArea = ({ data }) => {

    return (
      <div className="widget-container">
        <Widget
          type="today"
          title="Today Orders"
          amount={data?.todayOrderAmount || 0.0}
          cash={data?.todayCashPaymentAmount || 0.0}
          card={data?.todayCardPaymentAmount || 0.0}
        />
        <Widget
          type="yesterday"
          title="Yesterday Orders"
          amount={data?.yesterdayOrderAmount || 0}
          cash={data?.yesterDayCashPaymentAmount || 0.0}
          card={data?.yesterDayCardPaymentAmount || 0.0}
        />
        <Widget
          type="monthly"
          title="Monthly Orders"
          amount={data?.monthlyOrderAmount || 0}
        />
        <Widget
          type="total"
          title="Total Orders"
          amount={data?.totalOrderAmount || 0}
        />
      </div>
    );
}
export default WidgetArea;