import React from "react";
import { Card } from "flowbite-react";
import AboutImage from "../assets/Image/aboutImage.png";

const About = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with City Skyline */}
      <div className="relative h-[60vh] bg-gradient-to-r from-orange-300 to-yellow-200">
        <div className="absolute inset-0">
          <img
            src={AboutImage}
            alt="City Skyline"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 -mt-16 relative mb-[5rem]">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <h5 className="text-2xl font-bold text-red-600 mb-4">Say Hello!</h5>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-Blud focus:border-Blud"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-Blud focus:border-Blud"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-Blud focus:border-Blud"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-Blud focus:border-Blud"
                  placeholder="Enter your message"
                />
              </div>
              <button
                type="submit"
                className="w-auto  bg-gradient-to-r from-btColour to-Blud hover:bg-gradient-to-bl focus:outline-none text-white py-2 px-4 rounded-md"
              >
                Send Message
              </button>
            </form>
          </Card>

          {/* Information Cards */}
          <div className="space-y-6">
            <Card>
              <h5 className="text-lg font-semibold bg-gradient-to-r from-btColour to-Blud bg-clip-text text-transparent mb-2">
                Vendors
              </h5>

              <p className="text-gray-600">
                If you are interested in providing us your product or business
                portfolio, please send to our queries at info@example.com.
              </p>
            </Card>

            <Card>
              <h5 className="text-lg font-semibold bg-gradient-to-r from-btColour to-Blud bg-clip-text text-transparent mb-2">
                Marketing Collaborations
              </h5>
              <p className="text-gray-600">
                If you are a creative artist looking to create content, social
                media updates, etc., please write to us.
              </p>
            </Card>

            <Card>
              <h5 className="text-lg font-semibold bg-gradient-to-r from-btColour to-Blud bg-clip-text text-transparent mb-2">
                Wedding Submissions
              </h5>
              <p className="text-gray-600">
                Weddings themed around unique concepts, across cultures, share
                real budgets. To submit your wedding, please send us 25-35
                images at info@example.com.
              </p>
            </Card>

            <Card>
              <h5 className="text-lg font-semibold bg-gradient-to-r from-btColour to-Blud bg-clip-text text-transparent mb-2">
                Careers
              </h5>
              <p className="text-gray-600">
                We are a team of passionate young minds looking to reinvent the
                wedding space. If you think you can contribute, please write to
                us at info@example.com.
              </p>
            </Card>

            <Card>
              <h5 className="text-lg font-semibold bg-gradient-to-r from-btColour to-Blud bg-clip-text text-transparent mb-2">
                Customers
              </h5>
              <p className="text-gray-600">
                We love to hear from our previous users. For any feedback or
                queries simply write to us at info@example.com.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
