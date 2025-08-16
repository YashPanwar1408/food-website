"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    profileImage: File | null;
  }>({
    firstName: "",
    lastName: "",
    phone: "",
    profileImage: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");

  const [activityHistory, setActivityHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoaded || !user) return;

     fetch(`/api/profile?clerkId=${user.id}&email=${encodeURIComponent(user.primaryEmailAddress?.emailAddress ?? '')}&firstName=${encodeURIComponent(user.firstName ?? '')}&lastName=${encodeURIComponent(user.lastName ?? '')}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.user);
          setForm({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            phone: data.user.phone || "",
            profileImage: null,
          });
          setPreviewUrl(data.user.profileImage || "");
          setActivityHistory(data.user.activityHistory || []);
        } else {
          setError(data.error || "Failed to fetch profile");
        }
      })
      .catch(() => setError("Failed to fetch profile"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files && files[0]) {
      setForm((prev) => ({ ...prev, profileImage: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData();
    formData.append("clerkId", user.id);
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("phone", form.phone);
    if (form.profileImage) {
      formData.append("profileImage", form.profileImage);
    } else if (form.profileImage === null && previewUrl) { // Case for removing image
      formData.append("profileImage", ""); // Send empty string to indicate removal
    }

    const res = await fetch("/api/profile/update", {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      setProfile(data.user);
      setForm({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        phone: data.user.phone || "",
        profileImage: null, // Clear file input
      });
      setPreviewUrl(data.user.profileImage || ""); // Update preview with new URL from backend
      setActivityHistory([`Profile updated at ${new Date().toLocaleString()}`, ...activityHistory]);
      setError("");
      alert("Profile updated successfully!");
      user.reload();
    } else {
      setError(data.error || "Failed to update profile");
    }
  };

  const handleRemoveProfileImage = async () => {
    if (!user) return;
    setForm((prev) => ({ ...prev, profileImage: null }));
    setPreviewUrl("");
    const formData = new FormData();
    formData.append("clerkId", user.id);
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("phone", form.phone);
    formData.append("profileImage", ""); // Indicate removal
    const res = await fetch("/api/profile/update", {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      setProfile(data.user);
      setForm({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        phone: data.user.phone || "",
        profileImage: null,
      });
      setPreviewUrl("");
      setActivityHistory([`Profile image removed at ${new Date().toLocaleString()}`, ...activityHistory]);
      setError("");
      alert("Profile image removed successfully!");
      user.reload();
    } else {
      setError(data.error || "Failed to remove profile image");
    }
  };

  if (loading) return <div className="min-h-screen"><Navbar /><main className="flex-grow">Loading...</main><Footer /></div>;
  if (error) return <div className="min-h-screen"><Navbar /><main className="flex-grow">Error: {error}</main><Footer /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <label htmlFor="profileImage" className="mb-2 font-medium text-foreground">Profile Image</label>
            <div className="flex flex-col items-center">
              <label htmlFor="profileImage" className="cursor-pointer flex flex-col items-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile Preview" className="rounded-full w-24 h-24 object-cover border-2 bg-background border-border mb-2" />
                ) : (
                  <div className="w-24 h-24 mx-auto mb-2 rounded-full border-2 border-border flex items-center justify-center cursor-pointer transition-colors duration-150 bg-background hover:bg-muted shadow-md">
                    <span className="text-center text-sm text-muted-foreground px-2 py-2">Click to add photo</span>
                  </div>
                )}
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-muted-foreground">Choose a profile picture by clicking above</span>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveProfileImage}
                  className="mt-2 px-4 py-2 rounded-lg border-2 border-border font-medium transition-colors duration-150 text-red-500 hover:bg-muted hover:text-red-700 bg-background"
                >
                  Remove Profile Picture
                </button>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="firstName" className="block mb-1 font-medium text-foreground">First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={form.firstName} 
              onChange={handleChange} 
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" 
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-1 font-medium text-foreground">Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={form.lastName} 
              onChange={handleChange} 
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" 
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1 font-medium text-foreground">Phone</label>
            <input 
              type="text" 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg border-2 border-primary font-medium transition-colors duration-150 hover:bg-primary/90 shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Update Profile
          </button>
        </form>

        {/* Activity History */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Activity History</h2>
          <ul className="space-y-2">
            {activityHistory.length === 0 ? (
              <li className="text-muted-foreground bg-muted/50 p-3 rounded-lg shadow border border-border">
                No activity yet.
              </li>
            ) : (
              activityHistory.map((activity, idx) => (
                <li key={idx} className="bg-muted/50 text-foreground p-3 rounded-lg shadow border border-border">
                  {activity}
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;