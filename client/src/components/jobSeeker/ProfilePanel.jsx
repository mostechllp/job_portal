import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  XIcon,
  UploadCloudIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserCircle,
  FileText,
  File,
  PlusIcon,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Briefcase,
  GraduationCap,
  Languages,
} from "lucide-react";
import {
  fetchProfile,
  updateProfile,
  addSkill,
  removeSkill,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addLanguage,
  removeLanguage,
  uploadResume,
  deleteResume,
  clearUploadProgress,
  deleteProfileImage,
  uploadProfileImage,
} from "../../store/slices/profileSlice";
import { updateUserProfileImage } from "../../store/slices/authSlice";

export function ProfilePanel({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { profile, loading, error, uploadProgress } = useSelector(
    (state) => state.profile,
  );
  const { user } = useSelector((state) => state.auth);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Experience Form State
  const [experienceForm, setExperienceForm] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  // Education Form State
  const [educationForm, setEducationForm] = useState({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  // Language Form State
  const [languageForm, setLanguageForm] = useState({
    name: "",
    proficiency: "conversational",
  });

  // Form state for editable fields
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    professionalSummary: "",
    jobPreferences: {
      preferredRoles: [],
      expectedSalary: { min: "", max: "", currency: "INR" },
      workType: "full-time",
      preferredLocations: [],
      noticePeriod: null,
    },
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
    },
  });

  // Preferred roles input
  const [preferredRolesInput, setPreferredRolesInput] = useState("");
  const [preferredLocationsInput, setPreferredLocationsInput] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setInitialLoading(true);
      dispatch(fetchProfile()).finally(() => {
        setInitialLoading(false);
      });
    }
  }, [isOpen, user, dispatch]);

  // Update form data when profile changes - but ONLY if not in editing mode
  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        phone: profile.phone || "",
        location: profile.location || "",
        professionalSummary: profile.professionalSummary || "",
        jobPreferences: {
          preferredRoles: profile.jobPreferences?.preferredRoles || [],
          expectedSalary: {
            min: profile.jobPreferences?.expectedSalary?.min || "",
            max: profile.jobPreferences?.expectedSalary?.max || "",
            currency: profile.jobPreferences?.expectedSalary?.currency || "INR",
          },
          workType: profile.jobPreferences?.workType || "full-time",
          preferredLocations: profile.jobPreferences?.preferredLocations || [],
          noticePeriod: profile.jobPreferences?.noticePeriod || null,
        },
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || "",
          github: profile.socialLinks?.github || "",
          portfolio: profile.socialLinks?.portfolio || "",
          twitter: profile.socialLinks?.twitter || "",
        },
      });

      setPreferredRolesInput(
        profile.jobPreferences?.preferredRoles?.join(", ") || "",
      );
      setPreferredLocationsInput(
        profile.jobPreferences?.preferredLocations?.join(", ") || "",
      );
    }
  }, [profile, isEditing]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const parts = name.split(".");

      if (parts.length === 2) {
        const [parent, child] = parts;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      } else if (parts.length === 3) {
        const [parent, child, grandChild] = parts;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent]?.[child],
              [grandChild]: value === "" ? "" : Number(value),
            },
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageUploadStatus({
        type: "error",
        message: "Please select an image file",
      });
      setTimeout(() => setImageUploadStatus(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadStatus({
        type: "error",
        message: "Image size must be less than 5MB",
      });
      setTimeout(() => setImageUploadStatus(null), 3000);
      return;
    }

    setUploadingImage(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const result = await dispatch(uploadProfileImage(formData)).unwrap();

      // If the API returns user data with updated profileImg, update it in auth slice
      if (result.user?.profileImg) {
        dispatch(updateUserProfileImage(result.user.profileImg));
      } else if (result.profile?.user?.profileImg) {
        dispatch(updateUserProfileImage(result.profile.user.profileImg));
      }

      setImageUploadStatus({
        type: "success",
        message: "Profile image updated successfully",
      });
      setTimeout(() => setImageUploadStatus(null), 3000);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setImageUploadStatus({
        type: "error",
        message: error || "Failed to upload image",
      });
      setTimeout(() => setImageUploadStatus(null), 3000);
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleDeleteProfileImage = async () => {
    if (!window.confirm("Are you sure you want to delete your profile image?"))
      return;

    try {
      await dispatch(deleteProfileImage()).unwrap();

      // Update auth slice with null profile image
      dispatch(updateUserProfileImage(null));

      setImageUploadStatus({
        type: "success",
        message: "Profile image deleted successfully",
      });
      setTimeout(() => setImageUploadStatus(null), 3000);
    } catch (error) {
      console.error("Error deleting profile image:", error);
      setImageUploadStatus({
        type: "error",
        message: error || "Failed to delete image",
      });
      setTimeout(() => setImageUploadStatus(null), 3000);
    }
  };

  const handlePreferredRolesChange = (e) => {
    const value = e.target.value;
    setPreferredRolesInput(value);
    const roles = value
      .split(",")
      .map((role) => role.trim())
      .filter((role) => role);
    setFormData((prev) => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        preferredRoles: roles,
      },
    }));
  };

  const handlePreferredLocationsChange = (e) => {
    const value = e.target.value;
    setPreferredLocationsInput(value);
    const locations = value
      .split(",")
      .map((loc) => loc.trim())
      .filter((loc) => loc);
    setFormData((prev) => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        preferredLocations: locations,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setIsCreatingProfile(true);
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const handleStartAddingInfo = () => {
    setFormData({
      phone: "",
      location: "",
      professionalSummary: "",
      jobPreferences: {
        preferredRoles: [],
        expectedSalary: { min: "", max: "", currency: "INR" },
        workType: "full-time",
        preferredLocations: [],
        noticePeriod: null,
      },
      socialLinks: {
        linkedin: "",
        github: "",
        portfolio: "",
        twitter: "",
      },
    });
    setIsEditing(true);
  };

  // Skill handlers
  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      await dispatch(addSkill(newSkill.trim()));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = async (skill) => {
    await dispatch(removeSkill(skill));
  };

  // Experience handlers
  const handleAddExperience = async () => {
    if (editingExperienceId) {
      await dispatch(
        updateExperience({
          experienceId: editingExperienceId,
          experienceData: experienceForm,
        }),
      );
    } else {
      await dispatch(addExperience(experienceForm));
    }
    setShowAddExperience(false);
    setEditingExperienceId(null);
    setExperienceForm({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
  };

  const handleEditExperience = (exp) => {
    setExperienceForm({
      title: exp.title || "",
      company: exp.company || "",
      location: exp.location || "",
      startDate: exp.startDate
        ? new Date(exp.startDate).toISOString().split("T")[0]
        : "",
      endDate: exp.endDate
        ? new Date(exp.endDate).toISOString().split("T")[0]
        : "",
      current: exp.current || false,
      description: exp.description || "",
    });
    setEditingExperienceId(exp._id);
    setShowAddExperience(true);
  };

  const handleDeleteExperience = async (experienceId) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      await dispatch(deleteExperience(experienceId));
    }
  };

  // Education handlers
  const handleAddEducation = async () => {
    if (editingEducationId) {
      await dispatch(
        updateEducation({
          educationId: editingEducationId,
          educationData: educationForm,
        }),
      );
    } else {
      await dispatch(addEducation(educationForm));
    }
    setShowAddEducation(false);
    setEditingEducationId(null);
    setEducationForm({
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleEditEducation = (edu) => {
    setEducationForm({
      degree: edu.degree || "",
      institution: edu.institution || "",
      location: edu.location || "",
      startDate: edu.startDate
        ? new Date(edu.startDate).toISOString().split("T")[0]
        : "",
      endDate: edu.endDate
        ? new Date(edu.endDate).toISOString().split("T")[0]
        : "",
      description: edu.description || "",
    });
    setEditingEducationId(edu._id);
    setShowAddEducation(true);
  };

  const handleDeleteEducation = async (educationId) => {
    if (window.confirm("Are you sure you want to delete this education?")) {
      await dispatch(deleteEducation(educationId));
    }
  };

  // Language handlers
  const handleAddLanguage = async () => {
    if (languageForm.name.trim()) {
      await dispatch(addLanguage(languageForm));
      setLanguageForm({ name: "", proficiency: "conversational" });
      setShowAddLanguage(false);
    }
  };

  const handleRemoveLanguage = async (language) => {
    await dispatch(removeLanguage(language));
  };

  // Resume handlers
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus("uploading");

    const formData = new FormData();
    formData.append("resume", file);
    if (profile?.resume?.publicId) {
      formData.append("existingPublicId", profile.resume.publicId);
    }

    try {
      await dispatch(uploadResume(formData)).unwrap();
      setUploadStatus("success");
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setTimeout(() => setUploadStatus(null), 3000);
    } finally {
      dispatch(clearUploadProgress());
    }
  };

  const handleDeleteResume = async () => {
    if (profile?.resume?.publicId) {
      await dispatch(deleteResume(profile.resume.publicId));
    }
  };

  // Helper function to get PDF viewer URL
  const getPdfViewerUrl = (url) => {
    if (!url) return null;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  // Show loading state
  if (initialLoading || (loading && !profile && !isCreatingProfile)) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div
        className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 ml-2">
            My Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-600">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p className="text-center">{error}</p>
              <button
                onClick={() => dispatch(fetchProfile())}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Profile Header with Image Upload */}
              <div className="flex items-center gap-5 mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl flex-shrink-0 border-4 border-white shadow-sm overflow-hidden">
                    {user?.profileImg ? (
                      <img
                        src={user.profileImg}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                        key={user.profileImg} // Add key to force re-render when URL changes
                      />
                    ) : (
                      getInitials()
                    )}
                  </div>

                  {/* Image upload overlay - only show when editing */}
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleProfileImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
                        <div className="relative z-10 flex gap-1">
                          <button
                            onClick={() => imageInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="p-1.5 bg-white rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                            title="Upload image"
                          >
                            <UploadCloudIcon className="w-4 h-4" />
                          </button>
                          {user?.profileImg && (
                            <button
                              onClick={handleDeleteProfileImage}
                              disabled={uploadingImage}
                              className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                              title="Delete image"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Uploading indicator */}
                  {uploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {user?.name}
                  </h3>
                  <p className="text-slate-500">{user?.email}</p>
                  {profile && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                  )}
                </div>
              </div>

              {/* Image upload status messages - combined into one */}
              {imageUploadStatus && (
                <div
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                    imageUploadStatus.type === "success"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {imageUploadStatus.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {imageUploadStatus.message}
                </div>
              )}

              {/* If no profile exists */}
              {!profile ? (
                <div className="text-center py-12">
                  <UserCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Add your professional information to get started
                  </p>
                  <button
                    onClick={handleStartAddingInfo}
                    disabled={isCreatingProfile}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingProfile ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      "Start Adding Information"
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Rest of your sections - no changes needed here */}
                  {/* Personal Information */}
                  <section>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Professional Summary */}
                  <section>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                      Professional Summary
                    </h4>
                    <textarea
                      name="professionalSummary"
                      value={formData.professionalSummary}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Write a brief summary about yourself..."
                      maxLength={1000}
                    />
                  </section>

                  {/* Resume */}
                  <section>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                      Resume
                    </h4>

                    {uploadStatus === "success" && (
                      <div className="mb-3 p-2 bg-green-50 text-green-600 rounded-lg flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Resume uploaded successfully!
                      </div>
                    )}
                    {uploadStatus === "error" && (
                      <div className="mb-3 p-2 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Failed to upload resume. Please try again.
                      </div>
                    )}

                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.odt,.txt,.rtf"
                        className="hidden"
                      />

                      {uploadProgress > 0 && uploadProgress < 100 ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                            <span className="text-sm text-slate-600">
                              Uploading... {uploadProgress}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <UploadCloudIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-900 mb-1">
                            {profile.resume?.url
                              ? "Update resume"
                              : "Upload new resume"}
                          </p>
                          <p className="text-xs text-slate-500 mb-4">
                            PDF, DOC, DOCX, ODT, TXT, RTF (up to 10MB)
                          </p>

                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors"
                          >
                            Choose File
                          </button>
                        </>
                      )}

                      {profile.resume?.url && (
                        <div className="mt-6">
                          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg mb-4">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-indigo-600" />
                              <div className="text-left">
                                <p className="text-sm font-medium text-indigo-900">
                                  {profile.resume.fileName || "Current Resume"}
                                </p>
                                <p className="text-xs text-indigo-600">
                                  {profile.resume.fileExtension?.toUpperCase()}{" "}
                                  •{" "}
                                  {(profile.resume.fileSize / 1024).toFixed(0)}{" "}
                                  KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={handleDeleteResume}
                              className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                              title="Delete resume"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {profile.resume?.fileExtension === "pdf" && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-sm font-medium text-slate-700">
                                  Preview
                                </h5>
                              </div>
                              <iframe
                                src={getPdfViewerUrl(profile.resume.url)}
                                className="w-full h-96 border border-slate-200 rounded-lg"
                                title="PDF Preview"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Skills */}
                  <section>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                        >
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1.5 text-indigo-400 hover:text-indigo-600 focus:outline-none"
                            >
                              <XIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddSkill()
                          }
                          placeholder="Add a skill"
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                        />
                        <button
                          onClick={handleAddSkill}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </section>

                  {/* Experience */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Experience
                      </h4>
                      {isEditing && (
                        <button
                          onClick={() => {
                            setShowAddExperience(true);
                            setEditingExperienceId(null);
                            setExperienceForm({
                              title: "",
                              company: "",
                              location: "",
                              startDate: "",
                              endDate: "",
                              current: false,
                              description: "",
                            });
                          }}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Add New
                        </button>
                      )}
                    </div>

                    <div className="space-y-4 mb-4">
                      {profile.experience?.map((exp) => (
                        <div
                          key={exp._id}
                          className="p-4 border border-slate-200 rounded-xl bg-white relative group"
                        >
                          {isEditing && (
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditExperience(exp)}
                                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteExperience(exp._id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="font-semibold text-slate-900">
                              {exp.title}
                            </h5>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                              {new Date(exp.startDate).getFullYear()} -{" "}
                              {exp.current
                                ? "Present"
                                : new Date(exp.endDate).getFullYear()}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 mb-2">
                            {exp.company} {exp.location && `• ${exp.location}`}
                          </div>
                          <p className="text-sm text-slate-500">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Add/Edit Experience Form */}
                    {showAddExperience && (
                      <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50">
                        <h5 className="font-medium text-indigo-900 mb-3">
                          {editingExperienceId
                            ? "Edit Experience"
                            : "Add Experience"}
                        </h5>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={experienceForm.title}
                            onChange={(e) =>
                              setExperienceForm({
                                ...experienceForm,
                                title: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Company"
                            value={experienceForm.company}
                            onChange={(e) =>
                              setExperienceForm({
                                ...experienceForm,
                                company: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={experienceForm.location}
                            onChange={(e) =>
                              setExperienceForm({
                                ...experienceForm,
                                location: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={experienceForm.startDate}
                              onChange={(e) =>
                                setExperienceForm({
                                  ...experienceForm,
                                  startDate: e.target.value,
                                })
                              }
                              className="px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                            <input
                              type="date"
                              value={experienceForm.endDate}
                              onChange={(e) =>
                                setExperienceForm({
                                  ...experienceForm,
                                  endDate: e.target.value,
                                })
                              }
                              disabled={experienceForm.current}
                              className="px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:opacity-50"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="currentJob"
                              checked={experienceForm.current}
                              onChange={(e) =>
                                setExperienceForm({
                                  ...experienceForm,
                                  current: e.target.checked,
                                })
                              }
                              className="rounded border-indigo-300"
                            />
                            <label
                              htmlFor="currentJob"
                              className="text-sm text-indigo-900"
                            >
                              I currently work here
                            </label>
                          </div>
                          <textarea
                            placeholder="Job Description"
                            value={experienceForm.description}
                            onChange={(e) =>
                              setExperienceForm({
                                ...experienceForm,
                                description: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddExperience}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setShowAddExperience(false);
                                setEditingExperienceId(null);
                              }}
                              className="px-4 py-2 bg-white text-slate-600 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Education */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Education
                      </h4>
                      {isEditing && (
                        <button
                          onClick={() => {
                            setShowAddEducation(true);
                            setEditingEducationId(null);
                            setEducationForm({
                              degree: "",
                              institution: "",
                              location: "",
                              startDate: "",
                              endDate: "",
                              description: "",
                            });
                          }}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Add New
                        </button>
                      )}
                    </div>

                    <div className="space-y-4 mb-4">
                      {profile.education?.map((edu) => (
                        <div
                          key={edu._id}
                          className="p-4 border border-slate-200 rounded-xl bg-white relative group"
                        >
                          {isEditing && (
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditEducation(edu)}
                                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteEducation(edu._id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="font-semibold text-slate-900">
                              {edu.degree}
                            </h5>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                              {new Date(edu.startDate).getFullYear()} -{" "}
                              {edu.endDate
                                ? new Date(edu.endDate).getFullYear()
                                : "Present"}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 mb-2">
                            {edu.institution}{" "}
                            {edu.location && `• ${edu.location}`}
                          </div>
                          <p className="text-sm text-slate-500">
                            {edu.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Add/Edit Education Form */}
                    {showAddEducation && (
                      <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50">
                        <h5 className="font-medium text-indigo-900 mb-3">
                          {editingEducationId
                            ? "Edit Education"
                            : "Add Education"}
                        </h5>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Degree"
                            value={educationForm.degree}
                            onChange={(e) =>
                              setEducationForm({
                                ...educationForm,
                                degree: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Institution"
                            value={educationForm.institution}
                            onChange={(e) =>
                              setEducationForm({
                                ...educationForm,
                                institution: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={educationForm.location}
                            onChange={(e) =>
                              setEducationForm({
                                ...educationForm,
                                location: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={educationForm.startDate}
                              onChange={(e) =>
                                setEducationForm({
                                  ...educationForm,
                                  startDate: e.target.value,
                                })
                              }
                              className="px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                            <input
                              type="date"
                              value={educationForm.endDate}
                              onChange={(e) =>
                                setEducationForm({
                                  ...educationForm,
                                  endDate: e.target.value,
                                })
                              }
                              className="px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                          </div>
                          <textarea
                            placeholder="Description"
                            value={educationForm.description}
                            onChange={(e) =>
                              setEducationForm({
                                ...educationForm,
                                description: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddEducation}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setShowAddEducation(false);
                                setEditingEducationId(null);
                              }}
                              className="px-4 py-2 bg-white text-slate-600 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Languages */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Languages
                      </h4>
                      {isEditing && (
                        <button
                          onClick={() => setShowAddLanguage(true)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Add New
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.languages?.map((lang, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                        >
                          {lang.name} - {lang.proficiency}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveLanguage(lang)}
                              className="ml-1.5 text-indigo-400 hover:text-indigo-600 focus:outline-none"
                            >
                              <XIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>

                    {showAddLanguage && isEditing && (
                      <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50">
                        <h5 className="font-medium text-indigo-900 mb-3">
                          Add Language
                        </h5>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Language"
                            value={languageForm.name}
                            onChange={(e) =>
                              setLanguageForm({
                                ...languageForm,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                          <select
                            value={languageForm.proficiency}
                            onChange={(e) =>
                              setLanguageForm({
                                ...languageForm,
                                proficiency: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          >
                            <option value="basic">Basic</option>
                            <option value="conversational">
                              Conversational
                            </option>
                            <option value="professional">Professional</option>
                            <option value="native">Native</option>
                          </select>
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddLanguage}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setShowAddLanguage(false)}
                              className="px-4 py-2 bg-white text-slate-600 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Job Preferences */}
                  <section>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                      Job Preferences
                    </h4>

                    {/* Preferred Roles */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Preferred Roles (comma separated)
                      </label>
                      <input
                        type="text"
                        value={preferredRolesInput}
                        onChange={handlePreferredRolesChange}
                        disabled={!isEditing}
                        placeholder="e.g. Frontend Developer, React Developer"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Work Type
                        </label>
                        <select
                          name="jobPreferences.workType"
                          value={formData.jobPreferences?.workType || "any"}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                        >
                          <option value="any">Any</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="on-site">On-site</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                          Notice Period
                        </label>
                        <select
                          name="jobPreferences.noticePeriod"
                          value={formData.jobPreferences?.noticePeriod || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                        >
                          <option value="">Select notice period</option>
                          <option value="immediate">Immediate</option>
                          <option value="2 weeks">2 Weeks</option>
                          <option value="1 month">1 Month</option>
                          <option value="3 months">3 Months</option>
                        </select>
                      </div>
                    </div>

                    {/* Expected Salary */}
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Expected Salary
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          name="jobPreferences.expectedSalary.min"
                          value={
                            formData.jobPreferences?.expectedSalary?.min || ""
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Min"
                          min="0"
                          step="1000"
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                        />
                        <input
                          type="number"
                          name="jobPreferences.expectedSalary.max"
                          value={
                            formData.jobPreferences?.expectedSalary?.max || ""
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Max"
                          min="0"
                          step="1000"
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                        />
                        <select
                          name="jobPreferences.expectedSalary.currency"
                          value={
                            formData.jobPreferences?.expectedSalary?.currency ||
                            "INR"
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                        >
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Locations */}
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Preferred Locations (comma separated)
                      </label>
                      <input
                        type="text"
                        value={preferredLocationsInput}
                        onChange={handlePreferredLocationsChange}
                        disabled={!isEditing}
                        placeholder="e.g. Mumbai, Bangalore, Remote"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                      />
                    </div>
                  </section>

                  {/* Social Links */}
                  <section>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                      Social Links
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-5 h-5 text-slate-400" />
                        <input
                          type="url"
                          name="socialLinks.linkedin"
                          value={formData.socialLinks?.linkedin || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="LinkedIn URL"
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Github className="w-5 h-5 text-slate-400" />
                        <input
                          type="url"
                          name="socialLinks.github"
                          value={formData.socialLinks?.github || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="GitHub URL"
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Twitter className="w-5 h-5 text-slate-400" />
                        <input
                          type="url"
                          name="socialLinks.twitter"
                          value={formData.socialLinks?.twitter || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Twitter URL"
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <input
                          type="url"
                          name="socialLinks.portfolio"
                          value={formData.socialLinks?.portfolio || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Portfolio URL"
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {isEditing && profile && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleSaveChanges}
              disabled={loading || isCreatingProfile}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isCreatingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
