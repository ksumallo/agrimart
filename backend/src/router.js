import { Product, Cart, Transaction, User } from "./controller.js";
import { registerUser, loginUser } from "./controller_auth.js";
import {
  auth_register,
  auth_user,
  auth_logout,
  auth_protect,
  auth_adminOnly,
  auth_getUser,
  auth_updateUser,
} from "./auth_controller.js";
import cors from "cors"; // Import cors here
import cookieParser from "cookie-parser";

export function router(app) {
  app.use(
    cors({
      origin: function (origin, callback) {
        callback(null, origin); // reflect the request origin back
      },
      credentials: true, // allow credentials
    })
  );
  app.use(cookieParser());

  // Products
  app.get("/product/all", [auth_protect], Product.getProducts);
  app.post("/product/add", [auth_protect, auth_adminOnly], Product.addProduct);
  app.post("/product/delete", [auth_protect, auth_adminOnly], Product.deleteProduct);
  app.post(
    "/product/update",
    [auth_protect, auth_adminOnly],
    Product.updateProduct
  );

  // Cart
  // Cart
  app.get("/cart", [auth_protect], Cart.getCart);
  app.post("/cart/add", [auth_protect], Cart.addItem);
  app.post("/cart/reduce", [auth_protect], Cart.reduceItem);
  app.post("/cart/remove", [auth_protect], Cart.removeItem);

  // Transaction
  app.get("/t/all", [auth_protect], Transaction.getTransactions);
  app.post("/t/add", [auth_protect], Transaction.addTransaction);
  app.post("/t/update", [auth_protect], Transaction.changeStatus);
  app.get("/t/report", [auth_protect, auth_adminOnly], Transaction.annualTransaction);

  // Authentication
  app.route("/api/users/auth").post(auth_user);
  app.get("/api/users", [auth_protect, auth_adminOnly], User.getUsers);
  app.post("/api/users/register", auth_register);
  app.post("/api/users/logout", [auth_protect], auth_logout);
  app.post("/api/users/update", [auth_protect], auth_updateUser);
  app.route("/user-info").get([auth_protect], auth_getUser);
}
