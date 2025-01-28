import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Layout from "./components/Dashboard_Admin/AdminLayout";
import UserLayout from "./components/Dashboard_User/UserLayout";
import ResponsiveNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Venues from "./pages/Venues";
import Events from "./pages/Events";
import Services from "./pages/Services";
import SingleServicePage from "./pages/SingleServicePage";
import SingleEventPage from "./pages/SingleEventPage";
import SingleVenue from "./pages/SingleVenue";
import BookVenue from "./pages/BookVenue";
import Ticketing from "./pages/Ticketing";
import Group1 from "./pages/Groups/Group1";
import DiscussionPage from "./pages/Groups/Discussion";
import FreeTicketRegistration from "./pages/FreeTicketRegistration";
import BlacklistPage from "./pages/BlacklistPage";
import VenueInterestPage from "./pages/VenueInterestPage";

//Venue payments
import PaymentVerification from "./pages/payment/PaymentVerification";
import PaymentSuccess from "./pages/payment/paymentSucess";
import PaymentFailed from "./pages/payment/PaymentFailed";

// ticket payments
import TicketCheckout from "./pages/TicketCheckout";
import {
  TicketPaymentVerification,
  TicketPaymentSuccess,
  TicketPaymentFailed,
} from "./pages/payment/TicketPayment/PaymentVerifications";

// import Contact from "./pages/Contactus";
import VenuePageByState from "./pages/VenuePageByState";
import VenuePageByCategory from "./pages/VenuePageByCategory";
import ServiceListingPage from "./pages/ServiceListingPage";

// Authentications
import RegisterAdmin from "./pages/RegisterAdmin";
import Signup from "./pages/RegisterUser";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import Login from "./pages/Login";

// AdminDAshBoard
import AdminDashboard from "./pages/AdminDashBoardPages/AdminDashboard";
import AdminProfile from "./pages/AdminDashBoardPages/AdminProfile";
import AdminALLUsers from "./pages/AdminDashBoardPages/AdminALLUsers";
import AdminAllServices from "./pages/AdminDashBoardPages/AdminAllServices";
import VerificationData from "./pages/AdminDashBoardPages/VerificaionDatas";
import AdminNotificationPage from "./pages/AdminDashBoardPages/AdminNotificationPage";
import AdminAllVenuesListing from "./pages/AdminDashBoardPages/AdminAllVenuesListing";
import VenueInterestTable from "./pages/AdminDashBoardPages/AdminVenueInterestPage";
import VenueVerification from "./pages/AdminDashBoardPages/venueVerificationData";
// UserDAshBoard
import UserDashboard from "./pages/UserDashboardPages/UserDashboard";
import UserProfile from "./pages/UserDashboardPages/UserProfile";
import CreateVenue from "./pages/UserDashboardPages/CreateVenue";
import VenueList from "./pages/UserDashboardPages/UserVenueLists";
import CreateEvent from "./pages/UserDashboardPages/CreateEvent";
import EventList from "./pages/UserDashboardPages/EventList";
import CreateServices from "./pages/UserDashboardPages/CreateServices";
import ServicesList from "./pages/UserDashboardPages/ServicesList";
import UserNotificationPage from "./pages/UserDashboardPages/UserNotificationPage";
import EventManagements from "./pages/UserDashboardPages/EventManagement";
import UserVerifyPage from "./pages/UserDashboardPages/UserVerifyPage";
import VenueVerificationPage from "./pages/UserDashboardPages/UserVenueVerifyPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  // const isDashboardRoute = location.pathname.startsWith("/User", "/Admin");
  const isDashboardRoute =
    location.pathname.startsWith("/User") ||
    location.pathname.startsWith("/Admin");

  return (
    <>
      <ScrollToTop />
      {!isDashboardRoute && <ResponsiveNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/event-services" element={<Services />} />
        <Route path="/service/:id?" element={<SingleServicePage />} />
        <Route path="/singEvenPage/:id?" element={<SingleEventPage />} />
        <Route path="/venue/:id?" element={<SingleVenue />} />
        <Route path="/bookVenue/:id?" element={<BookVenue />} />
        <Route path="/event-showcase" element={<Events />} />
        <Route path="/ticketing" element={<Ticketing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/RegisterAdmin" element={<RegisterAdmin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<PasswordReset />} />
        <Route path="/Group/:slug?" element={<Group1 />} />
        <Route path="/DiscussionPage/:slug?" element={<DiscussionPage />} />
        <Route path="/Venue/State/:stateName?" element={<VenuePageByState />} />
        <Route path="/services/:serviceType" element={<ServiceListingPage />} />
        <Route
          path="/Venue/Category/:categoryId?"
          element={<VenuePageByCategory />}
        />
        <Route
          path="/Venue/VenueInterestPage/:id?"
          element={<VenueInterestPage />}
        />
        {/* Venue paymentRouytes */}
        <Route path="/blacklist" element={<BlacklistPage />} />
        <Route path="/payment/verify" element={<PaymentVerification />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
        {/* ticketPayment routes */}
        <Route path="/event/tickets/:id?" element={<TicketCheckout />} />
        <Route path="/tickets/verify" element={<TicketPaymentVerification />} />
        <Route path="/tickets/success" element={<TicketPaymentSuccess />} />
        <Route path="/tickets/failed" element={<TicketPaymentFailed />} />
        {/* Admin dashborad */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<Layout />}>
            <Route path="/Admin/DashBoard" element={<AdminDashboard />} />
            <Route path="/Admin/Profile" element={<AdminProfile />} />
            <Route path="/Admin/Users" element={<AdminALLUsers />} />
            <Route path="/Admin/AllServices" element={<AdminAllServices />} />
            <Route
              path="/Admin/VerificationData"
              element={<VerificationData />}
            />
            <Route
              path="/Admin/venueVerificationData"
              element={<VenueVerification />}
            />
            <Route
              path="/Admin/AllVenues"
              element={<AdminAllVenuesListing />}
            />
            <Route
              path="/Admin/VenueInterest"
              element={<VenueInterestTable />}
            />
            <Route
              path="/Admin/Notifications"
              element={<AdminNotificationPage />}
            />
          </Route>
        </Route>
        {/* User dashborad */}
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route element={<UserLayout />}>
            <Route path="/User/DashBoard/" element={<UserDashboard />} />
            <Route path="/User/Profile" element={<UserProfile />} />
            <Route
              path="/User/CreateVenue/:venueId?"
              element={<CreateVenue />}
            />
            <Route path="/User/VenueList" element={<VenueList />} />
            <Route
              path="/User/CreateVenue/:venueId?"
              element={<CreateVenue />}
            />
            <Route
              path="/User/CreateEvent/:eventId?"
              element={<CreateEvent />}
            />
            <Route path="/User/EventList" element={<EventList />} />
            <Route
              path="/User/CreateServices/:businessId?"
              element={<CreateServices />}
            />
            <Route path="/User/ServicesList" element={<ServicesList />} />
            <Route
              path="/User/EventManagement"
              element={<EventManagements />}
            />
            <Route
              path="/User/UserNotificationPage"
              element={<UserNotificationPage />}
            />
            <Route
              path="User/UserVenueVerifyPage"
              element={<VenueVerificationPage />}
            />
            <Route path="/User/UserVerifyPage" element={<UserVerifyPage />} />
          </Route>
        </Route>
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
