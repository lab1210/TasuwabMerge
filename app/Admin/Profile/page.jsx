"use client";
import React, { useState } from "react";
import styles from "../../Components/css/Profile.module.css";
import Layout from "../../Components/Layout";
import Image from "next/image";
import { useAuth } from "@/app/Components/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user ? { ...user } : {});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleSave = () => {
    setUser(formData);
    setEditMode(false);
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 2000);
  };
  if (!user) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className={styles.container}>
        {message && <p className={styles.successMessage}>{message}</p>}

        <div className={styles.profileCard}>
          <div className={styles.imageContainer}>
            <Image
              src={formData.image || "/placeholder-image.png"}
              alt="Profile"
              width={100}
              height={100}
              className={styles.profileImage}
            />
            {editMode && (
              <div className={styles.uploadContainer}>
                <label htmlFor="fileInput" className={styles.uploadButton}>
                  Upload Image
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.hiddenInput}
                />
              </div>
            )}
          </div>

          <h2 className={styles.title}>Profile</h2>

          <div className={styles.profileField}>
            <label>Name:</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            ) : (
              <span>{user.name}</span>
            )}
          </div>

          <div className={styles.profileField}>
            <label>Email:</label>
            <span>{user.email}</span>
          </div>

          <div className={styles.profileField}>
            <label>Role:</label>
            <span>{user.role}</span>
          </div>

          <div className={styles.profileField}>
            <label>Contact:</label>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            ) : (
              <span>{user.phone}</span>
            )}
          </div>

          <div className={styles.buttonGroup}>
            {editMode ? (
              <button className={styles.saveButton} onClick={handleSave}>
                Save Changes
              </button>
            ) : (
              <button
                className={styles.editButton}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
