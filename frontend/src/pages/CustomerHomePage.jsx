import PropTypes from "prop-types";
import CartSidebar from "../components/CartSidebar";
import FilterCategory from "../components/FilterCategory";
import ProductCard from "../components/ProductCard";
import ProfileSidebar from "../components/ProfileSidebar";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import ProductDetails from "../components/ProductDetails";
import NumResults from "../components/NumResults";
import axios from "axios";
import CheckoutModal from "../components/CheckoutModal";
import { useSelector } from "react-redux";
import BROWSE from '../assets/BROWSE.png';
import SortSelectInput from "../components/SortSelectInput";

axios.defaults.withCredentials = true;

var fetchedProducts;

function CustomerHomePage(props) {
	const [selectedItem, setSelectedItem] = useState({});
	const [selectedCategory, setCategory] = useState(null);
	const [products, setProducts] = useState([]);
	const [isModalVisible, showCheckoutModal] = useState(false);
	const [user, setUserId] = useState(null);
	
	const { userInfo } = useSelector((state) => state.auth);
	
	const navigate = useNavigate();
	useEffect(() => {
		console.log("USER: ", userInfo);
		if (!userInfo) navigate('/login');
		if (userInfo.type == 'admin') navigate('/merchant/home');
		
		setUserId(userInfo.userId);

		fetchedProducts = axios.get("http://localhost:3000/product/all", { withCredentials: true })
			.then((res) => {
				setProducts(res.data)
				fetchedProducts = res.data
			});


		// OLD
		// const [cart, setCart] = useState([]);
		// const products = await axios.get("http://localhost:3000/product/all").then(res => res.data);
	}, []);


	const [sortAttribute, setSortAttribute] = useState("name");
	const [sortOrder, setSortOrder] = useState("asc");

	const prodAttributes = ["name", "quantity", "price"];
	const sortOrders = ["asc", "desc"];
	// useEffect(() => {
	// 	sortProductsBy(sortAttribute, sortOrder);
	// }, [sortAttribute, sortOrder]);

	function selectAttribute(attrib) {
		setSortAttribute(() => {
			const getAttrib = attrib;
			return getAttrib;
		});
	}

	function selectOrder(order) {
		setSortOrder(() => {
			const getOrder = order;
			return getOrder;
		});
	}

	const url = `http://localhost:3000/cart`;
	console.log("URL: ", url);

	// Map products to ObjectId's
	const fetcher = (url) => axios.get(url, { withCredentials: true }).then((res) => res.data);

	const { data, isLoading, error } = useSWR(url, fetcher, {
		onSuccess: (data, key, config) => {
			setProducts(products);
			console.log("onSuccessSWR: ", data);
		},
		onError: () => console.log("SWRError: ", error),
		revalidateOnMount: true, // Refresh on focus on window
		refreshInterval: 1000, // Refresh every second lol
		shouldRetryOnError: true,
	});

	if (error) return <div> Failed to load products. </div>;
	if (isLoading) return <div> Loading... </div>;

	function selectItem(props) {
		setSelectedItem(() => {
			const currItem = props;
			return currItem;
		});
	}

	function getIdFromFilter(filter) {
		let foundCategory = props.categories.find((category) => {
			if (category.category === filter) {
				return category;
			}
		});
		return foundCategory._id;
	}

	function filterProducts(filter) {
		var filteredProducts = fetchedProducts.filter(function (f) {
			return f.type === getIdFromFilter(filter);
		});
		setCategory(filter);
		setProducts(filteredProducts);
		return filteredProducts;
	}

	function removeFilter() {
		setCategory(null);
		setProducts(fetchedProducts);
	}

	function searchProducts(input) {
		var searchedProducts = fetchedProducts.filter((products) => {
			return products.name.toLowerCase().includes(input.toLowerCase());
		});
		setProducts(searchedProducts);
	}

	// OLD
	async function deleteFromCart(cartItem) {
		console.log("trying to delete...");
		axios
			.post(`http://localhost:3000/cart/remove?userId=${user.id}&productId=${cartItem._id}`)
			.then((res) => console.log("DeleteFromCart: ", res.statusText))
			// .then((json) => setCart(json))
			.catch((e) => console.log(e));
		// console.log("NewCartAfterDelete: ", response);
		// const newCart = response.data

		// setCart(() => newCart);
	}

	// function updateCartItemsToId(cart) {
	// 	let cartUsingId = cart;
	// 	cartUsingId.map((cartItem) => {
	// 		cartItem.item = cartItem.item._id;
	// 	});
	// 	return cartUsingId;
	// }

	//TODO: implement checkout function for user's shopping cart
	function checkout() {
		showCheckoutModal(() => true);
		console.log("isModalVisible: ", isModalVisible);
		// console.log(updateCartItemsToId(cart));
	}

	function addToCart(selectedItem) {
		console.log("trying to add...", selectedItem);
		axios
			.post(`http://localhost:3000/cart/add?productId=${selectedItem._id}`)
			.then((res) =>
				console.log("AddToCart: ", res.statusText)
				)
			// .then((json) => setCart(json))
			.catch((e) => console.log(e));
	}

	function sortProductsBy(attribute, order) {
		let sorted = sortArray(products, { by: attribute, order: order });
		setProducts(sorted);
		return sorted;
	}

	return (
		<div className="page bg-[url('./assets/rice-field.webp')] z-0">
			<CheckoutModal show={isModalVisible} cart={data} hook={showCheckoutModal} createTransaction={checkout} />
			<ProfileSidebar profile_link={"/customer/profile"} browse_link={"/customer/home"} orders_link={"/customer/orders"} />
			<section className="main z-20">
				<div className="header flex-wrap">
					<div className="heading1 w-[40%]">Browse {selectedCategory ? selectedCategory : "Products"}</div>
					<img src={BROWSE} className="flex w-[4rem] h-[4rem] object-cover p-[0.25rem]" />
					<input name="searchbar" type="text" className="searchbar" placeholder="Search for products..." onChange={(e) => searchProducts(e.target.value)}></input>
				</div>
				<div className="flex flex-row items-end w-full">
					<div className="categories flex-2 ml-[-0.5rem] mr-[1rem]  items-center">
						{props.categories.map((categoryData) => (
							<FilterCategory key={categoryData._id} category={categoryData.category} filterFunc={filterProducts} />
						))}
						<FilterCategory category={"All"} filterFunc={removeFilter} />
					</div>
					<div className="flex flex-col items-center min-w-[12rem] h-full mt-[-1rem] mr-[-0.5rem] bg-white p-[0.25rem] rounded-xl shadow-xl">
						<div className="flex flex-row">
							<SortSelectInput fieldname={"sort-by-attribute"} label={null} value={sortAttribute} options={prodAttributes} onChange={selectAttribute} />
							<SortSelectInput fieldname={"sort-order"} label={null} value={sortOrder} options={sortOrders} onChange={selectOrder} />
						</div>
						<button
							className="action-button h-[3rem]"
							onClick={
								// handleSort
									() => {
									sortProductsBy(sortAttribute, sortOrder);
									setProducts(products);
								}
							}
						>
							sort
						</button>
					</div>
				</div>

				<div className="h-full"></div>
				<div className="body mt-[8rem]">
					<NumResults results={products ?? []} />
					<div className="product-grid">
						{products && products.map((productData) => (
							<ProductCard key={productData._id} product={productData} onClick={selectItem} />
						))}
					</div>
				</div>
				{selectedItem._id ? <ProductDetails selectedItem={selectedItem} addToCartFunc={addToCart} /> : null}
			</section>

			<CartSidebar cart={data} deleteFunc={deleteFromCart} checkoutFunc={showCheckoutModal} />
		</div>
	);
}

CustomerHomePage.propTypes = {
	categories: PropTypes.array.isRequired,
	product: PropTypes.object,
};

export default CustomerHomePage;
