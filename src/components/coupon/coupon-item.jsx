import React from "react";
import dayjs from "dayjs";
import CopyToClipboard from "react-copy-to-clipboard";
import Image from "next/image";
// internal
import OfferTimer from "./offer-timer";
import { InfoDetails } from "@/svg";

const CouponItem = ({ coupon, handleCopied, copiedCode, copied }) => {
  return (
    <div className="tp-coupon-item mb-30 p-relative d-md-flex justify-content-between align-items-center">
      <span className="tp-coupon-border"></span>
      <div className="tp-coupon-item-left d-sm-flex align-items-center">
        <div className="tp-coupon-thumb">
          <a href="#">
            <Image src={coupon.logo} alt="logo" width={120} height={120}  />
          </a>
        </div>
        <div className="tp-coupon-content">
          <h3 className="tp-coupon-title">{coupon.title}</h3>
          <p className="tp-coupon-offer mb-15">
            <span>{coupon.discount_percentage}%</span>Off
          </p>
          <div
            className="tp-coupon-countdown"
          >
            {dayjs().isAfter(dayjs(coupon.end_time)) ? (
              <div className="tp-coupon-countdown-inner">
                <ul>
                  <li>
                    <span>{0}</span> Day
                  </li>
                  <li>
                    <span>{0}</span> Hrs
                  </li>
                  <li>
                    <span>{0}</span> Min
                  </li>
                  <li>
                    <span>{0}</span> Sec
                  </li>
                </ul>
              </div>
            ) : (
              <OfferTimer expiryTimestamp={new Date(coupon.end_time)} />
            )}
          </div>
        </div>
      </div>
      <div className="tp-coupon-item-right pl-20">
        <div className="tp-coupon-status mb-10 d-flex align-items-center">
          <h4>
            Coupon{" "}
            <span
              className={
                dayjs().isAfter(dayjs(coupon.end_time)) ? "in-active" : "active"
              }
            >
              {dayjs().isAfter(dayjs(coupon.end_time)) ? "Inactive" : "Active"}
            </span>
          </h4>
          <div className="tp-coupon-info-details">
            <span>
              <InfoDetails />
            </span>
            <div className="tp-coupon-info-tooltip transition-3">
              <p>
                *This coupon code will apply on{" "}
                <span>Grocery type products</span> and when you shopping more
                than <span>${coupon.minimum_amount}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="tp-coupon-date">
          <CopyToClipboard
            text={coupon.coupon_code}
            onCopy={() => handleCopied(coupon.coupon_code)}
          >
            <button>
              {copied && coupon.coupon_code === copiedCode ? (
                <span>Copied!</span>
              ) : (
                <span>{coupon.coupon_code}</span>
              )}
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};

export default CouponItem;
