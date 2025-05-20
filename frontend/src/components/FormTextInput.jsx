import PropTypes from "prop-types";

function FormTextInput(props) {
	return (
		<div className="input-field">
			<label htmlFor={props.fieldname} className="heading3 text-white">
				{props.label}
			</label>
			<input name={props.fieldname} className="w-full p-[0.5rem] text-md rounded-2xl" type={props.type} value={props.value} onChange={(e) => props.onChange(e.target.value)} id={`${props.id}-${props.fieldname}`} />
		</div>
	);
}

FormTextInput.propTypes = {
	fieldname: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.any,
	type: PropTypes.string,
	id: PropTypes.string,
	onChange: PropTypes.func,
	
	
};

export default FormTextInput;
