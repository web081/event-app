import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import backendURL from "../../config";
import EgroupURL from "../../config2";
import GroupImage from "../../assets/Image/groupImage.png";

const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  "http://localhost:5173" ||
  "https://egroup-nine.vercel.app";

const GroupCard = ({ id, name, members, category, slug }) => (
  <Link
    // target="blank"
    to={`/Group/${slug}`}
    className="group-card flex-shrink-0 w-64 mr-4"
  >
    <div className="card bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={GroupImage}
        alt={name}
        className="card-image w-full h-32 object-cover"
      />
      <div className="card-content p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {members} Member{members !== 1 ? "s" : ""} - 0 Posts today
        </p>
        <button className="join-button bg-NavClr px-5 py-1 rounded-md text-white text-sm transition-all  bg-Blud  duration-300 ease-out hover:scale-105 hover:bg-red-600">
          Join group
        </button>
      </div>
    </div>
  </Link>
);

const GroupsYouMayLike = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${EgroupURL}/api/groups/getAllGroups`
        );
        console.log("API response:", response.data); // Add this line
        setGroups(response.data);
      } catch (error) {
        setError("Failed to fetch groups. Please try again later.");
        console.error("Error fetching groups:", error); // Add this line
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const scroll = (scrollOffset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += scrollOffset;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen absolute top-0 left-0 bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center py-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold">Groups you may like</h2>
        <button
          onClick={() => setShowModal(true)}
          className="text-red-500 text-sm hover:underline"
        >
          View more
        </button>
      </div>
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {groups.map((group) => (
            <GroupCard
              key={group._id} // Assuming MongoDB's default _id
              id={group._id}
              name={group.name}
              members={group.members.length} // Assuming members is an array
              category={group.category}
              slug={group.slug}
            />
          ))}
        </div>
        <button
          onClick={() => scroll(-300)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md"
        >
          &#8592;
        </button>
        <button
          onClick={() => scroll(300)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 shadow-md"
        >
          &#8594;
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">All Groups</h2>
              <button onClick={() => setShowModal(false)} className="text-3xl">
                &times;
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  members={group.members}
                  category={group.category}
                  slug={group.slug}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsYouMayLike;
