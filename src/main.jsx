import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ProductsProvider } from "./context/products_context";
import { FilterProvider } from "./context/filter_context";
import { CartProvider } from "./context/cart_context";
import { UserProvider } from "./context/user_context";
import { Auth0Provider } from "@auth0/auth0-react";

//dev-obiog3egl8dnpja8.us.auth0.com
//8otYnCDDVIVmmEMaa6iDtE6XPRJKUpoO

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Auth0Provider
			domain={import.meta.env.VITE_REACT_APP_AUTH_DOMAIN}
			clientId={import.meta.env.VITE_REACT_APP_AUTH_CLIENTID}
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}
			cacheLocation="localstorage"
		>
			<UserProvider>
				<ProductsProvider>
					<FilterProvider>
						<CartProvider>
							<App />
						</CartProvider>
					</FilterProvider>
				</ProductsProvider>
			</UserProvider>
		</Auth0Provider>
	</React.StrictMode>
);
