import {
  MdDashboard,
  MdOutlineCategory,
  MdOutlineRateReview,
  MdOutlineLocalOffer,
  MdOutlineStore,
  MdOutlineInsertDriveFile,
  MdNotifications,
} from "react-icons/md";
import {
  FaBoxOpen,
  FaUserCircle,
  FaUserTie,
  FaLeaf,
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaBox,
} from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";

export const Icons = {
  Dashboard: MdDashboard,
  Products: FaBoxOpen,
  Category: MdOutlineCategory,
  Orders: AiOutlineShoppingCart,
  Brand: FaLeaf,
  Reviews: MdOutlineRateReview,
  Coupons: MdOutlineLocalOffer,
  Profile: FaUserCircle,
  OnlineStore: MdOutlineStore,
  Staff: FaUserTie,
  Pages: MdOutlineInsertDriveFile,
  Notifications: MdNotifications,

  TodayOrders: FaClipboardList,
  YesterdayOrders: FaChartBar,
  MonthlyOrders: FaUsers,
  TotalOrders: FaBox,
};
