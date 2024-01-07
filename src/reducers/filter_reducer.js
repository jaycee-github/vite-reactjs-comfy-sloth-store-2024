import {
	LOAD_PRODUCTS,
	SET_LISTVIEW,
	SET_GRIDVIEW,
	UPDATE_SORT,
	SORT_PRODUCTS,
	UPDATE_FILTERS,
	FILTER_PRODUCTS,
	CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
	if (action.type === LOAD_PRODUCTS) {
		let maxPrice = action.payload.map((p) => {
			return p.price;
		});

		maxPrice = Math.max(...maxPrice);

		// NOTE:
		// If we'll just set "all_products : action.payload"
		// what's gonna happen is that once you filter the products
		// you cannot go back to the default
		// because the way Javascript works is that we'll point to the same place
		// in the memory.
		// So if we use the spread operator, now we're just copying the values
		// and that is extremely-extremely important.
		// Because if we don't do that, our whole functionality will eventually go bananas.
		return {
			...state,
			all_products: [...action.payload],
			filtered_products: [...action.payload],
			filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
		};
	}

	if (action.type === SET_GRIDVIEW) {
		return { ...state, grid_view: true };
	}

	if (action.type === SET_LISTVIEW) {
		return { ...state, grid_view: false };
	}

	if (action.type === UPDATE_SORT) {
		return { ...state, sort: action.payload };
	}

	if (action.type === SORT_PRODUCTS) {
		const { sort, filtered_products } = state;
		let tempProducts = [...filtered_products];

		if (sort === "price-lowest") {
			// Sorting the long way
			tempProducts = tempProducts.sort((a, b) => {
				if (a.price < b.price) {
					return -1;
				}

				if (a.price > b.price) {
					return 1;
				}

				return 0;
			});
		}

		if (sort === "price-highest") {
			tempProducts = tempProducts.sort((a, b) => {
				return b.price - a.price;
			});
		}

		if (sort === "name-a") {
			tempProducts = tempProducts.sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
		}

		if (sort === "name-z") {
			tempProducts = tempProducts.sort((a, b) => {
				return b.name.localeCompare(a.name);
			});
		}

		return { ...state, filtered_products: tempProducts };
	}

	if (action.type === UPDATE_FILTERS) {
		const { name, value } = action.payload;

		return { ...state, filters: { ...state.filters, [name]: value } };
	}

	if (action.type === FILTER_PRODUCTS) {
		const { all_products } = state;
		const { text, category, company, color, price, shipping } =
			state.filters;

		let tempProducts = [...all_products];

		// FILTERING : TEXT
		if (text) {
			tempProducts = tempProducts.filter((product) => {
				return product.name.toLowerCase().startsWith(text);
			});
		}

		// FILTERING : CATEGORY
		if (category !== "all") {
			tempProducts = tempProducts.filter((product) => {
				return product.category === category;
			});
		}

		// FILTERING : COMPANY
		if (company !== "all") {
			tempProducts = tempProducts.filter((product) => {
				return product.company === company;
			});
		}

		// FILTERING : COLORS
		if (color !== "all") {
			tempProducts = tempProducts.filter((product) => {
				return product.colors.find((item) => {
					return item === color;
				});
			});
		}

		// FILTERING : PRICE
		tempProducts = tempProducts.filter((product) => {
			return product.price <= price;
		});

		// FILTERING : SHIPPING
		if (shipping === true) {
			tempProducts = tempProducts.filter((product) => {
				return product.shipping === true;
			});
		}

		return { ...state, filtered_products: tempProducts };
	}

	if (action.type === CLEAR_FILTERS) {
		return {
			...state,
			filters: {
				...state.filters,
				text: "",
				company: "all",
				category: "all",
				color: "all",
				price: state.filters.max_price,
				shipping: false,
			},
		};
	}

	throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
