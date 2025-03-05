// src/services/shaykhService.js
import api from "../../utils/api";

/**
 * Service for Shaykh-related API calls
 */
export const shaykhService = {
  /**
   * Add a new shaykh to the system
   * @param {Object} shaykhData - The shaykh data to add
   * @returns {Promise} - The API response
   */
  addShaykh: async (shaykhData) => {
    return await api.post("/admin/shaykhs", shaykhData);
  },

  /**
   * Get all shaykhs in the system
   * @returns {Promise} - The API response with array of shaykhs
   */
  getAllShaykhs: async () => {
    return await api.get("/admin/shaykhs");
  },

  /**
   * Delete a shaykh by ID
   * @param {string} id - The ID of the shaykh to delete
   * @returns {Promise} - The API response
   */
  deleteShaykh: async (id) => {
    return await api.delete(`/admin/shaykhs/${id}`);
  },
};

export default shaykhService;
