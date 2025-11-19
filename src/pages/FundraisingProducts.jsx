import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  IconButton,
  Pagination,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { fetchEvents } from "../services/EventService";
import "../assets/css/event-products.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCart";

const FundraisingProducts = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ Fetch events from API
  const loadEvents = async (pageNo = 1) => {
    setLoading(true);
    try {
      const location = searchParams.get("location") || "";
      const date = searchParams.get("date") || "";
      const category = searchParams.get("category") || "";

      const res = await fetchEvents({ page: pageNo, location, date, category });
      console.log("data", res.data);
      setEvents(res.data);
      setTotalPages(res.meta.last_page);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <section className="page-header banner-top-add">
        <div className="container">
          <h1>Fundraising Products</h1>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Fundraising Products
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <div className="latest-events-add">
        <div className="container">
          <h1 className="text-center">
            Latest <span className="events-text">Events</span>
          </h1>
          <p className="text-center celebrate-text">
            We celebrate every win, no matter how big or small. Our platform is
            buzzing with excitement as players hit jackpots and score massive
            crypto payouts daily.
          </p>

          <div className="latest-events-inner-added">
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress sx={{ color: "#ee127b" }} />
              </Box>
            ) : (
              <div className="row g-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  {/* Back Button */}
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <a
                      className="page-link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                    >
                      <i className="bi bi-chevron-left"></i> Back
                    </a>
                  </li>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <li
                        key={p}
                        className={`page-item ${page === p ? "active" : ""}`}
                      >
                        <a
                          className="page-link"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(p);
                          }}
                        >
                          {p}
                        </a>
                      </li>
                    )
                  )}

                  {/* Next Button */}
                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) setPage(page + 1);
                      }}
                    >
                      Next <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FundraisingProducts;
