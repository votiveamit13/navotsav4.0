import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import FundraisingProducts from "./pages/FundraisingProducts";
import About from "./pages/About";
import OurTeam from "./pages/OurTeam";
import Contact from "./pages/Contact";
import News from "./pages/News";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import EventDetail from "./pages/EventDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile";
import PaymentPage from "./pages/PaymentPage";
import Cart from "./pages/Cart";
import CheckoutNew from "./pages/CheckoutNew";
import { PurchasedTickets } from "./pages/PurchasedTickets";
import { FavouriteEvents } from "./pages/FavouriteEvents";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationPage } from "./pages/NotificationPage";
import BlogDetail from "./pages/BlogDetail";
import AboutMob from "./pages/AboutMob";
import PastEvents from "./pages/PastEvents";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/fundraising-products"
            element={<FundraisingProducts />}
          />
          <Route path="/past-events" element={<PastEvents />} />
          <Route path="/about" element={<About />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<News />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event-detail" element={<EventDetail />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/favourite-events" element={<FavouriteEvents />} />
            <Route path="/tickets-history" element={<PurchasedTickets />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/checkout" element={<CheckoutNew />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/payment" element={<PaymentPage />} />

            <Route path="/about-mobile" element={<AboutMob />} />
          </Route>
        </Routes>
      </main>
      {/* <Footer /> */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
