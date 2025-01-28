import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  MenuItem,
  Box,
  Grid,
  IconButton,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import Close from "@mui/icons-material/Close";

import MuiAlert from "@mui/material/Alert";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoArrowBack } from "react-icons/io5";
import backendURL from "../../config";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export default function CreateFashion() {
  const { fashionId } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    authorId: "",
    videoTag: "",
    videoContent: "",
    postType: "",
    subCategory: "", // Added subCategory field
  });
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [fileInputs, setFileInputs] = useState({
    image1: null,
    image2: null,
    videoClip: null,
  });
  const [previews, setPreviews] = useState({
    image1: null,
    image2: null,
    videoClip: null,
  });

  const fileInputRefs = {
    image1: useRef(null),
    image2: useRef(null),
    videoClip: useRef(null),
  };

  // List of subcategories for Lifestyle
  const lifestyleSubCategories = [
    "LifeStyle",
    "Food",
    "Wedding",
    "Parenting",
    "Travel",
    "Health&Fitness",
  ];

  const fetchAuthors = useCallback(async () => {
    try {
      const res = await fetch(`${backendURL}/api/getAllAuthors`);
      const data = await res.json();
      setAuthors(data.map((author) => ({ id: author._id, name: author.name })));
    } catch (error) {
      console.error("Failed to fetch authors:", error);
      showSnackbar("Failed to fetch authors", "error");
    }
  }, []);
  // Modify fetchFashion to handle multiple image2
  const fetchFashion = useCallback(async () => {
    if (fashionId) {
      try {
        const response = await fetch(
          `${backendURL}/api/getFashionById/${fashionId}`
        );
        const data = await response.json();
        if (data.success) {
          setFormData(data.data);

          // Handle image1 preview
          const image1Preview = data.data.image1
            ? `${backendURL}${data.data.image1}`
            : null;

          // Handle multiple image2 previews
          const image2Previews = data.data.image2
            ? Array.isArray(data.data.image2)
              ? data.data.image2.map((img) => `${backendURL}${img}`)
              : [`${backendURL}${data.data.image2}`]
            : [];

          setPreviews({
            image1: image1Preview,
            image2: image2Previews,
            videoClip: data.data.videoClip
              ? `${backendURL}${data.data.videoClip}`
              : null,
          });

          // Set grid images for editing
          setGridImages(image2Previews.map((preview) => ({ preview })));
        }
      } catch (error) {
        console.error("Error fetching fashion data:", error);
        showSnackbar("Failed to fetch fashion data", "error");
      }
    }
  }, [fashionId]);

  useEffect(() => {
    fetchAuthors();
    fetchFashion();
  }, [fetchAuthors, fetchFashion]);

  // Reset subCategory when postType changes to non-Lifestyle
  useEffect(() => {
    if (formData.postType !== "LifeStyle") {
      setFormData((prev) => ({ ...prev, subCategory: "" }));
    }
  }, [formData.postType]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFileInputs((prev) => ({ ...prev, [type]: file }));
      setPreviews((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file),
      }));
    }
  };

  useEffect(() => {
    return () => {
      console.log("Previews before cleanup:", previews); // Log the previews
      Object.entries(previews).forEach(([key, url]) => {
        if (Array.isArray(url)) {
          url.forEach((imgUrl) => {
            if (typeof imgUrl === "string" && imgUrl.startsWith("blob:")) {
              URL.revokeObjectURL(imgUrl);
            }
          });
        } else if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [gridImages, setGridImages] = useState([]);

  const handleGridImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // Limit to 5 images
    const updatedImages = [...gridImages, ...newImages].slice(0, 5);
    setGridImages(updatedImages);

    // Also update fileInputs to include these files
    setFileInputs((prev) => ({
      ...prev,
      image2: updatedImages.map((img) => img.file),
    }));
  };

  const removeGridImage = (indexToRemove) => {
    const updatedImages = gridImages.filter(
      (_, index) => index !== indexToRemove
    );
    setGridImages(updatedImages);

    // Update fileInputs accordingly
    setFileInputs((prev) => ({
      ...prev,
      image2: updatedImages.map((img) => img.file),
    }));
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  // Modify handleSubmit to handle multiple image2 files
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fashionFormData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          fashionFormData.append(key, value);
        }
      });

      // Handle single file uploads
      ["image1", "videoClip"].forEach((key) => {
        if (fileInputs[key] instanceof File) {
          fashionFormData.append(key, fileInputs[key]);
        }
      });

      // Handle multiple image2 uploads
      if (fileInputs.image2 && fileInputs.image2.length > 0) {
        fileInputs.image2.forEach((file, index) => {
          fashionFormData.append(`image2`, file);
        });
      }

      const url = fashionId
        ? `${backendURL}/api/updateFashion/${fashionId}`
        : `${backendURL}/api/createFashion`;
      const method = fashionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: fashionFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save fashion post");
      }

      const data = await response.json();
      showSnackbar(
        fashionId ? "Post updated successfully" : "Post created successfully",
        "success"
      );
      navigate("/DashBoard/Admin/FashionList");
    } catch (error) {
      console.error("Error saving fashion post:", error);
      showSnackbar(error.message || "Failed to save Post", "error");
    } finally {
      setLoading(false);
    }
  };

  // quill-image-upload
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(`${backendURL}/api/upload-quill-image`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);

        // Insert the image into the editor
        quill.insertEmbed(range.index, "image", `${backendURL}${data.url}`);
        // Move cursor to next position
        quill.setSelection(range.index + 1);
      } catch (error) {
        console.error("Error uploading image:", error);
        showSnackbar("Failed to upload image", "error");
      }
    };
  }, [backendURL]);

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  // Quill formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "link",
    "image",
  ];

  return (
    <Box className="p-3 max-w-3xl mx-auto min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200"
      >
        <IoArrowBack className="mr-2" size={24} />
        Back
      </button>
      <h1 className="text-center text-3xl my-7 font-semibold">
        {fashionId ? "Edit Post" : "Create Post"}
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          required
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="author-select-label">Author</InputLabel>
          <Select
            labelId="author-select-label"
            id="authorId"
            name="authorId"
            value={formData.authorId}
            onChange={handleInputChange}
            label="Author"
            required
          >
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          select
          label="Category"
          required
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          fullWidth
        >
          <MenuItem value="uncategorized">Select a category</MenuItem>
          <MenuItem value="Regular">Regular</MenuItem>
          <MenuItem value="TopTrend">TopTrend</MenuItem>
          <MenuItem value="Recommended">Recommended</MenuItem>
        </TextField>
        <TextField
          select
          label="Post Type"
          required
          id="postType"
          name="postType"
          value={formData.postType}
          onChange={handleInputChange}
          fullWidth
        >
          <MenuItem value="">Select a post type</MenuItem>
          <MenuItem value="PopCulture">PopCulture</MenuItem>
          <MenuItem value="Family">Society</MenuItem>
          <MenuItem value="Events">Events</MenuItem>
          <MenuItem value="Celebrities">Celebrities</MenuItem>
          <MenuItem value="Fashion">Fashion</MenuItem>
          <MenuItem value="LifeStyle">LifeStyle</MenuItem>
          <MenuItem value="Entertainment">Entertainment</MenuItem>
          <MenuItem value="Shopping">Shopping</MenuItem>
          <MenuItem value="Business">Business</MenuItem>
          <MenuItem value="Award">Awards</MenuItem>
        </TextField>

        {/* Conditional SubCategory Dropdown */}
        {formData.postType === "LifeStyle" && (
          <TextField
            select
            label="Sub Category"
            required
            id="subCategory"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleInputChange}
            fullWidth
          >
            <MenuItem value="">Select a sub category</MenuItem>
            {lifestyleSubCategories.map((subCat) => (
              <MenuItem key={subCat} value={subCat}>
                {subCat}
              </MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          label="Video Tag"
          id="videoTag"
          name="videoTag"
          value={formData.videoTag}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Video Content"
          id="videoContent"
          name="videoContent"
          value={formData.videoContent}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
        />

        {/* Single Image Upload */}
        <Box className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image1")}
            ref={fileInputRefs.image1}
            style={{ display: "none" }}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRefs.image1.current.click()}
          >
            Choose Cover Image
          </Button>
          {previews.image1 && (
            <img
              src={previews.image1}
              alt="preview image1"
              className="w-20 h-20 object-cover"
            />
          )}
        </Box>

        {/* Grid Image Upload */}
        <Box className="border-4 border-teal-500 border-dotted p-3">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGridImageChange}
            ref={fileInputRefs.image2}
            style={{ display: "none" }}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRefs.image2.current.click()}
            disabled={gridImages.length >= 5}
          >
            Upload Grid Images (Max 5)
          </Button>

          {gridImages.length > 0 && (
            <Grid container spacing={2} className="mt-4">
              {gridImages.map((img, index) => (
                <Grid item xs={4} key={index} className="relative">
                  <img
                    src={img.preview}
                    alt={`grid preview ${index}`}
                    className="w-full h-32 object-cover"
                  />
                  <IconButton
                    size="small"
                    className="absolute top-0 right-0 bg-red-500 text-white"
                    onClick={() => removeGridImage(index)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Video Clip Upload */}
        <Box className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "videoClip")}
            ref={fileInputRefs.videoClip}
            style={{ display: "none" }}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRefs.videoClip.current.click()}
          >
            Choose Video Clip
          </Button>
          {previews.videoClip && (
            <video
              src={previews.videoClip}
              className="w-20 h-20 object-cover"
              controls
            />
          )}
        </Box>

        <div className="h-[400px] mb-12">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            modules={modules}
            formats={formats}
            placeholder="Write something..."
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
            className="quill-editor h-full"
          />
        </div>

        <ResponsiveFashionButton
          loading={loading}
          fashionId={fashionId}
          handleSubmit={handleSubmit}
        />
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const ResponsiveFashionButton = ({ loading, fashionId, handleSubmit }) => {
  return (
    <div className="w-full flex justify-center mt-4 mb-8">
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg 
                 transition-colors duration-200 min-w-[200px] max-w-full
                 whitespace-normal text-center disabled:bg-blue-300
                 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <span>{fashionId ? "Update" : "Publish"} Fashion Post</span>
        )}
      </button>
    </div>
  );
};
