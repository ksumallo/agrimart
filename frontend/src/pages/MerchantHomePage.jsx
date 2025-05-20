import PropTypes from "prop-types";
import FilterCategory from "../components/FilterCategory";
import ProductCard from "../components/ProductCard";
import ProfileSidebar from "../components/ProfileSidebar";
import { useState, useEffect } from "react";
import UpdateProductSidebar from "../components/UpdateProductSidebar";
import NumResults from "../components/NumResults";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BROWSE from "../assets/BROWSE.png";
import sortArray from "sort-array";
import SortSelectInput from "../components/SortSelectInput";

axios.defaults.withCredentials = true;

var fetchedProducts; // = await axios.get("http://localhost:3000/product/all").then((res) => res.data);

function MerchantHomePage(props) {

	const [selectedItem, setSelectedItem] = useState({});
	const [selectedCategory, setCategory] = useState(null);
	const [products, setProducts] = useState(null);
	const [user, setUserId] = useState(null);
	
	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.auth);

	const [sortAttribute, setSortAttribute] = useState("name");
	const [sortOrder, setSortOrder] = useState("asc");

	// useEffect(() => {
	// 	if (fetchedProducts)
	// 		sortProductsBy(sortAttribute, sortOrder);
	// }, [sortAttribute, sortOrder, fetchedProducts]);

	const prodAttributes = ["name", "quantity", "price"];
	const sortOrders = ["asc", "desc"];

	useEffect(() => {
		console.log("ADMIN: ", userInfo);
		if (!userInfo) navigate('/login');
		if (userInfo.type != 'admin') navigate('/logout');
		
		setUserId(userInfo.userId);

		fetchedProducts = axios.get("http://localhost:3000/product/all", { withCredentials: true })
			.then((res) => {
				fetchedProducts = res.data
				console.log("RES: ", res.data);
				setProducts(res.data)
			});
	}, []);

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

	function sortProductsBy(attribute, order) {
		let sorted = sortArray(products, { by: attribute, order: order });
		setProducts(sorted);
		return sorted;
	}

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
		setProducts(filteredProducts);
		setCategory(filter);
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

	return (
		// <div className="page bg-[url('./assets/rice-field.webp')] z-0">
		// 	<ProfileSidebar profile_link={"/merchant/profile"} browse_link={"/merchant/home"} orders_link={"/merchant/orders"} />
		// 	<section className="main z-20">
		// 		<div className="header flex-wrap">
		// 			<div className="heading1 w-[30%]">Browse {selectedCategory ? selectedCategory : "Products"}</div>
		// 			<input name="searchbar" type="text" className="searchbar" onChange={(e) => searchProducts(e.target.value)}></input>
		// 		</div>
		// 		<div className="categories">
		// 			{props.categories.map((categoryData) => (
		// 				<FilterCategory key={categoryData._id} category={categoryData.category} filterFunc={filterProducts} />
		// 			))}
		// 			<FilterCategory category={"Remove Filter"} filterFunc={removeFilter} />
		// 		</div>
		// 		<div className="body">
		// 			<NumResults results={products} />
		// 			<div className="product-grid">
		// 				<ProductCard
		// 					product={{
		// 						name: "New item name",
		// 						description: "New item description",
		// 						type: 1,
		// 						quantity: 0,
		// 						price: 0,
		// 						img: "New item url",
		// 					}}
		// 					onClick={selectItem}
		// 				/>
		// 				{products.map((productData) => (
		// 					<ProductCard key={productData._id} product={productData} onClick={selectItem} />
		// 				))}
		// 			</div>
		// 		</div>
		// 	</section>
		// 	{selectedItem.name ? <UpdateProductSidebar selectedItem={selectedItem} categories={props.categories} /> : <div />}
		// </div>

		// NEW
		<div className="page bg-[url('./assets/rice-field.webp')] z-0">
			<ProfileSidebar curr_page={"/home"} profile_link={"/merchant/profile"} browse_link={"/merchant/home"} orders_link={"/merchant/orders"} accounts_link={"/merchant/users"} />
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
							onClick={() => {
								sortProductsBy(sortAttribute, sortOrder);
								setProducts(products);
							}}
						>
							sort
						</button>
					</div>
				</div>
				<div className="h-full"></div>
				<div className="body mt-[8rem]">
					<NumResults results={products ?? []} />
					<div className="product-grid">
						<ProductCard
								product={{
									name: "New item name",
									description: "New item description",
									type: 1,
									quantity: 0,
									price: 0,
									img: "https://cdn-icons-png.flaticon.com/512/10608/10608883.png",
								}}
								onClick={selectItem}
								/>
						{products && products.map((productData) => (
							<ProductCard key={productData._id} product={productData} onClick={selectItem} />
						))}
					</div>
				</div>
			</section>
			{selectedItem.name && <UpdateProductSidebar selectedItem={selectedItem} categories={props.categories} />}
		</div>
	);
}

MerchantHomePage.propTypes = {
	_id: PropTypes.string,
	categories: PropTypes.array,
};

export default MerchantHomePage;
