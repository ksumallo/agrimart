import PropTypes from "prop-types";
import ProfileSidebar from "../components/ProfileSidebar";
import FilterCategory from "../components/FilterCategory";
import { useState } from "react";
import ViewTransactionSidebar from "../components/ViewTransactionSidebar";
import SpaceFiller from "../components/SpaceFiller";
import NumResults from "../components/NumResults";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useSWR from "swr";

axios.defaults.withCredentials = true;

//TODO: filter transactions fetching by user id
var fetchedTransactions; // = await axios.get("http://localhost:3000/t/all").then(res => res.data);
var fetchedProducts; // = await axios.get("http://localhost:3000/product/all").then(res => res.data);

// let categories = ["Staple","Fruits","Livestock","Seafood","Others"]

function CustomerOrdersPage(props) {
	const [transactions, setTransactions] = useState(null);
	const [products, setProducts] = useState(null);
	const [selectedItem, setSelectedItem] = useState({});
	const [cartTotal, setTotal] = useState(0);
		const [selectedStatus, setStatus] = useState(null);
	const [user, setUserId] = useState({});

	const { userInfo } = useSelector((state) => state.auth);

	const navigate = useNavigate();
	useEffect(() => {
		console.log("USER: ", userInfo);
		if (!userInfo) navigate('/login');
		if (userInfo.type == 'admin') navigate('/merchant/home');
		
		setUserId(userInfo.userId);

		axios.get("http://localhost:3000/t/all").then(res => {
			setTransactions(res.data)
			fetchedTransactions = res.data
		});
		
		axios.get("http://localhost:3000/product/all").then(res => {
			setProducts(res.data)
			fetchedProducts = res.data
		});

		return;
	}, []);

	// const url = `http://localhost:3000/t/all`;
	// const fetcher = (url) => axios.get(url, { withCredentials: true }).then((res) => res.data);

	// const { data, isLoading, error } = useSWR(url, fetcher, {
	// 	onSuccess: (data, key, config) => {
	// 		setTransactions(products);
	// 		console.log("onSuccessSWR: ", data);
	// 	},
	// 	onError: () => console.log("SWRError: ", error),
	// 	revalidateOnMount: true, // Refresh on focus on window
	// 	refreshInterval: 1000, // Refresh every second lol
	// 	shouldRetryOnError: true,
	// });

	// useEffect(() => {
	// 	const fetchUser = () => axios.get('http://localhost:3000/user-info', { withCredentials: true })
	// 		.then(res => {
	// 		console.log('UserId: ', res.data.user);
	// 			setUserId(res.data.user);
	// 		})
	// 		.catch(e => console.log(e));

	// 	if (!fetchUser) return <Navigate to="/login" />;

	// 	// fetchedProducts = axios.get("http://localhost:3000/product/all", { withCredentials: true }).then((res) => res.data);
	// 	fetchedTransactions = axios.get("http://localhost:3000/t/all").then(res => res.data);
	// 	fetchedProducts = axios.get("http://localhost:3000/product/all").then(res => res.data);

	// 	console.log("ALLFETCHEDPRODUCTS: ", fetchedProducts);
	
	// }, []);

	function selectItem(item) {
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

	// function getIdFromFilter(filter) {
	// 	let foundCategory = props.status.find((category) => {
	// 		if (category.status === filter) {
	// 			return category;
	// 		}
	// 	});
	// 	return foundCategory._id;
	// }

	// function filterTransactions(filter) {
	// 	var filteredTransactions = transactions.filter(function (f) {
	// 		return f.status === getIdFromFilter(filter);
	// 	});
	// 	setTransactions(filteredTransactions);
	// 	return filteredTransactions;
	// }

	// function removeFilter(filter) {
	// 	console.log(filter);
	// 	setTransactions(fetchedTransactions);
	// }

	// function findProductById(id) {
	// 	let foundProduct = transactions.find((product) => product._id === id);
	// 	console.log("FoundProduct: ", foundProduct);
	// 	return foundProduct;
	// }

	// function getCartTotal(transaction) {
	// 	// console.log("CartToGetTotalOf: ", transaction);
	// 	let total = 0;
	// 	transaction.forEach((item) => {
	// 		let product = findProductById(item.item);
	// 		// console.log("PriceOfProduct: ", product);
	// 		total += product.price * item.quantity;
	// 	});

	// 	console.log('Total: ', total)
	// 	return total;
	// }

	function findProductById(id) {
		let foundProduct = fetchedProducts.find((product) => product._id === id);

		// console.log(`FoundProduct (${id}): `, foundProduct);

		return foundProduct;
	}

	function getCartTotal(cart) {
		// console.log('Your cart: ', cart);
		let TOTAL = cart.reduce((acc, item) => {
			let product = findProductById(item.item);
			// console.log(product)
			return acc + (product.price * item.quantity);
		}, 0);

		console.log('Computed total: ', TOTAL)
		return TOTAL;
	}

	return (
		<div className="page bg-[url('./assets/rice-field.webp')] z-0">
			<ProfileSidebar curr_page={"/orders"} profile_link={"/customer/profile"} browse_link={"/customer/home"} orders_link={"/customer/orders"}  />
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

			{selectedItem.customer ? <ViewTransactionSidebar selectedItem={selectedItem} products={fetchedProducts} status={props.status} cartTotal={cartTotal} findProductById={findProductById} isMerchant={false} /> : null}
		</div>
	);
}

CustomerOrdersPage.propTypes = {
	_id: PropTypes.string,
	status: PropTypes.array,
};

export default CustomerOrdersPage;
