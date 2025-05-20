import PropTypes from "prop-types";

function ActionButton({ action, label, parameter }) {
	return (
		<button className="action-button" onClick={() => action(parameter)}>
			{label}
		</button>
	);
}

ActionButton.propTypes = {
	label: PropTypes.string,
	action: PropTypes.func,
	parameter: PropTypes.any,
};

export default ActionButton;
