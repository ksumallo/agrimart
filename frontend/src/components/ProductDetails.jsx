import PropTypes from "prop-types";
import ActionButton from "./ActionButton";

function ProductDetails(props) {
	return (
		<div className="flex w-full shadow-2xl bg-white rounded-2xl">
			<div className="flex w-full h-[7.5rem] p-[1.25rem] justify-center items-center gap-[1.25rem]">
				<img className="h-full w-[7rem] object-contain" src={props.selectedItem.img}></img>
				<div className="flex h-full grow flex-col items-start justify-center">
					<div className="flex flex-row gap-[1.5rem] items-end">
						<div className="heading2 flex-1 items-end">{props.selectedItem.name}</div>
						<div className="flex flex-row gap-[1rem] pb-[0.25rem]">
							<div className="flex flex-row items-start gap-[0.5rem]">
								<div className="heading3">Price</div>
								<div className="flex-3">₱{props.selectedItem.price}/kg</div>
							</div>
							<div className="flex flex-row items-start gap-[0.5rem]">
								<div className="heading3">Qty left</div>
								<div className="flex-3">{props.selectedItem.quantity}</div>
							</div>
						</div>
					</div>
					<div className="flex-3">{props.selectedItem.description}</div>
				</div>
				<div className="w-[9rem] h-[75%]">
					<ActionButton label={"Add to Cart"} action={props.addToCartFunc} parameter={props.selectedItem} />
				</div>
			</div>
		</div>
	);
}

ProductDetails.propTypes = {
	selectedItem: PropTypes.object,
	addToCartFunc: PropTypes.func,
};

export default ProductDetails;
