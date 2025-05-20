import PropTypes from "prop-types";

function ProductCard(props) {
	return (
		<>
			{props.product.name != "New item name" ? (
				<div
					onClick={() => {
						props.onClick(props.product);
					}}
					className="card"
				>
					<img className="object-contain h-[13rem] p-[0.5rem]" src={props.product.img} />
					<div className="flex flex-col p-[0.5rem] w-full gap-[0.5rem]">
						<div className="heading2 flex w-[100%]">{props.product.name}</div>

						<div className="flex flex-row justify-between items-end">
							<div className="flex flex-row items-end">
								<div className="flex text-2xl">{`₱ ${props.product.price}`}</div>
								<div>/kg</div>
							</div>
							<div className="text-sm">{`${props.product.quantity} kg left`}</div>
						</div>
					</div>
				</div>
			) : (
				<div
					onClick={() => {
						props.onClick(props.product);
					}}
					className="card"
				>
					Add Product
				</div>
			)}
		</>
	);
}

ProductCard.propTypes = {
	product: PropTypes.object,
	onClick: PropTypes.func,
};

export default ProductCard;
