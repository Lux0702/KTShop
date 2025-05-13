import React from "react";
import { FaChartBar, FaUsers, FaBox, FaClipboardList } from "react-icons/fa";
import { Icons } from "@/components/icons/icons";
const icons = {
  today: (
    <Icons.TodayOrders
      className="icon"
      style={{ backgroundColor: "#3ecf8e" }}
    />
  ),
  yesterday: (
    <Icons.YesterdayOrders
      className="icon"
      style={{ backgroundColor: "#a259ff" }}
    />
  ),
  monthly: (
    <Icons.MonthlyOrders
      className="icon"
      style={{ backgroundColor: "#3a8bfd" }}
    />
  ),
  total: (
    <Icons.TotalOrders
      className="icon"
      style={{ backgroundColor: "#ffa500" }}
    />
  ),
};

const Widget = ({ type, title, amount, cash, card }) => {
  return (
    <div className="widget">
      <div className="left">
        <h3>{amount}</h3>
        <p>{title}</p>
        {cash !== undefined && card !== undefined && (
          <div className="paymentInfo">
            <span className="cash">Cash: {cash.toFixed(2)}</span>
            <span className="card">Card: {card.toFixed(2)}</span>
          </div>
        )}
      </div>
      <div className="right">{icons[type]}</div>
    </div>
  );
};

export default Widget;
