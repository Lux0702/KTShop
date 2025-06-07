import { useState } from "react";
import { useSelector } from "react-redux";

const CheckoutCoupon = ({ handleCouponCode, couponRef, couponApplyMsg }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [couponText, setCouponText] = useState("");
  const { coupon_info } = useSelector((state) => state.coupon);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (couponText.trim() === "") return;
    if (couponRef && typeof couponRef === "object") {
      couponRef.current.value = couponText;

    }
    handleCouponCode(e);
  };

  return (
    <div className="tp-checkout-verify-item">
      <p className="tp-checkout-verify-reveal">
        Have a coupon?{" "}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="tp-checkout-coupon-form-reveal-btn"
        >
          Click here to enter your code
        </button>
      </p>

      {isOpen && (
        <div id="tpCheckoutCouponForm" className="tp-return-customer">
          <form onSubmit={handleSubmit}>
            <div className="tp-return-customer-input">
              <label>Coupon Code :</label>
              <input
                type="text"
                placeholder="Coupon"
                value={couponText}
                onChange={(e) => setCouponText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="tp-return-customer-btn tp-checkout-btn"
            >
              Apply
            </button>
          </form>
          {couponApplyMsg && (
            <p className="p-2" style={{ color: "green" }}>
              {couponApplyMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutCoupon;
