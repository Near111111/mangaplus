import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CategoryIcon from "@mui/icons-material/Category";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const menuItems = [
    { label: "Home", icon: <HomeIcon /> },
    { label: "Genres", icon: <CategoryIcon /> },
    { label: "Manga List", icon: <ListAltIcon /> },
    { label: "Favorites", icon: <FavoriteBorderIcon /> },
  ];

  const handleMenuClick = (label: string) => {
    if (label === "Home" || label === "Manga List") {
      navigate("/home"); // Redirect to home
    } else {
      window.alert(`${label} — Coming Soon!`);
    }
  };

  const DrawerList = (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        backgroundColor: "rgba(10, 10, 20, 0.6)",
        backdropFilter: "blur(8px)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          padding: "32px 24px",
          borderBottom: "2px solid #ff6b35",
        }}
      >
        <h2 style={{ color: "#ff6b35", margin: 0, fontSize: "20px" }}>
          MANGAPLUS
        </h2>
      </Box>

      {/* Menu Items */}
      <List sx={{ padding: "24px 0", flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.label}
            onClick={(e) => {
              e.stopPropagation(); // Prevent drawer closing before action
              handleMenuClick(item.label);
            }}
            sx={{
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              gap: "18px",
              cursor: "pointer",
              color: "#eee",
              borderRadius: "8px",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "rgba(255, 107, 53, 0.12)",
              },
            }}
          >
            <Box sx={{ color: "#ff6b35", fontSize: "22px" }}>{item.icon}</Box>
            <span style={{ fontSize: "14px", letterSpacing: "0.5px" }}>
              {item.label}
            </span>
          </ListItem>
        ))}
      </List>

      {/* Footer Info */}
      <Box
        sx={{
          padding: "24px",
          position: "absolute",
          bottom: 0,
          width: "100%",
          borderTop: "1px solid rgba(255, 107, 53, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* TikTok Follow */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            opacity: 0.85,
            transition: "0.3s",
            "&:hover": {
              opacity: 1,
            },
          }}
          onClick={() =>
            window.open("https://www.tiktok.com/@itsyaboynear", "_blank")
          }
        >
          <img
            src="/tiktoklogo.png"
            alt="TikTok"
            style={{ width: "20px", height: "20px" }}
          />
          <span style={{ color: "#ccc", fontSize: "13px" }}>
            Show love by following me on TikTok
          </span>
        </Box>

        <span style={{ color: "#777", fontSize: "12px" }}>
          © 2026 MANGAPLUS
        </span>
      </Box>
    </Box>
  );

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <img src="/manwha_icon.png" alt="Mangaplus" className="logo-icon" />
            <span className="logo-text">MANGAPLUS</span>
          </div>
        </div>

        <IconButton
          onClick={toggleDrawer(true)}
          sx={{
            color: "white",
            marginRight: "20px",
            border: "2px solid #ff6b35",
            borderRadius: "8px",
            padding: "10px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 107, 53, 0.15)",
              transform: "scale(1.05)",
            },
          }}
        >
          <MenuIcon sx={{ fontSize: "28px" }} />
        </IconButton>
      </div>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          },
        }}
        PaperProps={{
          sx: {
            background:
              "linear-gradient(135deg, rgba(20,20,35,0.98) 0%, rgba(255,107,53,0.1) 50%, rgba(20,20,35,0.5) 100%)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </header>
  );
};

export default Header;
