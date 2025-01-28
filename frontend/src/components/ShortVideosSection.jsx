import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

const VideoCard = ({ id, videoSrc, views, thumbnail }) => {
  return (
    <Link to={`/video/${id}`} className="block">
      <div className="relative overflow-hidden rounded-lg group h-64 md:h-80">
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="text-white w-12 h-12" />
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {views} views
        </div>
      </div>
    </Link>
  );
};

const ShortVideosSection = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("YOUR_API_ENDPOINT_HERE");
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-blue-black font-bold text-2xl">Short Videos</span>
        <Link to="/videos" className="text-gray-800 font-bold hover:underline">
          See All
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
};

export default ShortVideosSection;
