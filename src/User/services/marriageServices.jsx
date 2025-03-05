// src/services/marriageService.js
import api from "../../utils/api";

/**
 * Service for marriage-related API calls
 */
export const marriageService = {
  /**
   * Get all marriages for admin/shaykh
   * @param {Object} filters - Optional filters (type, status)
   * @returns {Promise} - API response
   */
  getAllMarriages: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append("type", filters.type);
    if (filters.status) queryParams.append("status", filters.status);

    const queryString = queryParams.toString();
    return await api.get(`/marriages${queryString ? `?${queryString}` : ""}`);
  },

  /**
   * Get user's marriages
   * @returns {Promise} - API response
   */
  getUserMarriages: async () => {
    return await api.get("/marriages/my-marriages");
  },

  /**
   * Get shaykh's assigned marriages
   * @returns {Promise} - API response
   */
  getShaykhAssignments: async () => {
    return await api.get("/marriages/my-assignments");
  },

  /**
   * Get a single marriage by ID
   * @param {string} id - Marriage ID
   * @returns {Promise} - API response
   */
  getMarriage: async (id) => {
    return await api.get(`/marriages/${id}`);
  },

  /**
   * Create a marriage reservation request
   * @param {Object} data - Reservation data
   * @returns {Promise} - API response
   */
  createReservation: async (data) => {
    return await api.post("/marriages/reservation", data);
  },

  /**
   * Create a marriage certificate request
   * @param {Object} data - Certificate data
   * @returns {Promise} - API response
   */
  createCertificate: async (data) => {
    return await api.post("/marriages/certificate", data);
  },

  /**
   * Assign a marriage to a shaykh
   * @param {string} id - Marriage ID
   * @param {string} shaykhId - Shaykh ID
   * @returns {Promise} - API response
   */
  assignMarriage: async (id, shaykhId) => {
    return await api.put(`/marriages/assign/${id}`, { shaykhId });
  },

  /**
   * Add a meeting to a marriage reservation
   * @param {string} id - Marriage ID
   * @param {Object} meetingData - Meeting data
   * @returns {Promise} - API response
   */
  addMeeting: async (id, meetingData) => {
    return await api.post(`/marriages/meetings/${id}`, meetingData);
  },

  /**
   * Update a meeting
   * @param {string} id - Marriage ID
   * @param {string} meetingId - Meeting ID
   * @param {Object} meetingData - Updated meeting data
   * @returns {Promise} - API response
   */
  updateMeeting: async (id, meetingId, meetingData) => {
    return await api.put(`/marriages/meetings/${id}/${meetingId}`, meetingData);
  },

  /**
   * Upload a certificate file
   * @param {string} id - Marriage ID
   * @param {FormData} formData - Form data with certificate file and certificate number
   * @returns {Promise} - API response
   */
  uploadCertificate: async (id, formData) => {
    // Let API handle the FormData correctly through the interceptor
    return await api.put(`/marriages/upload-certificate/${id}`, formData);
  },
  /**
   * Get certificate download URL
   * @param {string} id - Marriage ID
   * @returns {Promise} - API response
   */
  getCertificateUrl: async (id) => {
    return await api.get(`/marriages/certificate-url/${id}`);
  },

  /**
   * Complete a marriage request
   * @param {string} id - Marriage ID
   * @param {Object} data - Completion data
   * @returns {Promise} - API response
   */
  completeMarriage: async (id, data = {}) => {
    return await api.put(`/marriages/complete/${id}`, data);
  },

  /**
   * Add feedback to a marriage request
   * @param {string} id - Marriage ID
   * @param {string} comment - Feedback comment
   * @returns {Promise} - API response
   */
  addFeedback: async (id, comment) => {
    return await api.post(`/marriages/feedback/${id}`, { comment });
  },

  /**
   * Cancel a marriage request
   * @param {string} id - Marriage ID
   * @param {Object} data - Cancellation data
   * @returns {Promise} - API response
   */
  cancelMarriage: async (id, data = {}) => {
    return await api.put(`/marriages/cancel/${id}`, data);
  },
};

export default marriageService;
