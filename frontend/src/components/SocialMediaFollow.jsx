import React, { useCallback, useState, useEffect } from "react";
import { Grid, Box, Button } from "@mui/material";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewsletterSignup from "./tools/NewsletterSignup";
import backendURL from "../config";
const SocialMediaFollow = () => {
  const [email, setEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const navigate = useNavigate();

  const categories = [
    "Society",
    "Events",
    "Celebrities",
    "Fashion",
    "LifeStyle",
    "Entertainment",
    "Shopping",
    "Business",
  ];

  const fetchDataLength = useCallback(
    async (category) => {
      try {
        const response = await fetch(
          `${backendURL}/api/getAllFashion?postType=${category}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data?.posts) {
          setCategoryData((prev) => ({
            ...prev,
            [category]: data.total,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [backendURL]
  );

  useEffect(() => {
    categories.forEach((category) => {
      fetchDataLength(category);
    });
  }, [fetchDataLength]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubLoading(true);

      try {
        const response = await fetch(`${backendURL}/api/newsletter-signup`, {
          method: " POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setAlertInfo({
            message: "Subscription successful!",
            variant: "success",
            icon: CheckCircle,
          });
          setEmail("");
        } else {
          setAlertInfo({
            message: data.message || "An error occurred. Please try again.",
            variant: data.message.includes("already subscribed")
              ? "warning"
              : "destructive",
            icon: AlertCircle,
          });
          setEmail("");
        }
      } catch (error) {
        setAlertInfo({
          message: "An error occurred. Please try again.",
          variant: "destructive",
          icon: AlertCircle,
        });
      } finally {
        setSubLoading(false);
      }
    },
    [email, backendURL]
  );

  const handleCategoryClick = (category) => {
    if (category.toLowerCase() === "lifestyle") {
      navigate("/lifeStyle/home");
    } else {
      navigate(`/${category.toLowerCase()}`);
    }
  };

  return (
    <Grid item xs={12} md={4}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
        sx={{
          p: 3,
          // m: 2,
          borderRadius: "12px",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Social Media Buttons */}
        <Button
          href="https://www.facebook.com/yourpage"
          target="_blank"
          variant="contained"
          startIcon={<Facebook />}
          sx={{
            backgroundColor: "#3b5998",
            width: "100%",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: "#3b5998",
              color: "#3b5998",
              border: "1px solid #3b5998",
            },
          }}
        >
          Follow Us on Facebook
        </Button>

        <Button
          href="https://twitter.com/yourprofile"
          target="_blank"
          variant="contained"
          startIcon={<Twitter />}
          sx={{
            backgroundColor: "#1DA1F2",
            width: "100%",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: "#1DA1F2",
              color: "#1DA1F2",
              border: "1px solid #1DA1F2",
            },
          }}
        >
          Follow Us on Twitter
        </Button>

        <Button
          href="https://www.linkedin.com/in/yourprofile"
          target="_blank"
          variant="contained"
          startIcon={<LinkedIn />}
          sx={{
            backgroundColor: "#0077b5",
            width: "100%",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: "#0077b5",
              color: "#0077b5",
              border: "1px solid #0077b5",
            },
          }}
        >
          Follow Us on LinkedIn
        </Button>

        <Button
          href="https://www.instagram.com/yourprofile"
          target="_blank"
          variant="contained"
          startIcon={<Instagram />}
          sx={{
            backgroundColor: "#C13584",
            width: "100%",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: "#C13584",
              color: "#C13584",
              border: "1px solid #C13584",
            },
          }}
        >
          Follow Us on Instagram
        </Button>

        {/* Categories Section */}
        <div className="w-full mt-6">
          <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-black to-red-500 text-transparent bg-clip-text">
            Popular Categories
          </h3>

          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-200 border border-transparent hover:border-gray-300"
              >
                <span className="text-gray-700 hover:text-gray-900">
                  {category}
                </span>
                <span className="text-gray-500 text-sm">
                  ({categoryData[category] || 0})
                </span>
              </div>
            ))}
          </div>
        </div>
        <NewsletterSignup />
      </Box>
    </Grid>
  );
};

export default SocialMediaFollow;
