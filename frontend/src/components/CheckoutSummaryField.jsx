const CheckoutSummaryField = ({ label, value }) => {
    return (
        <div className="">
            <span>{label}: </span>
            <span>{value}</span>
        </div>
    );
};

export default CheckoutSummaryField;