import ProfileSidebar from "../components/ProfileSidebar";
import { useState } from "react";
import SpaceFiller from "../components/SpaceFiller";
import NumResults from "../components/NumResults";
import axios from "axios";
import ViewUserSidebar from "../components/ViewUserSidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

var fetchedUsers;

function MerchantCustomerAccountsPage() {
	const [users, setUsers] = useState(fetchedUsers);
	const [selectedUser, setSelectedUser] = useState({});
	const [userId, setUserId] = useState({});

	const { userInfo } = useSelector((state) => state.auth);
	const navigate = useNavigate(); 

	useEffect(() => {
		console.log("ADMIN: ", userInfo);
		if (!userInfo) navigate('/login');
		if (userInfo.type != 'admin') navigate('/logout');
		
		setUserId(userInfo.userId);

		axios.get("http://localhost:3000/api/users").then((res) => {
			console.log("RES: ", res.data);
			setUsers(res.data)
			fetchedUsers = res.data
		});

		// fetchedProducts = axios.get("http://localhost:3000/product/all", { withCredentials: true })
		// 	.then((res) => {
		// 		console.log("RES: ", res.data);
		// 		setProducts(res.data)
		// 	});

		// axios.get('http://localhost:3000/user-info', { withCredentials: true })
		// 	.then(res => {
		// 		console.log('UserId: ', res.data.user);
		// 		setUserId(res.data.user);
		// 	})
		// 	.catch(e => console.log(e));

		// // if (!fetchUser) useNavigate()("/login")


		// return 
		// const fetchUser = () => axios.get('http://localhost:3000/user-info', { withCredentials: true })
		// 	.then(res => {
		// 	console.log('UserId: ', res.data.user);
		// 		setUserId(res.data.user);
		// 	})
		// 	.catch(e => console.log(e));

		// if (!fetchUser) return <Navigate to="/login" />;

		// // fetchedProducts = axios.get("http://localhost:3000/product/all", { withCredentials: true }).then((res) => res.data);
		// fetchedProducts = axios.get("http://localhost:3000/product/all").then((res) => res.data);
		// setProducts(fetchedProducts);

		// console.log("ALLFETCHEDPRODUCTS: ", fetchedProducts);
	}, []);

	function selectUser(user) {
		console.log(user);
		setSelectedUser(() => {
			const currUser = user;
			return currUser;
		});
	}

	return (
		<div className="page bg-[url('./assets/rice-field.webp')] z-0">
			<ProfileSidebar curr_page={"/accounts"} profile_link={"/merchant/profile"} browse_link={"/merchant/home"} orders_link={"/merchant/orders"} accounts_link={"/merchant/users"} />
			<section className="main z-20">
				<div className="header flex-row content-start justify-between items-start">
					<div className="heading1 text-start items-start">
						<div className="flex">All Customer Accounts</div>
						<div className="flex w-full" />
					</div>
				</div>
				<div className="body">
					<div className="flex flex-col p-[1.25rem] gap-[1.25rem] flex-1 justify-start items-start content-start self-stretch overflow-y-auto">
						<NumResults results={users} />
						{users && users.map((user) => (
							<div
								className="list-tile text-[1.5rem] font-extrabold font-rem"
								key={user}
								onClick={() => {
									selectUser(user);
								}}
							>
								{user.fname}
								<SpaceFiller />
								{user.email}
							</div>
						))}
					</div>
				</div>
			</section>
			{selectedUser._id ? <ViewUserSidebar selectedUser={selectedUser} /> : null}
		</div>
	);
}

export default MerchantCustomerAccountsPage;
