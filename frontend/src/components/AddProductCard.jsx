import styles from "../styles/Customer.module.css";
function AddProductCard(props) {
    return (
        <>
            <div
                onClick={() => {
                    props.func(props.product);
                }}
                className={styles.product_card}
            >
                <img className={styles.product_img} src={props.product.img} />
                <div>{props.product.name}</div>
            </div>
        </>
    );
}

export default AddProductCard;