import { useState } from "react";
import CartSidebar from "./CartSidebar";
import CartListItem from "./CartListItem";
import axios from "axios";

const CheckoutModal = ({ cart, show, hook }) => {

	async function addTransaction() {
		axios.post("http://localhost:3000/t/add")
			.then(res => hook(() => false)) // console.log("AddTransaction: ", res.statusText)
			.catch(e => console.log(e));
	}

	function getCartTotal() {
		const total = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);

		console.log('CartCheckout: ', cart)

		return total;
	}

	function getCartTotalItems() {
		const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

		console.log('CartCheckoutItems: ', totalItems)

		return totalItems;
	}

	return (
		<div className="z-50">
			{show && (
				<div>
					<div className="absolute center opacity-50 bg-black w-[100vw] h-[100vh] -m-[2rem]"></div>
					<div className="modal block center absolute w-[80vw] p-12 pb-8 bg-[#f0f0f0] .block left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md">
						<div className="flex">
							<div className="modal-content block flex-1">
								<h2 className="font-bold">Summary</h2>
								<div><span className="font-bold">Total amount</span> {getCartTotal()} </div>
								<div><span className="font-bold">Total items</span> {getCartTotalItems()} </div>
							</div>
							<div className="modal-aside block flex-1 overflow-y-scroll">
								<h2 className="font-bold">Shopping Cart</h2>

									<div className="h-[40vh]"> 
									{
										cart.map((cartData) => (
											<CartListItem key={cartData.item} cartItem={cartData} hasDelete={false} />
										))
									}
								</div>
							</div>
						</div>

						<div className="flex flex-row gap-[3rem]">
							
							<button className="action-button p-2 bg-gray-500" onClick={() => hook(() => false)}>
								Close Modal
							</button>
							<button className="action-button p-2" onClick={addTransaction}>
								Proceed
							</button>
						</div>

					</div>
				</div>
			)}
		</div>
	);
};

export default CheckoutModal;
