import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import store from "./store";
import { Provider } from "react-redux";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CustomerHomePage from "./pages/CustomerHomePage";
import CustomerOrdersPage from "./pages/CustomerOrdersPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import MerchantCustomerAccountsPage from "./pages/MerchantCustomerAccounts";
import MerchantHomePage from "./pages/MerchantHomePage";
import MerchantOrdersPage from "./pages/MerchantOrdersPage";
import MerchantProfilePage from "./pages/MerchantProfilePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";


// Constant variables to be passed to pages
let categories = [
  {
    _id: 1,
    category: "Staple",
  },
  {
    _id: 2,
    category: "Fruits",
  },
  {
    _id: 3,
    category: "Livestock",
  },
  {
    _id: 4,
    category: "Seafood",
  },
  {
    _id: 5,
    category: "Others",
  },
];

let status = [
  {
    _id: 0,
    status: "Pending",
  },
  {
    _id: 1,
    status: "Complete",
  },
  {
    _id: 2,
    status: "Cancelled",
  },
];

const dummyCustomer = {
  _id: {
    $oid: "6648e14695430d45ea44b732",
  },
  fname: "Yosef",
  mname: "Mercene",
  lname: "Cuenca",
  type: "Customer",
  email: "ycmcuenca@gmail.com",
  password: "ilove100",
  __v: 0,
  cart: [
    {
      item: "a08ad5b3-12e4-411a-98a6-3396efc5ea7b",
      quantity: 1,
      _id: {
        $oid: "66503159c7f7e2aa9dee52c6",
      },
    },
    {
      item: "94c8faae-fb1f-4b74-9331-90b2e6935b87",
      quantity: 1,
      _id: {
        $oid: "66505069b0cb991f43d36395",
      },
    },
    {
      item: "d13e3b4f-5ab6-44af-a2cc-68a14d7b45d7",
      quantity: 1,
      _id: {
        $oid: "66505078b0cb991f43d363a0",
      },
    },
    {
      item: "7a9473cf-6130-40f2-9ff3-49931e606ff7",
      quantity: 1,
      _id: {
        $oid: "665050d2b0cb991f43d363c8",
      },
    },
  ],
};

const dummyMerchant = {
  _id: {
    $oid: "6649e14625730d45ea44b762",
  },
  fname: "Yosef",
  mname: "Mercene",
  lname: "Cuenca",
  type: "Customer",
  email: "ycmcuenca@gmail.com",
  password: "ilove100",
  __v: 0,
  cart: [
    {
      item: "a08ad5b3-12e4-411a-98a6-3396efc5ea7b",
      quantity: 1,
      _id: {
        $oid: "66503159c7f7e2aa9dee52c6",
      },
    },
    {
      item: "94c8faae-fb1f-4b74-9331-90b2e6935b87",
      quantity: 1,
      _id: {
        $oid: "66505069b0cb991f43d36395",
      },
    },
    {
      item: "d13e3b4f-5ab6-44af-a2cc-68a14d7b45d7",
      quantity: 1,
      _id: {
        $oid: "66505078b0cb991f43d363a0",
      },
    },
    {
      item: "7a9473cf-6130-40f2-9ff3-49931e606ff7",
      quantity: 1,
      _id: {
        $oid: "665050d2b0cb991f43d363c8",
      },
    },
  ],
};

const router = createBrowserRouter(

  // FIXME: Revert root path element to <LoginPage />
  // TODO: clearly define all routes for all pages
  [
    // { path: "/", element: <RegisterPage /> },
    { path: "/", element: <CustomerHomePage categories={categories} /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    // { path: "/logout", element: <LogoutPage /> },
    {
      path: "/customer/home",
      element: <CustomerHomePage categories={categories} />,
    },
    {
      path: "/customer/orders",
      element: <CustomerOrdersPage status={status} />,
    },
    { path: "/customer/profile", element: <CustomerProfilePage /> },
    {
      path: "/merchant/home",
      element: <MerchantHomePage categories={categories} />,
    },
    {
      path: "/merchant/orders",
      element: <MerchantOrdersPage status={status} />,
    },
    { path: "/merchant/profile", element: <MerchantProfilePage /> },
    { path: "/merchant/users", element: <MerchantCustomerAccountsPage/> }
  ]

);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
