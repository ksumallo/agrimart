import PropTypes from "prop-types";

function SortSelectInput(props) {
	return (
		<div className="input-field">
			<label htmlFor={props.fieldname} className="heading3">
				{props.label}
			</label>
			<div></div>
			<select name={props.fieldname} className="p-[0.5rem]" value={props.value} onChange={(e) => props.onChange(e.target.value)} id={`${props.fieldname}-attribute`}>
				{props.options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}

SortSelectInput.propTypes = {
	fieldname: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.any,
	options: PropTypes.array,
	onChange: PropTypes.func,
};

export default SortSelectInput;
