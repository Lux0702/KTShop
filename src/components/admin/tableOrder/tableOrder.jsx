// components/admin/InvoiceTable.jsx
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Select, Tag, message } from "antd";
import axios from "axios";

const InvoiceTable = ({ invoices = [], page = 1, totalPages = 1 }) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const optionSelect = [
    { value: "pending", label: "Pending" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "processing", label: "Processing" },
  ];

  const tagEnum = {
    pending: <Tag color="orange">Pending</Tag>,
    delivered: <Tag color="green">Delivered</Tag>,
    cancelled: <Tag color="red">Cancelled</Tag>,
    processing: <Tag color="blue">Processing</Tag>,
  };

  useEffect(() => {
    let data = [...invoices];
    if (searchText) {
      data = data.filter(inv => inv.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    if (statusFilter) {
      data = data.filter(inv => inv.status === statusFilter);
    }
    setFilteredInvoices(data);
  }, [searchText, statusFilter, invoices]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`https://ktshop.onrender.com/api/order/update-status/${id}`, { status: newStatus });
      message.success("Status updated");
      setFilteredInvoices(prev =>
      prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv)
    );
    } catch (error) {
      console.error(error);
      message.error("Failed to update status");
    }
  };

  return (
    <div className="invoice-table">
      <div className="invoice-header">
        <input
          type="text"
          className="search-input"
          placeholder="Search by invoice no"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="status-filter">
          <span>Status :</span>
          <Select
            allowClear
            showSearch
            style={{ width: 120 }}
            placeholder="Choose status"
            optionFilterProp="label"
            options={optionSelect}
            onChange={(value) => setStatusFilter(value)}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>INVOICE NO</th>
            <th>CUSTOMER</th>
            <th>TOTAL</th>
            <th>METHOD</th>
            <th>STATUS</th>
            <th>DATE</th>
            <th>ACTION</th>
            <th>INVOICE</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((inv) => (
            <tr key={inv.id}>
              <td>#{inv.id}</td>
              <td className="customer">
                {inv?.user?.avatar && <img src={inv.user.avatar} alt="avatar" />}
                <span>{inv?.user?.name || "Unknow User"}</span>
              </td>
              <td>${Number(inv?.total_amount)?.toFixed(2)}</td>
              <td>{inv?.payment_method}</td>
              <td>
                {tagEnum[inv.status] || <Tag color="default">Unknown</Tag>}
              </td>
              <td>{dayjs(inv.createdAt).format("YYYY-MM-DD")}</td>
              <td>
                <Select
                  defaultValue={inv.status}
                  style={{ width: 120 }}
                  options={optionSelect}
                  onChange={(value) => handleStatusChange(inv.id, value)}
                />
              </td>
              <td className="icons">
                <button><i className="fa fa-print"></i></button>
                <button><i className="fa fa-eye"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1}>{"<"}</button>
        {[...Array(totalPages).keys()].slice(page - 1, page + 4).map((i) => (
          <button key={i + 1} className={page === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
        <button disabled={page === totalPages}>{">"}</button>
      </div>
    </div>
  );
};

export default InvoiceTable;
