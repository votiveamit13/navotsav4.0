import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import BlogCard from "../components/BlogCard";
import BlogPagination from "../components/BlogPagination";
import { Typography, Box, CircularProgress } from "@mui/material";
import { fetchBlogs } from "../services/WebService";
import "../assets/css/event-products.css";


export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetchBlogs({ page, limit: 9 });
        setBlogs(res.data || []);
        setTotalPages(res.meta?.last_page || 5);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);

  return (
    <>
      <div className="">
        <section className="page-header banner-top-add">
          <div className="container">
            <h1>Blogs</h1>
            <nav aria-label="breadcrumb">
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Blogs
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </div>
      <Container className="py-5">
        {/* Header */}

        {/* Blog Grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress aria-bus={true} sx={{ color: "#ee127b" }} />
          </Box>
        ) : (
          <Row className="g-4">
            {blogs.map((blog) => (
              <Col key={blog.id} xs={12} sm={6} lg={4}>
                <BlogCard blog={blog} />
              </Col>
            ))}
          </Row>
        )}

        {/* Pagination */}
        <BlogPagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </Container>
    </>
  );
}
