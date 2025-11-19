import { Pagination, Stack } from "@mui/material";

export default function BlogPagination({ page, totalPages, onChange }) {
  return (
   
      <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  {/* Back Button */}
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <a
                      className="page-link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) onChange(page - 1);
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
                            onChange(p);
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
                        if (page < totalPages) onChange(page + 1);
                      }}
                    >
                      Next <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
   
  );
}
