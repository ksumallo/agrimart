import ProfileSidebar from "../components/ProfileSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import FormTextInput from "../components/FormTextInput";
import axios from "axios";
import LogoutButton from "../pages/LogoutButton";

function CustomerProfilePage() {
		const [user, setUser] = useState(null);
		useEffect(() => {
		console.log("USER: ", userInfo);
		if (!userInfo) navigate('/login');
		// if (userInfo.type == 'admin') navigate('/merchant/home');
		
		setUser(userInfo.userId);

		axios.get("http://localhost:3000/user-info", { withCredentials: true })
			.then((res) => {
				console.log(res.data.user)
				setUser(res.data.user)
			});
		// OLD
		// const [cart, setCart] = useState([]);
		// const products = await axios.get("http://localhost:3000/product/all").then(res => res.data);
	}, []);
	const [firstName, setFirstName] = useState(user ? user.fname : null);
	
	const [middleName, setMiddleName] = useState(user ? user.mname : null);
	const [lastName, setLastName] = useState(user ? user.lname : null);
	const [email, setEmail] = useState(user ? user.email : null);
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();

	const [updateInfo, { isLoading }] = useUpdateProfileMutation();


	
	const { userInfo } = useSelector((state) => state.auth);
	
	const navigate = useNavigate();
	

	// const { userInfo } = useSelector((state) => state.auth);

	// useEffect(() => {
	//   if (userInfo) {
	//     navigate("/");
	//   }
	// }, [navigate, userInfo]);

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const res = await updateInfo({
				firstName,
				middleName,
				lastName,
				email,
				password,
			}).unwrap();
			dispatch(setCredentials({ ...res }));
			// navigate("/");
		} catch (error) {
			console.error("Update failed:", error);
		}
	};

	return (
		<div className="page bg-[url('./assets/rice-field.webp')] z-0">
				
			<ProfileSidebar curr_page={"/profile"} profile_link={"/customer/profile"} browse_link={"/customer/home"} orders_link={"/customer/orders"} />
			<section className="main">
			<div className="flex w-full">
				<div className="heading1">Mabuhay, {user ? user.fname : ''}</div>
				<div className='w-full'></div>
				<LogoutButton />
			</div>
			<div className="heading1 w-full mt-[5rem]">Edit your information</div>
				<form onSubmit={submitHandler} className="items-center justify-center w-full overflow-y-scroll">
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
	
					<div className="flex h-[10%]"></div>
					<div className="flex flex-row  h-[3rem] gap-[1rem] w-full items-center">
						<button className="action-button bg-red-500 " type="reset">
							Reset
						</button>
						<button className="action-button bg-green-600" type="submit">
							Edit Details
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}

export default CustomerProfilePage;
