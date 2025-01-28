// import React from "react";
// import TickeHeroImage from "../assets/Image/Events.png";
// import { Link } from "react-router-dom";
// import { EventsNearYou } from "../pages/Events";
// import EventFlyersSection from "../components/EventFlyersSection";

// const Ticketing = () => {
//   return (
//     <div className="lg:container mx-auto px-4 py-8">
//       {/* Hero Section */}
//       <div className="grid md:grid-cols-5 gap-6 mb-12 bg-white rounded-lg overflow-hidden shadow-lg">
//         {/* Image Container - 3 columns on md screens */}
//         <div className="md:col-span-3 h-[400px]">
//           <div className="w-full h-full bg-black/50 rounded-t md:rounded-l md:rounded-t-none">
//             <img
//               src={TickeHeroImage}
//               alt="Concert crowd"
//               className="w-full h-full object-cover mix-blend-overlay rounded-t md:rounded-l md:rounded-t-none"
//             />
//           </div>
//         </div>

//         {/* Content Container - 2 columns on md screens */}
//         <div className="md:col-span-2 p-6 flex flex-col justify-center bg-gray-50">
//           <p className="text-black mb-8">
//             Lorem ipsum dolor sit amet consectetur. Integer augue at vitae sed
//             integer porttitor sed ultrices ornare.
//           </p>

//           <div className="space-y-4 mb-8">
//             <div className="border-b border-gray-300 w-full"></div>
//             <div className="border-b border-gray-300 w-full"></div>
//           </div>

//           <div className="flex flex-col items-center">
//             <Link to="/" className="w-full mb-6">
//               <button className="w-full bg-transparent text-black font-bold py-3 px-6 rounded-md hover:bg-NavClr hover:text-Blud hover:scale-105 transition-all duration-300 ease-in-out">
//                 Get Started
//               </button>
//             </Link>
//             <div className="border-b border-gray-300 w-1/2"></div>
//           </div>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="grid md:grid-cols-2 gap-8 items-center">
//         <div className="space-y-6">
//           <h2 className="text-2xl md:text-3xl font-bold leading-tight">
//             Start an Event and Get Tickets for them
//           </h2>
//           <p className="text-gray-600">
//             Lorem ipsum dolor sit amet consectetur. Integer augue at vitae sed
//             integer porttitor sed ultrices ornare.
//           </p>
//           <button className="w-full md:w-auto hover:text-Blud  bg-black text-white px-8 py-3 rounded-md hover:bg-transparent hover:border-Blud hover:border hover:font-semibold transition-all duration-300 ease-in-out">
//             Create an Event
//           </button>
//         </div>
//       </div>
//   <EventsNearYou />
//   <section>
//     <EventFlyersSection />
//   </section>
//     </div>
//   );
// };

// export default Ticketing;
import React from "react";
import TickeHeroImage from "../assets/Image/Events.png";
import { Link } from "react-router-dom";
import { EventsNearYou } from "../pages/Events";
import EventFlyersSection from "../components/EventFlyersSection";

const Ticketing = () => {
  return (
    <div className="lg:container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="grid md:grid-cols-5 gap-6 mb-12 bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Image Container */}
        <div className="md:col-span-3 h-96">
          <div className="relative w-full h-full bg-black/50 rounded-t md:rounded-l md:rounded-t-none">
            <img
              src={TickeHeroImage}
              alt="Concert crowd enjoying live music event"
              className="w-full h-full object-cover opacity-75 rounded-t md:rounded-l md:rounded-t-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </div>
        </div>

        {/* Content Container */}
        <div className="md:col-span-2 p-8 flex flex-col justify-center bg-gray-50">
          <h1 className="text-3xl font-bold mb-4">Find Your Next Event</h1>
          <p className="text-gray-600 mb-8">
            Discover and book tickets for the most exciting events happening
            near you. From concerts to conferences, we've got you covered.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                <span className="text-lg">🎫</span>
              </div>
              <span className="text-sm text-gray-600">
                Secure ticket booking
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                <span className="text-lg">📍</span>
              </div>
              <span className="text-sm text-gray-600">Events near you</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <Link
              to="/events/browse"
              className="w-full mb-6"
              aria-label="Browse events"
            >
              <button className="w-full  bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out">
                Explore Events
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Create Event Section */}
      <section className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Create Your Own Event
          </h2>
          <p className="text-gray-600">
            Want to host an event? Our platform makes it easy to create, manage,
            and sell tickets for your events. Get started in minutes.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="w-full md:w-auto hover:text-Blud  bg-red-600 text-white px-8 py-3 rounded-md hover:bg-transparent hover:border-Blud hover:border hover:font-semibold transition-all duration-300 ease-in-ou">
              Create Event
            </button>
            <Link
              to="/learn-more"
              className="inline-flex items-center text-gray-600 hover:text-black"
            >
              Learn more →
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-48 bg-gray-100 rounded-lg" />
          <div className="h-48 bg-gray-100 rounded-lg" />
          <div className="h-48 bg-gray-100 rounded-lg" />
          <div className="h-48 bg-gray-100 rounded-lg" />
        </div>
      </section>

      {/* Events Near You Section */}
      <section>
        <EventsNearYou />
      </section>

      {/* Event Flyers Section */}
      <section>
        <EventFlyersSection />
      </section>
    </div>
  );
};

export default Ticketing;
