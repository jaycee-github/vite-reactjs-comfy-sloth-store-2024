import React, { useEffect, useContext, useReducer } from "react";
import reducer from "../reducers/filter_reducer";
import { useProductsContext } from "./products_context";
import {
	LOAD_PRODUCTS,
	SET_GRIDVIEW,
	SET_LISTVIEW,
	UPDATE_SORT,
	SORT_PRODUCTS,
	UPDATE_FILTERS,
	FILTER_PRODUCTS,
	CLEAR_FILTERS,
} from "../actions";

const initialState = {
	filtered_products: [],
	all_products: [],
	grid_view: true,
	sort: "price-lowest",
	filters: {
		text: "",
		company: "all",
		category: "all",
		color: "all",
		min_price: 0,
		max_price: 0,
		price: 0,
		shipping: false,
	},
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
	const { products } = useProductsContext();
	const [state, dispatch] = useReducer(reducer, initialState);

	// products will be initially empty so we need to add it to the dependency array.
	// this useEffect will run one more time as the "products" content changes
	useEffect(() => {
		dispatch({
			type: LOAD_PRODUCTS,
			payload: products,
		});
	}, [products]);

	useEffect(() => {
		dispatch({ type: FILTER_PRODUCTS });
		dispatch({
			type: SORT_PRODUCTS,
		});
	}, [products, state.sort, state.filters]);

	const setGridView = () => {
		dispatch({
			type: SET_GRIDVIEW,
		});
	};

	const setListView = () => {
		dispatch({
			type: SET_LISTVIEW,
		});
	};

	const updateSort = (e) => {
		// For demonstration
		// const name = e.target.name;
		const value = e.target.value;

		dispatch({
			type: UPDATE_SORT,
			payload: value,
		});
	};

	const updateFilters = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		// For buttons since we can't access its text property directly.
		if (name === "category") {
			value = e.target.textContent;
		}

		// For colors since we can't access its text property directly. Its on the dataset attribute.
		if (name === "color") {
			value = e.target.dataset.color;
		}

		// For Range Input since it will change the value into a string.
		if (name === "price") {
			value = Number(value);
		}

		// For Shipping. If Checked or not.
		if (name === "shipping") {
			value = e.target.checked;
		}

		dispatch({
			type: UPDATE_FILTERS,
			payload: {
				name: name,
				value: value,
			},
		});
	};

	const clearFilters = () => {
		dispatch({
			type: CLEAR_FILTERS,
		});
	};

	return (
		<FilterContext.Provider
			value={{
				...state,
				setGridView,
				setListView,
				updateSort,
				updateFilters,
				clearFilters,
			}}
		>
			{children}
		</FilterContext.Provider>
	);
};
// make sure use
export const useFilterContext = () => {
	return useContext(FilterContext);
};
