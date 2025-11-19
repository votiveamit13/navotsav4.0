import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import { fetchBlogInfo } from "../services/WebService";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        const res = await fetchBlogInfo(slug);
        setBlog(res.data || res);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    }
    console.log("blogid", slug);
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner animation="border" />
        <Typography variant="body2" mt={2}>
          Loading blog details...
        </Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h6" color="error">
          Blog not found
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #f50057 0%, #7c4dff 100%)",
          color: "white",
          py: 10,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          {blog.title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          HOME / BLOG / {blog.title}
        </Typography>
      </Box>

      {/* Blog Content */}
      <Container className="py-5">
        {blog.banner && (
          <img
            src={blog.banner}
            alt={blog.title}
            className="img-fluid rounded mb-4"
          />
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
            <Typography
              variant="caption"
              display="flex"
              alignItems="center"
              color="text.secondary"
            >
              <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
              {blog.created_at}
            </Typography>
            {/* {blog.category && (
              <Typography
                variant="caption"
                display="flex"
                alignItems="center"
                color="text.secondary"
              >
                <CategoryIcon fontSize="small" sx={{ mr: 0.5 }} />
                {blog.category}
              </Typography>
            )} */}
          </Box>
          <Typography
            variant="caption"
            display="flex"
            alignItems="center"
            color="text.secondary"
          >
            <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
            {blog?.created_by}
          </Typography>
        </Box>

        {/* Blog Title */}
        <Typography variant="h5" fontWeight={600} mb={3}>
          {blog.title}
        </Typography>

        {/* Description (render HTML safely) */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.description || "" }}
        />

        {/* Back Link */}
        <Box mt={5}>
          <Link to="/blog" className="btn btn-outline-primary">
            ← Back to Blog
          </Link>
        </Box>
      </Container>
    </div>
  );
}
