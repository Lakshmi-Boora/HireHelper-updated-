// src/views/settings/SettingsView.tsx
import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Camera, Lock } from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../contexts/AuthContext";

interface ProfileData {
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  bio: string;
  profile_picture: string;
}

const SettingsView: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    bio: "",
    profile_picture: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/settings/profile");
        setProfile(res.data.user);
      } catch (err) {
        console.error("Fetch profile error:", err);
        alert("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      let updatedProfile = { ...profile };

      // Upload profile picture if file selected
      if (file) {
        const formData = new FormData();
        formData.append("profile_picture", file);

        const uploadRes = await api.put("/settings/profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        updatedProfile = uploadRes.data.user;

        // ✅ update global auth context immediately
        updateUser({
  avatar: uploadRes.data.user.profile_picture
    ? `http://localhost:2000${uploadRes.data.user.profile_picture}`
    : "/default-pfp.jpg",
  profile_picture: uploadRes.data.user.profile_picture,
});


        setFile(null);
      }

      const res = await api.put("/settings/profile", updatedProfile);
      setProfile(res.data.user);

      // update names in global context
      updateUser({
        first_name: res.data.user.first_name,
        last_name: res.data.user.last_name,
        name: `${res.data.user.first_name} ${res.data.user.last_name}`,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return alert("Enter both old and new passwords");
    try {
      await api.put("/settings/password", { oldPassword, newPassword });
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-4 max-w-full">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage your profile and account preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-4">
        <h3 className="text-base font-bold text-gray-900">Profile Details</h3>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : profile.profile_picture
                  ? `http://localhost:2000${profile.profile_picture}`
                  : "/default-pfp.jpg"
              }
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <button
              className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Profile Photo</h4>
            <p className="text-xs text-gray-500">Update your profile picture</p>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileInput"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />

        {/* Name, Email, Phone, Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={profile.first_name}
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={profile.last_name}
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email_id}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={profile.phone_number}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
              placeholder="Tell others about yourself..."
            />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition duration-200"
        >
          Save Changes
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-4">
        <h3 className="text-base font-bold text-gray-900">Change Password</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition duration-200"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
