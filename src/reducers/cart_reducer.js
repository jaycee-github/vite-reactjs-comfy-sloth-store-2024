import {
	ADD_TO_CART,
	CLEAR_CART,
	COUNT_CART_TOTALS,
	REMOVE_CART_ITEM,
	TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";

const cart_reducer = (state, action) => {
	// ADD TO CART
	if (action.type === ADD_TO_CART) {
		const { id, color, amount, product } = action.payload;
		const tempItem = state.cart.find((item) => {
			return item.id === id + color;
		});

		// IF ITEM TO BE ADDED ALREADY EXIST IN THE CART
		if (tempItem) {
			const tempCart = state.cart.map((cartItem) => {
				if (cartItem.id === id + color) {
					let newAmount = cartItem.amount + amount;

					if (newAmount > cartItem.max) {
						newAmount = cartItem.max;
					}

					return { ...cartItem, amount: newAmount };
				} else {
					return cartItem;
				}
			});

			return { ...state, cart: tempCart };
		} else {
			// IF ITEM TO BE ADDED DOESN'T EXIST IN THE CART
			const newItem = {
				id: id + color,
				name: product.name,
				color: color,
				amount: amount,
				image: product.images[0].url,
				price: product.price,
				max: product.stock,
			};

			return { ...state, cart: [...state.cart, newItem] };
		}
	}

	// REMOVE AN ITEM FROM THE CART
	if (action.type === REMOVE_CART_ITEM) {
		const tempCart = state.cart.filter((item) => {
			return item.id !== action.payload;
		});

		return { ...state, cart: tempCart };
	}

	// CLEAR CART
	if (action.type === CLEAR_CART) {
		return { ...state, cart: [] };
	}

	if (action.type === TOGGLE_CART_ITEM_AMOUNT) {
		const { id, value } = action.payload;
		const tempCart = state.cart.map((item) => {
			// IF id matches the id
			if (item.id === id) {
				// INCREASE
				if (value === "increase") {
					let newAmount = item.amount + 1;

					// If newAmount is greater than the max (current stock)
					if (newAmount > item.max) {
						newAmount = item.max;
					}

					return { ...item, amount: newAmount };
				}

				// DECREASE
				if (value === "decrease") {
					let newAmount = item.amount - 1;

					// If newAmount is less than 1
					if (newAmount < 1) {
						newAmount = 1;
					}

					return { ...item, amount: newAmount };
				}
			}

			return item;
		});

		return { ...state, cart: tempCart };
	}

	if (action.type === COUNT_CART_TOTALS) {
		const { total_items, total_amount } = state.cart.reduce(
			(total, cartItem) => {
				const { amount, price } = cartItem;

				total.total_items += amount;
				total.total_amount += price * amount;

				return total;
			},
			{
				total_items: 0,
				total_amount: 0,
			}
		);

		return {
			...state,
			total_items: total_items,
			total_amount: total_amount,
		};
	}

	throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
