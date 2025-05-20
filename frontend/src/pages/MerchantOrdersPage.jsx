import PropTypes from "prop-types";
import ProfileSidebar from "../components/ProfileSidebar";
import FilterCategory from "../components/FilterCategory";
import { useState } from "react";
import ViewTransactionSidebar from "../components/ViewTransactionSidebar";
import SpaceFiller from "../components/SpaceFiller";
import NumResults from "../components/NumResults";
import axios from "axios";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

axios.defaults.withCredentials = true;

//TODO: filter transactions fetching by user id
var fetchedTransactions; // = await axios.get("http://localhost:3000/t/all").then((res) => res.data);
var fetchedProducts; // = await axios.get("http://localhost:3000/product/all").then((res) => res.data);

function MerchantOrdersPage(props) {
	const [transactions, setTransactions] = useState([]);
	const [selectedItem, setSelectedItem] = useState({});
	const [selectedStatus, setStatus] = useState(null);
	const [cartTotal, setTotal] = useState(0);
	const [user, setUserId] = useState({});

	useEffect(() => {
		const fetchUser = () => axios.get('http://localhost:3000/user-info', { withCredentials: true })
			.then(res => {
			console.log('UserId: ', res.data.user);
				setUserId(res.data.user);
			})
			.catch(e => console.log(e));

		if (!fetchUser) return <Navigate to="/login" />;

		axios.get("http://localhost:3000/product/all", { withCredentials: true })
			.then((res) => fetchedProducts = res.data);
		axios.get("http://localhost:3000/t/all")
			.then((res) => {
				setTransactions(res.data)
				fetchedTransactions = res.data
				console.log("AllFetchedTransactions: ", transactions);
				return res.data;
			});
	}, []);

	function selectItem(item) {
		console.log(item);
		setSelectedItem(() => {
			const currItem = item;
			return currItem;
		});
	}

	function getIdFromFilter(filter) {
		let foundCategory = props.status.find((category) => {
			if (category.status === filter) {
				return category;
			}
		});

		return foundCategory._id;
	}

	function filterTransactions(filter) {
		console.log('getidfromfilter: ', filter, getIdFromFilter(filter));
		var filteredTransactions = fetchedTransactions
			.filter(transaction => transaction.status === getIdFromFilter(filter));

		console.log('filteredTransactions: ', filteredTransactions);
		setStatus(filter);
		setTransactions(filteredTransactions);
		return filteredTransactions;
	}

	function removeFilter(filter) {
		console.log(filter);
		setTransactions(fetchedTransactions);
		setStatus(null);
	}

	function findProductById(id) {
		if (fetchedProducts) {
			let foundProduct = fetchedProducts.find((product) => product._id === id);
			console.log(`FoundProduct (${id}): `, foundProduct);
			return foundProduct;
		}
		return 
	}

	function getCartTotal(cart) {
		//console.log(cart);
		let total = 0;
		cart.forEach(function (item) {
			let product = findProductById(item.item);
			total = total + product.price * item.quantity;
		});
		return total;
	}

	return (
		<div className="page bg-[url('./assets/rice-field.webp')] z-0">
			<ProfileSidebar curr_page={"/orders"} profile_link={"/merchant/profile"} browse_link={"/merchant/home"} orders_link={"/merchant/orders"} accounts_link={"/merchant/users"} />
			<section className="main z-20">
				<div className="header flex-col content-start justify-start items-start">
					<div className="heading1 text-start items-start">Total {selectedStatus} Orders</div>
					<div className="statuses">
						{props.status.map((categoryData) => (
							<FilterCategory key={categoryData._id} category={categoryData.status} filterFunc={filterTransactions} />
						))}
						<FilterCategory category={"All Orders"} filterFunc={removeFilter} />
					</div>
				</div>
				<div className="body mt-[7rem]">
					<div className="flex flex-col p-[1.25rem] gap-[1.25rem] flex-1 justify-start items-start content-start self-stretch overflow-y-auto">
						<NumResults results={transactions ?? []} />
						{transactions && transactions.map((transactionInfo) => (
							<div
								className="list-tile"
								key={transactionInfo._id}
								onClick={() => {
									selectItem(transactionInfo);
									setTotal(getCartTotal(transactionInfo.content));
								}}
							>
								{transactionInfo.date_ordered}
								<SpaceFiller />
								{`Total: ₱${getCartTotal(transactionInfo.content)}`}
							</div>
						))}
					</div>
				</div>
			</section>

			{selectedItem.customer ? <ViewTransactionSidebar selectedItem={selectedItem} products={fetchedProducts} status={props.status} cartTotal={cartTotal} findProductById={findProductById} isMerchant={true} /> : null}
		</div>
	);
}

MerchantOrdersPage.propTypes = {
	_id: PropTypes.string,
	status: PropTypes.array,
};

export default MerchantOrdersPage;
