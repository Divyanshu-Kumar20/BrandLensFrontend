import axiosInstance from './axios';
import { mockApi } from './mock';

export const isMockMode = () => import.meta.env.VITE_USE_MOCK === 'true';

export const api = {
  // Health check
  async getHealth() {
    if (isMockMode()) {
      return mockApi.getHealth();
    }
    return axiosInstance.get('/health');
  },

  // Auth
  async loginDemo(role) {
    if (isMockMode()) {
      return mockApi.loginDemo(role);
    }
    return axiosInstance.post('/auth/demo', { role });
  },

  async login(email, password) {
    if (isMockMode()) {
      return mockApi.login(email, password);
    }
    return axiosInstance.post('/auth/login', { email, password });
  },

  async getMe() {
    if (isMockMode()) {
      const token = localStorage.getItem('brandlens_token');
      return mockApi.getMe(token);
    }
    return axiosInstance.get('/auth/me');
  },

  // Knowledge: Clauses
  async getClauses() {
    if (isMockMode()) return mockApi.getClauses();
    return axiosInstance.get('/knowledge/clauses');
  },
  async createClause(payload) {
    if (isMockMode()) return mockApi.createClause(payload);
    return axiosInstance.post('/knowledge/clauses', payload);
  },
  async updateClause(id, payload) {
    if (isMockMode()) return mockApi.updateClause(id, payload);
    return axiosInstance.put(`/knowledge/clauses/${id}`, payload);
  },
  async deleteClause(id) {
    if (isMockMode()) return mockApi.deleteClause(id);
    return axiosInstance.delete(`/knowledge/clauses/${id}`);
  },

  // Knowledge: Facts
  async getFacts() {
    if (isMockMode()) return mockApi.getFacts();
    return axiosInstance.get('/knowledge/facts');
  },
  async createFact(payload) {
    if (isMockMode()) return mockApi.createFact(payload);
    return axiosInstance.post('/knowledge/facts', payload);
  },
  async updateFact(id, payload) {
    if (isMockMode()) return mockApi.updateFact(id, payload);
    return axiosInstance.put(`/knowledge/facts/${id}`, payload);
  },
  async deleteFact(id) {
    if (isMockMode()) return mockApi.deleteFact(id);
    return axiosInstance.delete(`/knowledge/facts/${id}`);
  },

  // Knowledge: Terms
  async getTerms() {
    if (isMockMode()) return mockApi.getTerms();
    return axiosInstance.get('/knowledge/terms');
  },
  async createTerm(payload) {
    if (isMockMode()) return mockApi.createTerm(payload);
    return axiosInstance.post('/knowledge/terms', payload);
  },
  async updateTerm(id, payload) {
    if (isMockMode()) return mockApi.updateTerm(id, payload);
    return axiosInstance.put(`/knowledge/terms/${id}`, payload);
  },
  async deleteTerm(id) {
    if (isMockMode()) return mockApi.deleteTerm(id);
    return axiosInstance.delete(`/knowledge/terms/${id}`);
  },

  // Org Settings
  async updateOrgSettings(payload) {
    if (isMockMode()) return mockApi.updateOrgSettings(payload);
    return axiosInstance.patch('/org/settings', payload);
  },

  // Content
  async getContentList(status) {
    if (isMockMode()) return mockApi.getContentList(status);
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return axiosInstance.get(`/content${query}`);
  },

  async getContentById(id) {
    if (isMockMode()) return mockApi.getContentById(id);
    return axiosInstance.get(`/content/${id}`);
  },

  async createContent(payload) {
    if (isMockMode()) return mockApi.createContent(payload);
    return axiosInstance.post('/content', payload);
  },

  async createVersion(contentId, payload) {
    if (isMockMode()) return mockApi.createVersion(contentId, payload);
    return axiosInstance.post(`/content/${contentId}/versions`, payload);
  },

  async reviewContent(contentId, payload) {
    if (isMockMode()) return mockApi.reviewContent(contentId, payload);
    return axiosInstance.post(`/content/${contentId}/review`, payload);
  },

  async getVersionFindings(contentId, versionNumber) {
    if (isMockMode()) return mockApi.getVersionFindings(contentId, versionNumber);
    return axiosInstance.get(`/content/${contentId}/versions/${versionNumber}/findings`);
  },

  async patchFinding(findingId, payload) {
    if (isMockMode()) return mockApi.patchFinding(findingId, payload);
    return axiosInstance.patch(`/findings/${findingId}`, payload);
  },

  async submitContent(contentId) {
    if (isMockMode()) return mockApi.submitContent(contentId);
    return axiosInstance.post(`/content/${contentId}/submit`);
  },

  async approveContent(contentId, payload) {
    if (isMockMode()) return mockApi.approveContent(contentId, payload);
    return axiosInstance.post(`/content/${contentId}/approve`, payload);
  },

  // Comments
  async getComments(contentId) {
    if (isMockMode()) return mockApi.getComments(contentId);
    return axiosInstance.get(`/content/${contentId}/comments`);
  },

  async addComment(contentId, payload) {
    if (isMockMode()) return mockApi.addComment(contentId, payload);
    return axiosInstance.post(`/content/${contentId}/comments`, payload);
  },

  // Audit
  async getAudit(contentId) {
    if (isMockMode()) return mockApi.getAudit(contentId);
    return axiosInstance.get(`/content/${contentId}/audit`);
  },

  // Insights
  async getInsightsSummary() {
    if (isMockMode()) return mockApi.getInsightsSummary();
    return axiosInstance.get('/insights/summary');
  },

  // Reset seed
  async resetSeed() {
    if (isMockMode()) return mockApi.resetSeed();
    return axiosInstance.post('/dev/reset-seed');
  },
};

export default api;
