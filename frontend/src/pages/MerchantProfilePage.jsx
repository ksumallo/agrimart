import ProfileSidebar from "../components/ProfileSidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton";

function MerchantProfilePage() {
	//TODO: link to database, use fetch requests instad of dummy data

	const [user, setUser] = useState(null);
  const [reports, setReports] = useState(null);
	
	const { userInfo } = useSelector((state) => state.auth);
	
	const navigate = useNavigate();
	useEffect(() => {
		if (!userInfo) navigate('/login');
		if (userInfo.type != 'admin') navigate('/login');
		
		setUser(userInfo.userId);

		axios.get("http://localhost:3000/t/report", { withCredentials: true })
			.then((res) => {
				console.log('Reports: ', res.data)
				setReports(res.data);
			});

      axios.get("http://localhost:3000/user-info", { withCredentials: true })
			.then((res) => {
				console.log('User: ', res.data.user)
				setUser(res.data.user);
			});


		// OLD
		// const [cart, setCart] = useState([]);
		// const products = await axios.get("http://localhost:3000/product/all").then(res => res.data);
	}, []);

	return (
		<div className="page bg-[url('./assets/rice-field.webp')] z-0">
			
			<ProfileSidebar curr_page={"/profile"} profile_link={"/merchant/profile"} browse_link={"/merchant/home"} orders_link={"/merchant/orders"} accounts_link={"/merchant/users"} />
			<section className="main items-start w-full">
				<div className="flex-col items-start ">
					<div className="heading2">Mabuhay,</div>
					<div className="flex flex-row items-end gap-[1rem]">
						<div className="heading1">
						{user ? `${user.fname} ${user.lname}!` : null}
						</div>
						<div className="text-xl pb-[0.5rem]">{user ? `(${user.email})` : null}</div>
						<div className="flex ">
            <div className="w-full"></div>
				<LogoutButton/>
			</div>
					</div>
				</div>
				<div className="body mt-[7rem]">
					<div className="flex flex-row gap-[2rem] items-end">
						<div className="text-[4rem] font-extrabold">Sales report</div>
						<div className="text-[2rem] pb-[0.8rem]">as of today</div>
					</div>
					<div className="grid grid-cols-1 w-full gap-[1rem]">
						<div className="card heading1 items-start h-[6rem] p-[1rem] justify-center">Total Earnings</div>
						<div className="grid grid-cols-3 w-full gap-[1rem]">
							<div className="card heading2 h-[12rem] justify-center text-center">Yearly  <br />  {(reports) ? 'Php ' + reports.annual : ''}</div>
							<div className="card heading2 h-[12rem] justify-center text-center">Monthly  <br />  {(reports) ? 'Php ' + reports.monthly : ''}</div>
							<div className="card heading2 h-[12rem] justify-center text-center">Past 7 Days <br /> {(reports) ? 'Php ' + reports.week : ''}</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default MerchantProfilePage;
