// src/components/icons/icones.js
import {
  MdDashboard,
  MdOutlineCategory,
  MdOutlineRateReview,
  MdOutlineLocalOffer,
  MdOutlineStore,
  MdOutlineInsertDriveFile,
} from "react-icons/md";
import { FaBoxOpen, FaUserCircle, FaUserTie, FaLeaf } from "react-icons/fa";
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
};
