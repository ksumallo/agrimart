import PropTypes from "prop-types";
function FilterCategory(props) {
	return (
		<>
			<button className="category-button" onClick={() => props.filterFunc(props.category)}>
				{props.category}
			</button>
		</>
	);
}

FilterCategory.propTypes = {
	category: PropTypes.string,
	filterFunc: PropTypes.func,
};

export default FilterCategory;
