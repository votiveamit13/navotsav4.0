import { useEffect, useState } from "react";
import "../assets/css/purchased-tickets.css";
import "../assets/css/event-products.css";
import { AuthTab } from "../components/AuthTab";
import { TicketHistory } from "../services/EventService";
import { Box, CircularProgress } from "@mui/material";
import ClaimModal from "../modals/ClaimModal"; // 👈 import modal
import "../assets/css/winner_animation.css";

export const PurchasedTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const myTickets = async (pageNo = 1) => {
      setLoading(true);
      try {
        const res = await TicketHistory({ page: pageNo });
        setTickets(res.data);
        setTotalPages(res.meta.last_page);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    myTickets(page);
  }, [page]);

  return (
    <div className="profile-section-add">
      <div className="container">
        <div className="row">
          <div className="col-md-3 sidebar left-sidebar">
            <AuthTab />
          </div>

          <div className="col-md-9 right-side-content">
            <div className="profile-card">
              <div className="card-header">Donate History</div>
              <div className="card-body purchased-tickets">
                <div className="tickets-history">
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 10,
                      }}
                    >
                      <CircularProgress sx={{ color: "#00c853" }} />
                    </Box>
                  ) : (
                    <table className="table align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Event</th>
                          <th>Ticket</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total Price</th>
                          <th>Date</th>
                        </tr>
                      </thead>

                      <tbody className="ads-table-tickets">
                        {tickets.map((ticket, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                {ticket?.event}
                              </div>
                            </td>

                            <td>
                              #{ticket.ticket_number}
                              {ticket.is_winner && (
                                <img
                                  src="/images/prize.png"
                                  alt="Winner"
                                  className="winner-icon ms-2 bounce"
                                  style={{ width: "30px", height: "30px" }}
                                />
                              )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {ticket?.sold_tickets}
                              </div>
                            </td>

                            <td className="fw-bold">${ticket.price}</td>

                            <td className="fw-bold">${ticket.total_price}</td>
                            <td>{ticket.purchase_at}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
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
    </div>
  );
};
