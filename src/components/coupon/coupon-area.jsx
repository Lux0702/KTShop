import React, { useState } from "react";
import ErrorMsg from "../common/error-msg";
import CouponItem from "./coupon-item";
import { useGetCouponsQuery } from "@/redux/features/coupon/couponApi";
import CouponLoader from "../loader/coupon-loader";
import { useDispatch } from "react-redux";
import { set_coupon } from "@/redux/features/coupon/couponSlice";
const CouponArea = () => {
  const [copiedCode, setCopiedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const handleCopied = (code) => {
    setCopiedCode(code.coupon_code);
    setCopied(true);
    dispatch(set_coupon(code));
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const { data: offerCoupons, isError, isLoading } = useGetCouponsQuery();
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <CouponLoader loading={isLoading} />;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && offerCoupons?.length === 0) {
    content = <ErrorMsg msg="No Coupons found!" />;
  }

  if (!isLoading && !isError && offerCoupons?.length > 0) {
    const coupon_items = offerCoupons;
    // const coupon_items = offerCoupons.slice(0, 2);
    content = coupon_items.map((coupon) => (
      <div key={coupon.id} className="col-xl-6">
        <CouponItem
          coupon={coupon}
          handleCopied={handleCopied}
          copied={copied}
          copiedCode={copiedCode}
        />
      </div>
    ));
  }
  return (
    <>
      <div className="tp-coupon-area pb-120">
        <div className="container">
          <div className="row">{content}</div>
        </div>
      </div>
    </>
  );
};

export default CouponArea;
