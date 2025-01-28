import React from "react";
import { PartyPopper, Utensils, ExternalLink } from "lucide-react";
import EventFood from "../assets/Image/eventFood.jpg";
import EventDrink from "../assets/Image/eventDrink2.jpg";
import backgroundImage from "../assets/Image/imageedit_3_7228238530.png";

const PartyServices = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white/95">
      {/* Food Section */}
      <div className="mb-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-orange-900">
                Essential Party Foods
              </h2>
            </div>
            <p className="text-base text-gray-700">
              Elevate your event with our exceptional catering services. From
              elegant appetizers to show-stopping main courses, we've got your
              culinary needs covered.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Customizable menu options</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Dietary restrictions accommodated</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Professional catering service</span>
              </li>
            </ul>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
              Order Food
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64 bg-orange-100 rounded-lg overflow-hidden">
            <img
              src={EventFood}
              alt="Delicious party foods"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Drinks Section */}
      <div>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1 h-64 bg-purple-100 rounded-lg overflow-hidden">
            <img
              src={EventDrink}
              alt="Event drinks"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <div className="flex items-center gap-2">
              <PartyPopper className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-orange-900">
                Event Drinks Services
              </h2>
            </div>
            <p className="text-base text-gray-700">
              Transform your event with our premium drink booking service. We
              cover all types of drinks for your occasion, offering wholesale
              pricing for all your celebration needs.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Customizable drink packages</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Delivery to your venue/location</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                <span>Bulk ordering discounts</span>
              </li>
            </ul>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
              Order Drinks
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyServices;
