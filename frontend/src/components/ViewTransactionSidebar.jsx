import PropTypes from "prop-types";
import axios from "axios";

function ViewTransactionSidebar(props) {
	function getStatusFromId(id) {
		let foundStatus = props.status.find((stat) => {
			if (stat._id === id) {
				return stat;
			}
		});
		return foundStatus;
	}

	async function updateStatus() {
		await axios.post(`http://localhost:3000/t/update?tId=${props.selectedItem._id}&status=1`)
			.then((res) => console.log('Successfully completed transaction') )
	}

	async function cancelOrder() {
		await axios.post(`http://localhost:3000/t/update?tId=${props.selectedItem._id}&status=2`)
			.then((res) => 
				console.log('Successfully cancelled transaction'))
	}

	return (
		<>
			<aside className="sidebar">
				<div className="header">Order Details</div>
				<div className="body">
					<div className="flex flex-col w-full">
						<div>Order Id</div>
						<div>{props.selectedItem._id}</div>
					</div>
					<div className="flex flex-col w-full">
						<div>Date Ordered</div>
						<div>{props.selectedItem.date_ordered}</div>
					</div>
					<div className="flex flex-col w-full">
						<div>Items</div>
						{console.log("ITEMS: ", props.selectedItem.content)}
						{props.selectedItem && props.selectedItem.content.map((item) => {
							let product = props.findProductById(item.item);
							console.log('Product: ', product);

							return (product) ? (
								<div key={item._id}>
									{product.name} - {item.quantity} - {product.price * item.quantity}
								</div>
							) : null;
						})}
					</div>
					<div className="flex flex-col w-full">
						<div>Status</div>
						<div>{getStatusFromId(props.selectedItem.status).status}</div>
					</div>
					<div className="flex flex-col w-full">
						<div>Payment Method</div>
						<div>{props.selectedItem.payment_method}</div>
					</div>

					<div>Cart total: {props.cartTotal}</div>
				</div>
				<div className="action">
					{/*TODO: connect functions to database*/}

					{
						// checker if adding a new item or editing an existing one
						props.selectedItem.status === 0 ? (
							<div className="flex flex-row h-[4.5rem] gap-[1.25rem] w-full">
								<div className="w-full pb-[0.25rem] pl-[1rem] pt-[1rem]">

								<button
								className="action-button bg-red-500"
								onClick={cancelOrder}
								>Cancel Order</button>
									
								</div>
								{props.isMerchant ? (
									<div className="w-full pr-[1rem] pb-[0.25rem]  pt-[1rem]">
										<button

								className="action-button bg-green-600"
								onClick={updateStatus}
								>Update Status</button>
									</div>
								) : // <button className="flex w-full justify-center items-center p-[0.5rem]" onClick={() => {}}>
								// 	Update Status
								// </button>
								null}
							</div>
						) : (
							<div />
						)
					}
				</div>
			</aside>
		</>
	);
}

ViewTransactionSidebar.propTypes = {
	selectedItem: PropTypes.object,
	status: PropTypes.array,
	cartTotal: PropTypes.number,
	findProductById: PropTypes.func,
	isMerchant: PropTypes.bool,
};

export default ViewTransactionSidebar;
