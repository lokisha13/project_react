import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom"; // <-- Import Link

function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Default sort by date descending
      data.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
      });

      setUsers(data);
    };
    fetchUsers();
  }, []);

  const sortBy = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...users].sort((a, b) => {
      let aValue = a[key] || "";
      let bValue = b[key] || "";

      if (key === "guests") {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      } else if (key === "date") {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setUsers(sorted);
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name ? user.name.toLowerCase() : "";
    return name.includes(searchTerm.toLowerCase());
  });

  const containerStyle = {
    maxWidth: "900px",
    margin: "2rem auto",
    fontFamily: "'Segoe UI', sans-serif",
  };

  const searchStyle = {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "1.5rem",
    fontSize: "1rem",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    padding: "1.5rem",
    marginBottom: "1rem",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const rowStyle = {
    padding: "0.5rem 0",
    borderBottom: "1px solid #eee",
  };

  const backButtonStyle = {
    marginBottom: "1rem",
    display: "inline-block",
    color: "#ff7e5f",
    textDecoration: "none",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <Link to="/" style={backButtonStyle}>&larr; Back to Home</Link>
      <h2 style={{ textAlign: "center", color: "#ff7e5f", marginBottom: "1.5rem" }}>Registered Users</h2>

      <input
        type="text"
        placeholder="Search by name"
        style={searchStyle}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={{ ...cardStyle }}>
        <div style={headerStyle}>
          <div onClick={() => sortBy("name")}>Name</div>
          <div onClick={() => sortBy("email")}>Email</div>
          <div onClick={() => sortBy("phone")}>Phone</div>
          <div onClick={() => sortBy("guests")}>Guests</div>
          <div onClick={() => sortBy("date")}>Date</div>
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} style={rowStyle}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{user.name || "-"}</span>
                <span>{user.email || "-"}</span>
                <span>{user.phone || "-"}</span>
                <span>{user.guests || "-"}</span>
                <span>{user.date || "-"}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "1rem" }}>No users found</div>
        )}
      </div>
    </div>
  );
}

export default UserList;
