import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import Header from "../components/Header";
import InputField from "../components/InputField";
import styles from "../styles/Form.module.css";

import LOGO from "../assets/LOGO.png";

import FormTextInput from "../components/FormTextInput";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (e) {
      // ADD WHAT TO DO IF UNAUTHORIZED HERE
      // console.error(e);
    }
  };
  return (
    <>
		<div className="page bg-[url('./assets/rice-field.webp')] z-0">
				<section className="main backdrop-brightness-100 bg-white/50">
					<div className="flex flex-row w-full h-full p-[5rem]">
						<img src={LOGO} className="w-[40rem] h-[40rem] object-cover" />
						<div className="main backdrop-brightness-100 bg-white/50">
							<div className="heading1 text-[5rem]">Log In</div>
							<div className="w-[90%] flex flex-col">
								<form onSubmit={submitHandler} className="loginForm items-center justify-center">
									<div>
										<label htmlFor={"Email"} className="heading2 text-black">
											Email
										</label>
										<FormTextInput
											type="email"
											placeholder="Enter email"
											value={email}
											onChange={(e) => {
												setEmail(e);
											}}
										/>
									</div>
									<div>
										<label htmlFor={"Password"} className="heading2 text-black">
											Password
										</label>
										<FormTextInput
											type="password"
											placeholder="Enter password"
											value={password}
											onChange={(e) => {
												setPassword(e);
											}}
										/>
									</div>
									<a href="/register" className="heading3 text-green-800">
										No account yet? Register here.
									</a>
									<div className="flex h-[100%]"></div>
									<div className="flex flex-row  h-[3rem] gap-[1rem] w-full items-center">
										<button className="action-button bg-red-500 " type="reset">
											Reset
										</button>
										<button className="action-button bg-green-600" type="submit">
											Submit
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>
			</div>

    </>
  );
}

export default LoginPage;
