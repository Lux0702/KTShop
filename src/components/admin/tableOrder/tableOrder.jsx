// components/admin/InvoiceTable.jsx
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { Select, Tag } from "antd";

const InvoiceTable = ({ invoices = [], page = 1, totalPages = 1 }) => {
  useEffect(() => {
    console.log("Invoices: ", invoices);
  }, [invoices]);
  const optionSelect = [
    { value: "pending", label: "Pending" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "processing", label: "Processing" },
  ];
  const tagEnum = {
    pending: <Tag color="orange">Pending</Tag>,
    delivered: <Tag color="success">Delivered</Tag>,
    cancelled: <Tag color="error">Cancelled</Tag>,
    processing: <Tag color="processing">Processing</Tag>,
  };
  return (
    <div className="invoice-table">
      <div className="invoice-header">
        <input
          type="text"
          className="search-input"
          placeholder="Search by invoice no"
        />
        <div className="status-filter">
          <span>Status :</span>
          <Select
            showSearch
            style={{ width: 100 }}
            placeholder="Choose status"
            optionFilterProp="label"
            options={optionSelect}
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
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>#{inv.invoice}</td>
              <td className="customer">
                {inv?.user?.avatar && (
                  <img src={inv?.user?.avatar} alt="avatar" />
                )}
                <span>{inv?.user?.name || "Unknow User"}</span>
              </td>
              <td>${inv?.totalAmount?.toFixed(2)}</td>
              <td>{inv?.paymentMethod}</td>
              <td>
                {tagEnum[inv.status] || (
                  <Tag color="default">Unknown</Tag>
                )}
              </td>
              <td>{dayjs(inv.createdAt).format("YYYY-MM-DD")}</td>
              <td>
                <Select
                  showSearch
                  style={{ width: 100 }}
                  placeholder="Choose status"
                  optionFilterProp="label"
                  options={optionSelect}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </td>
              <td className="icons">
                <button>
                  <i className="fa fa-print"></i>
                </button>
                <button>
                  <i className="fa fa-eye"></i>
                </button>
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
