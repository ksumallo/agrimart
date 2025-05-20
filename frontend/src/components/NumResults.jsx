import PropTypes from "prop-types";

function NumResults(props) {
	return (
		<div className="flex flex-row gap-[0.5rem] mb-[1rem] mt-[5rem]">
			<div className="heading3"> Number of results: </div>
			<div>{(props.results) ? props.results.length : 0}</div>
		</div>
	);
}

NumResults.propTypes = {
	results: PropTypes.array,
};

export default NumResults;
