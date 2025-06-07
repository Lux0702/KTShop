import home_1 from '@assets/img/menu/menu-home-1.jpg';
import home_2 from '@assets/img/menu/menu-home-2.jpg';
import home_3 from '@assets/img/menu/menu-home-3.jpg';
import home_4 from '@assets/img/menu/menu-home-4.jpg';

const menu_data = [
  {
    id: 2,
    sub_menu: false,
    title: "Home",
    link: "/",
    
  },
  {
    id: 3,
    // products: true,
    title: "Shop",
    link: "/shop",
    sub_menu: true,
    // product_pages: [
    //   {
    //     title: "Shop Page",
    //     link: "/shop",
    //     mega_menus: [
    //       { title: "Categories", link: "/shop-category" },
    //       // { title: 'Shop Grid with Sideber', link: '/shop' },
    //       // { title: "Product Details", link: "/product-details" },
    //     ],
    //   },
    //   // {
    //   //   title: "Products",
    //   //   link: "/product-details",
    //   //   mega_menus: [
    //   //     { title: "Product Simple", link: "/product-details" },
    //   //     // { title: 'With Video', link: '/product-details-video' },
    //   //     { title: "With Countdown Timer", link: "/product-details-countdown" },
    //   //     { title: "Variations Swatches", link: "/product-details-swatches" },
    //   //   ],
    //   // },
    // ],
    sub_menus: [
      { title: "Shop", link: "/shop" },
      { title: "Categories", link: "/shop-category" },
    ],
  },
  {
    id: 4,
    single_link: true,
    title: "Coupons",
    link: "/coupon",
  },
  {
    id: 6,
    single_link: true,
    title: "Contact",
    link: "/contact",
  },
];

export default menu_data;

// mobile_menu
export const mobile_menu = [
  {
    id: 1,
    homes: true,
    title: 'Home',
    link: '/',
    home_pages: [
      // {
      //   img: home_1,
      //   title: 'Electronics',
      //   link: '/'
      // },
      // {
      //   img: home_2,
      //   title: 'Fashion',
      //   link: '/home-2'
      // },
      // {
      //   img: home_3,
      //   title: 'Beauty',
      //   link: '/home-3'
      // },
      // {
      //   img: home_4,
      //   title: 'Jewelry',
      //   link: '/home-4'
      // }
    ]
  },
  {
    id: 2,
    sub_menu: true,
    title: 'Products',
    link: '/shop',
    sub_menus: [
      { title: 'Shop', link: '/shop' },
      // { title: 'Right Sidebar', link: '/shop-right-sidebar' },
      // { title: 'Hidden Sidebar', link: '/shop-hidden-sidebar' },
      { title: 'Categories', link: '/shop-category' },
      // { title: 'Product Simple', link: '/product-details' },
      // { title: 'With Video', link: '/product-details-video' },
      // { title: 'With Countdown Timer', link: '/product-details-countdown' },
      // { title: 'Variations Swatches', link: '/product-details-swatches' },
    ],
  },
  {
    id: 3,
    sub_menu: true,
    title: 'eCommerce',
    link: '/cart',
    sub_menus: [
      { title: 'Shopping Cart', link: '/cart' },
      { title: 'Compare', link: '/compare' },
      { title: 'Wishlist', link: '/wishlist' },
      { title: 'Checkout', link: '/checkout' },
      { title: 'My account', link: '/profile' },
    ],
  },
  {
    id: 4,
    single_link: true,
    title: 'Coupons',
    link: '/coupon',
  },
  {
    id: 5,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  },
]