import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", guests: "", date: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // ---- DELETE ----
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteDoc(doc(db, "users", userToDelete.id));
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting user");
    }
  };

  // ---- EDIT ----
  const openEditModal = (user) => {
    setUserToEdit(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      guests: user.guests || "",
      date: user.date || "",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!userToEdit) return;
    try {
      const userRef = doc(db, "users", userToEdit.id);
      await updateDoc(userRef, formData);
      setUsers((prev) =>
        prev.map((u) => (u.id === userToEdit.id ? { ...u, ...formData } : u))
      );
      setShowEditModal(false);
      setUserToEdit(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating user");
    }
  };

  // ---- Styles ----
  const containerStyle = { maxWidth: "1000px", margin: "2rem auto", fontFamily: "'Segoe UI', sans-serif" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", borderRadius: "8px", overflow: "hidden", boxShadow: "0 5px 20px rgba(0,0,0,0.1)" };
  const thStyle = { background: "#ff7e5f", color: "#fff", padding: "12px", textAlign: "left" };
  const tdStyle = { padding: "12px", borderBottom: "1px solid #ddd" };
  const trEven = { background: "#f9f9f9" };
  const trExpired = { color: "#6c757d" };
  const searchStyle = { width: "100%", padding: "0.7rem", marginBottom: "1rem", border: "1px solid #ccc", borderRadius: "6px" };
  const deleteBtn = { padding: "6px 12px", borderRadius: "6px", border: "none", background: "#dc3545", color: "#fff", cursor: "pointer" };
  const editBtn = { ...deleteBtn, background: "#0d6efd", marginRight: "6px" };
  const disabledEditBtn = { ...editBtn, background: "#6c757d", cursor: "not-allowed", opacity: 0.6 };
  const cancelBtn = { ...deleteBtn, background: "#6c757d" };
  const modalStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
  const modalBox = { width: "400px", background: "#fff", borderRadius: "8px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" };
  const inputStyle = { width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "6px" };

  // ---- Helper: Check expired date ----
  const isExpired = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservationDate = new Date(date);
    return reservationDate < today;
  };

  return (
    <div style={containerStyle}>
      <Link to="/" style={{ marginBottom: "1rem", display: "inline-block", color: "#ff7e5f", fontWeight: "bold" }}>
        &larr; Back to Home
      </Link>
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#ff7e5f" }}>Registered Users</h2>

      <input
        type="text"
        placeholder="Search by name"
        style={searchStyle}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Guests</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) => (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
            .map((user, idx) => {
              const expired = isExpired(user.date);
              return (
                <tr key={user.id} style={{ ...(idx % 2 === 0 ? trEven : {}), ...(expired ? trExpired : {}) }}>
                  <td style={tdStyle}>{user.name || "-"}</td>
                  <td style={tdStyle}>{user.email || "-"}</td>
                  <td style={tdStyle}>{user.phone || "-"}</td>
                  <td style={tdStyle}>{user.guests || "-"}</td>
                  <td style={tdStyle}>{user.date || "-"}</td>
                  <td style={tdStyle}>
                    <button
                      type="button"
                      style={expired ? disabledEditBtn : editBtn}
                      onClick={() => !expired && openEditModal(user)}
                      disabled={expired}
                    >
                      Edit
                    </button>
                    <button type="button" style={deleteBtn} onClick={() => confirmDelete(user)}>Delete</button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={modalStyle} onClick={() => setShowDeleteModal(false)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ marginBottom: "10px" }}>Confirm Delete</h4>
            <p>Are you sure you want to delete <b>{userToDelete?.name}</b>?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button style={cancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button style={deleteBtn} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={modalStyle} onClick={() => setShowEditModal(false)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ marginBottom: "10px" }}>Edit User</h4>
            <input type="text" placeholder="Name" style={inputStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="email" placeholder="Email" style={inputStyle} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type="text" placeholder="Phone" style={inputStyle} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <input type="number" placeholder="Guests" style={inputStyle} value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} />
            <input type="date" style={inputStyle} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button style={cancelBtn} onClick={() => setShowEditModal(false)}>Cancel</button>
              <button style={editBtn} onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
