import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import LOGO from '../assets/LOGO.png';
import FormTextInput from "../components/FormTextInput";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
	
    try {
      const res = await register({
        firstName,
        middleName,
        lastName,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  return (
    <>
      			<div className="page bg-[url('./assets/rice-field.webp')] z-0">
				<section className="main backdrop-brightness-100 bg-white/50">
					<div className="flex flex-row w-full h-full p-[5rem]">
						<img src={LOGO} className="w-[40rem] h-[40rem] object-cover" />
						<div className="main backdrop-brightness-100 bg-white/50">
							<div className="heading1 text-[5rem]">Register</div>
							<div className="w-[90%] flex flex-col">
								<form onSubmit={submitHandler} className="loginForm items-center justify-center overflow-y-scroll">
									<div>
										<label htmlFor={"name"} className="heading2 text-black">
											First Name
										</label>
										<FormTextInput
											type="name"
											placeholder="Enter First Name"
											value={firstName}
											onChange={(e) => {
												setFirstName(e);
											}}
										/>
									</div>
									<div>
										<label htmlFor={"name"} className="heading2 text-black">
											Middle Name
										</label>
										<FormTextInput
											type="name"
											placeholder="Enter Middle Name"
											value={middleName}
											onChange={(e) => {
												setMiddleName(e);
											}}
										/>
									</div>
									<div>
										<label htmlFor={"name"} className="heading2 text-black">
											Last Name
										</label>
										<FormTextInput
											type="name"
											placeholder="Enter Last Name"
											value={lastName}
											onChange={(e) => {
												setLastName(e);
											}}
										/>
									</div>
									<div>
										<label htmlFor={"email"} className="heading2 text-black">
											Email
										</label>
										<FormTextInput
											type="email"
											placeholder="Enter Email"
											value={email}
											onChange={(e) => {
												setEmail(e);
											}}
										/>
									</div>
									<div>
										<label htmlFor={"password"} className="heading2 text-black">
											Password
										</label>
										<FormTextInput
											type="password"
											placeholder="Enter Password"
											value={password}
											onChange={(e) => {
												setPassword(e);
											}}
										/>
									</div>
									<a href="/login" className="heading3 text-green-800">
										Already have an account? Log-in here.
									</a>
									<div className="flex h-[10%]"></div>
									<div className="flex flex-row  h-[3rem] gap-[1rem] w-full items-center">
										<button className="action-button bg-red-500 " type="reset">
											Reset
										</button>
										<button 
										
										className="action-button bg-green-600" type="submit">
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

export default RegisterPage;
