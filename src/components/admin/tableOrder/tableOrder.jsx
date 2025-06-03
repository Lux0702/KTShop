import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import {
  Select,
  Tag,
  message,
  Drawer,
  Descriptions,
  Image,
  Button,
} from "antd";
import axios from "axios";
import ReactToPrint from "react-to-print";

const InvoiceTable = ({ invoices = [] }) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
 
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  const printRef = useRef();
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
    data = data.filter((inv) =>
      inv.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  if (statusFilter) {
    data = data.filter((inv) => inv.status === statusFilter);
  }
  setFilteredInvoices(data);
  setCurrentPage(1); // Cần dòng này
}, [searchText, statusFilter, invoices]);


  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `https://ktshop.onrender.com/api/order/update-status/${id}`,
        { status: newStatus }
      );
      message.success("Status updated");
      setFilteredInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
      );
    } catch (error) {
      console.error(error);
      message.error("Failed to update status");
    }
  };

  const handleViewInvoice = async (id) => {
    try {
      const { data } = await axios.get(
        `https://ktshop.onrender.com/api/order/${id}`
      );
      setSelectedInvoice(data);
      setDrawerVisible(true);
    } catch (err) {
      message.error("Failed to load invoice details");
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
          {paginatedInvoices.map((inv) => (
            <tr key={inv.id}>
              <td>#{inv.id}</td>
              <td className="customer">
                {inv?.user?.avatar && (
                  <img src={inv.user.avatar} alt="avatar" />
                )}
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
                <ReactToPrint
                  trigger={() => (
                    <Button icon={<i className="fa fa-print" />}></Button>
                  )}
                  content={() => printRef.current}
                />
                <button onClick={() => handleViewInvoice(inv.id)}>
                  <i className="fa fa-eye"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          {"<"}
        </button>
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          {">"}
        </button>
      </div>

      <Drawer
        title={`Invoice Detail #${selectedInvoice?.id}`}
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <ReactToPrint
            trigger={() => (
              <Button icon={<i className="fa fa-print" />} type="primary">
                In Hóa Đơn
              </Button>
            )}
            content={() => printRef.current}
          />
        }
      >
        <div ref={printRef}>
          {selectedInvoice && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Customer">
                {selectedInvoice.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedInvoice.email}
              </Descriptions.Item>
              <Descriptions.Item label="Contact">
                {selectedInvoice.contact}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedInvoice.address}, {selectedInvoice.city},{" "}
                {selectedInvoice.country}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedInvoice.payment_method}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                ${Number(selectedInvoice.total_amount).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedInvoice.status}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {dayjs(selectedInvoice.createdAt).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Products">
                {selectedInvoice.cart?.map((p, index) => (
                  <div key={index} style={{ marginBottom: 10 }}>
                    <Image src={p.img} alt={p.title} width={50} />{" "}
                    <strong>{p.title}</strong> x {p.orderQuantity}
                  </div>
                ))}
              </Descriptions.Item>
            </Descriptions>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default InvoiceTable;
