import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

// internal components
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ProfileArea from "@/components/my-account/profile-area";
import { useGetOrdersOfUserQuery } from "@/redux/features/order/orderApi";
import Loader from "@/components/loader/loader";
import Header from "@/layout/headers/header";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Lấy user từ cookie
  useEffect(() => {
    const cookieData = Cookies.get("userInfo");
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        console.log("parséd")
        setUser(parsed.user);
      } catch (err) {
        console.error("Failed to parse cookie", err);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  // Gọi API khi có user
const { data: orderData, refetch, isLoading } = useGetOrdersOfUserQuery(user?.id, {
  skip: !user?.id, 
});
useEffect(() => {
  if (user?.id) {
    console.log("user?.id",user?.id)
    refetch(); // 🔁 gọi lại API sau khi user đã sẵn sàng
  }
}, [user]);
  // Hiển thị loading khi đang fetch
  if (!user || isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <Loader loading={true} />
      </div>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle="Profile" />
      <Header />
      <ProfileArea orderData={orderData} />
      <Footer style_2={true} />
    </Wrapper>
  );
};

export default ProfilePage;
