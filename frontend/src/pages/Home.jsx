import React, { useState, useEffect } from "react";
import backendURL from "../config";
import HeroImage from "../assets/Image/HeroImage.png";
import VenueImage from "../assets/Image/venueImage.png";
import moment from "moment";
import ServiceCards from "../components/Cards/ServiceCards";
//import AllEssentialSite from "../components/Cards/AllEssentialSite";
import UpcomingEventCarousel from "../components/Cards/UpcomingEventCarousel";
import TopEventsCard from "../components/Cards/TopEventsCard";
import TopServicesCard from "../components/Cards/TopServicesCard";
import EventFlyersSection from "../components/EventFlyersSection";
import HeroSection from "../components/HeroSection";
import GroupsYouMayLike from "../components/Cards/GroupCard";
import PartyServices from "../components/Eventflyers";
import { TopVenues } from "../pages/Venues";
import AllStateCards from "../components/Cards/AllStateCards";
import EventTypeCategories from "../components/Cards/EventTypeCategories";
import { ServiceTypeCarousel } from "../components/Cards/ServiceTypeCarousel";
const Home = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const uniqueLocations = [...new Set(events.map((event) => event.state))];
  const uniqueCategories = [...new Set(events.map((event) => event.eventType))];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${backendURL}/api/getAllEvents`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${backendURL}/api/getAllEvents?searchTerm=${searchTerm}&state=${state}&category=${category}`
      );
      const data = await response.json();
      setEvents(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error searching events:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = events.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <section>
        <HeroSection />
      </section>
     
      
      <section className="my-12">
        <AllStateCards />
        <EventTypeCategories />
      </section>
      <section className="my-[10rem]">
        <ServiceTypeCarousel />
      </section>

      <section className="bg-gray-50">
        <UpcomingEventCarousel />
      </section>
      <section className="lg:px-12 my-16 ">
        <div className="relative w-full h-[200px] mt-8  overflow-hidden">
          <div className="absolute inset-0 z-10 "></div>
          <img
            src={VenueImage}
            alt="Venue"
            className="w-full h-full object-cover opacity-95  blur-[px] md:rounded-full"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              Find the <span className="text-Blud">BEST VENUE</span> for your
              Events
            </h2>
            <p className="text-sm mb-4 opacity-90 lg:mr-[15.5rem]">
              Lorem ipsum dolor sit amet consectetur. <br></br> Velit viverra
              rhoncus pharetra in ut sit.
            </p>
            <button className="bg-red-600 text-white px-10 py-3 rounded-full text-md transition-all duration-300 ease-out hover:scale-105 font-semibold">
              Venue
            </button>
          </div>
        </div>
      </section>
      {/* top event */}
      <section className="">
        <TopEventsCard />
      </section>
      {/* event flyers */}
      <section className="py-24">
        <EventFlyersSection />
      </section>

      <section className=" lg:px-12  py-[rem]">
        <TopVenues />
      </section>

      <section className="py-[rem]">
        <PartyServices />
      </section>

      {/* top Services */}
      <section className="">
        <TopServicesCard />
      </section>

      <section className=" lg:px-12  py-[rem]">
        <GroupsYouMayLike />
      </section>
    </>
  );
};

export default Home;

//  <button className="relative px-6 md:px-8 py-2 md:py-3 bg-pink-500 text-white rounded-full font-semibold transition-colors duration-300 group">
//    <span className="relative z-10 transition-colors duration-300 group-hover:text-pink-500">
//      Solutions
//    </span>
//    <span className="absolute inset-0 bg-white rounded-full transform scale-0 transition-transform duration-300 group-hover:scale-100"></span>
//  </button>;
