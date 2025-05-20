import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FormTextInput from "./FormTextInput";
import FormSelectInput from "./FormSelectInput";
import FormTextAreaInput from "./FormTextAreaInput";
import axios from "axios";

function UpdateProductSidebar(props) {
	const [productName, setProductName] = useState(props.selectedItem.name);
	const [productDesc, setProductDesc] = useState(props.selectedItem.description);
	const [productCategory, setProductCategory] = useState(props.categories[props.selectedItem.type - 1].category);
	const [productQty, setProductQty] = useState(props.selectedItem.quantity);
	const [productPrice, setProductPrice] = useState(props.selectedItem.price);
	const [productImg, setProductImg] = useState(props.selectedItem.img);
	useEffect(() => {
		setProductName(props.selectedItem.name);
		setProductDesc(props.selectedItem.description);
		setProductCategory(props.categories[props.selectedItem.type - 1].category);
		setProductQty(props.selectedItem.quantity);
		setProductPrice(props.selectedItem.price);
		setProductImg(props.selectedItem.img);
	}, [props]);

	//TODO: simplify idExtraction of category
	function getIdOfCategory(category) {
		let foundCateg = props.categories.find((categoryData) => {
			if (category === categoryData.category) {
				console.log("FIND", categoryData._id);
				return categoryData._id;
			}
		});
		return foundCateg._id;
	}

	function addProduct() {
		const newProduct = {
			name: productName,
			description: productDesc,
			type: getIdOfCategory(productCategory),
			quantity: productQty,
			price: productPrice,
			img: productImg,
		};

		axios.post("http://localhost:3000/product/add", newProduct)
			.then((res) => console.log(res.data));

		console.log(newProduct)
	}

	function updateProduct() {
		const updatedDetails = {
			_id: props.selectedItem._id,
			name: productName,
			description: productDesc,
			type: getIdOfCategory(productCategory),
			quantity: productQty,
			price: productPrice,
			img: productImg,
		};

		axios.post(`http://localhost:3000/product/update?productId=${updatedDetails._id}`, updatedDetails)
			.then((res) => {
				console.log(res.data);
			});
			
		console.log(updatedDetails);
	}

	function deleteProduct() {
		axios.post(`http://localhost:3000/product/delete?productId=${props.selectedItem._id}`)
			.then((res) => {
				console.log(res.statusText);
			});

		console.log(`TO DELETE: ${props.selectedItem._id}`);	
	}

	return (
		<>
			<aside className="sidebar">
				<div className="header">{`Viewing ${props.selectedItem.name}`}</div>
				<div className="body">
					<div className="w-full min-h-[15rem] max-h-[15rem] bg-white rounded-2xl">
						<img className="object-contain h-full w-full" src={props.selectedItem.img} />
					</div>
					<form className="w-full flex flex-col gap-[0.5rem] overflow-y-scroll">
						<FormTextInput fieldname={"name"} type={"text"} label={"Product name: "} value={productName} onChange={setProductName} id={props.selectedItem._id} />
						<FormTextAreaInput fieldname={"description"} label={"Description: "} value={productDesc} onChange={setProductDesc} id={props.selectedItem._id} />
						<FormSelectInput fieldname={"category"} label={"Category: "} value={productCategory} options={props.categories} object={props.selectedItem} onChange={setProductCategory} />
						<FormTextInput fieldname={"quantity"} type={"number"} label={"Quantity (kg): "} value={productQty} onChange={setProductQty} id={props.selectedItem._id} />
						<FormTextInput fieldname={"price"} type={"number"} label={"Price (PHP): "} value={productPrice} onChange={setProductPrice} id={props.selectedItem._id} />
						<FormTextInput fieldname={"img"} type={"text"} label={"Image (url): "} value={productImg} onChange={setProductImg} id={props.selectedItem._id} />
					</form>
				</div>
				<div className="action">
					{
						// checker if adding a new item or editing an existing one
						props.selectedItem.name != "New item name" ? (
							<div className="flex flex-row h-[3.5rem] gap-[0.5rem] w-full justify-center">
								<button
									className="action-button bg-red-500"
									onClick={deleteProduct}
								>
									Delete
								</button>
								<button
									type="submit"

									className="action-button bg-green-600mb-[1.5rem] ml-[0.75rem] mr-[1.5rem]"
									onClick={ () => updateProduct() }

								>
									Edit
								</button>
							</div>
						) : (
							// TODO: form validation
							<div className="flex h-[4.5rem] w-full py-[0.5rem] px-[1rem]">
								<button
									className="action-button"
									onClick={() => {
										addProduct();
									}}
								>
									Add Product
								</button>
							</div>
						)
					}
				</div>
			</aside>
		</>
	);
}

UpdateProductSidebar.propTypes = {
	selectedItem: PropTypes.object,
	categories: PropTypes.array,
};

export default UpdateProductSidebar;
