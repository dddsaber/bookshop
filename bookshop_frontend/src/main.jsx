import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import "./index.css";
import ProductContextProvider from "./context/ProductContext.jsx";
import { BrowserRouter } from "react-router-dom";
import CategoryContextProvider from "./context/CategoryContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <CategoryContextProvider>
        <ProductContextProvider>
          <App />
        </ProductContextProvider>
      </CategoryContextProvider>
    </Provider>
  </BrowserRouter>
);
