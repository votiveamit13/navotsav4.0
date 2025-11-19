import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

export default function BlogCard({ blog }) {
  const navigate = useNavigate();
  return (
    <Card className="h-100 shadow-sm" sx={{ borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={blog.banner || "/placeholder.jpg"}
        alt={blog.title}
      />
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            display="flex"
            alignItems="center"
          >
            <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
            {blog.created_at}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="flex"
            alignItems="center"
          >
            <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
            {blog.created_by || "Admin"}
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {blog.title}
        </Typography>
        <div
          className="text-muted mb-3"
          style={{
            fontSize: "0.9rem",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
          dangerouslySetInnerHTML={{
            __html: blog.description || "",
          }}
        />
        <Button
          size="small"
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: "8px" }}
          onClick={() => navigate(`/blog/${blog.id}`)}
        >
          Read More →
        </Button>
      </CardContent>
    </Card>
  );
}
