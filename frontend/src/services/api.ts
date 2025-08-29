// services/api.ts
const API_BASE_URL = 'http://localhost:3000';

// Export for use in components that need to construct file URLs
export const getFileUrl = (filePath: string, fileType: 'cours' | 'memoires' | 'programmes' = 'cours') => {
  // Normalize the file path (replace backslashes with forward slashes)
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Debug logging (only in development)
  const isDebug = process.env.NODE_ENV === 'development';
  if (isDebug) {
    console.log('getFileUrl - Input:', filePath);
    console.log('getFileUrl - Normalized:', normalizedPath);
  }
  
  // If the filePath already includes the upload directory, use it as is
  if (normalizedPath.startsWith('upload/')) {
    const result = `${API_BASE_URL}/${normalizedPath}`;
    if (isDebug) console.log('getFileUrl - Full path detected, result:', result);
    return result;
  }
  
  // Otherwise, construct the full path
  const result = `${API_BASE_URL}/upload/${fileType}/${normalizedPath}`;
  if (isDebug) console.log('getFileUrl - Filename only detected, result:', result);
  return result;
};

interface ApiResponse<T = any> {
  data?: T;
  error?: any;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {};

    // Ne pas définir Content-Type pour FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Ajouter les headers personnalisés
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data };
      }

      return { data };
    } catch (error) {
      return { error };
    }
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<ApiResponse<{ role: string; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async signup(username: string, password: string, role: string): Promise<ApiResponse> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/auth/password', {
      method: 'POST',
      body: JSON.stringify({ userId, oldPassword, newPassword }),
    });
  }

  // Password recovery endpoints
  async initiatePasswordReset(email: string): Promise<ApiResponse> {
    return this.request('/auth/password-reset/initiate', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async confirmPasswordReset(resetToken: string, newPassword: string, accountId: number): Promise<ApiResponse> {
    return this.request('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword, accountId }),
    });
  }

  // Session management endpoints
  async validateSession(): Promise<ApiResponse> {
    return this.request('/auth/validate-session');
  }

  async refreshToken(): Promise<ApiResponse> {
    return this.request('/auth/refresh-token', {
      method: 'POST',
    });
  }

  // User profile endpoints
  async getUserProfile(): Promise<ApiResponse> {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData: any): Promise<ApiResponse> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Cours endpoints
  async getAllCours(): Promise<ApiResponse> {
    return this.request('/cours');
  }

  async getCoursByEnseignant(id_enseignant: string): Promise<ApiResponse> {
    return this.request(`/cours/enseignant/${id_enseignant}`);
  }

  async createCours(coursData: any): Promise<ApiResponse> {
    return this.request('/cours', {
      method: 'POST',
      body: JSON.stringify(coursData),
    });
  }

  async createCoursWithFile(formData: FormData): Promise<ApiResponse> {
    return this.request('/cours/upload', {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type pour FormData, il sera automatiquement défini
    });
  }

  async updateCours(id_cours: number, coursData: any): Promise<ApiResponse> {
    return this.request(`/cours/${id_cours}`, {
      method: 'PUT',
      body: JSON.stringify(coursData),
    });
  }

  async deleteCours(id_cours: number): Promise<ApiResponse> {
    return this.request(`/cours/${id_cours}`, {
      method: 'DELETE',
    });
  }

  async getCoursEnAttenteByEnseignant(id_enseignant: string): Promise<ApiResponse> {
    return this.request(`/cours/enseignant/${id_enseignant}/en-attente`);
  }

  async getCoursApprouvesByEnseignant(id_enseignant: string): Promise<ApiResponse> {
    return this.request(`/cours/enseignant/${id_enseignant}/approuves`);
  }

  async exporterCours(id_cours: number): Promise<ApiResponse> {
    return this.request(`/cours/${id_cours}/exporter`, {
      method: 'POST',
    });
  }

  async getCoursById(id_cours: number): Promise<ApiResponse> {
    return this.request(`/cours/${id_cours}`);
  }

  async getCoursByStagiaire(id_stagiaire: string): Promise<ApiResponse> {
    return this.request(`/cours/stagiaire/${id_stagiaire}`);
  }

  // Memoire endpoints
  async getMemoiresByStagiaire(id_stagiaire: string): Promise<ApiResponse> {
    return this.request(`/memoire/stagiaire/${id_stagiaire}`);
  }

  async getMemoiresByEnseignant(id_enseignant: string): Promise<ApiResponse> {
    return this.request(`/memoire/enseignant/${id_enseignant}`);
  }

  async createMemoire(memoireData: any): Promise<ApiResponse> {
    return this.request('/memoire', {
      method: 'POST',
      body: JSON.stringify(memoireData),
    });
  }

  async updateMemoire(id_memoire: string, memoireData: any): Promise<ApiResponse> {
    return this.request(`/memoire/${id_memoire}`, {
      method: 'PUT',
      body: JSON.stringify(memoireData),
    });
  }

  async deleteMemoire(id_memoire: string): Promise<ApiResponse> {
    return this.request(`/memoire/${id_memoire}`, {
      method: 'DELETE',
    });
  }

  async updateMemoireStatus(id_memoire: string, status: string): Promise<ApiResponse> {
    return this.request(`/memoire/${id_memoire}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAllMemoires(): Promise<ApiResponse> {
    return this.request('/memoire');
  }

  async getMemoiresByOffre(id_offre: string): Promise<ApiResponse> {
    return this.request(`/memoire/offre/${id_offre}`);
  }

  async getMemoiresCollaboratifsByStagiaire(id_stagiaire: string): Promise<ApiResponse> {
    return this.request(`/memoire/collaboratifs/${id_stagiaire}`);
  }

  async updateMemoireWithFile(id_memoire: string, formData: FormData): Promise<ApiResponse> {
    return this.request(`/memoire/${id_memoire}/upload`, {
      method: 'PUT',
      body: formData,
      // Ne pas définir Content-Type pour FormData, il sera automatiquement défini
    });
  }

  // Programme endpoints
  async getAllProgrammes(): Promise<ApiResponse> {
    return this.request('/programme');
  }

  async getProgrammesByEnseignant(id_enseignant: string): Promise<ApiResponse> {
    return this.request(`/programme/enseignant/${id_enseignant}`);
  }

  async createProgramme(programmeData: any): Promise<ApiResponse> {
    return this.request('/programme', {
      method: 'POST',
      body: JSON.stringify(programmeData),
    });
  }

  async updateProgramme(id_programme: number, programmeData: any): Promise<ApiResponse> {
    return this.request(`/programme/${id_programme}`, {
      method: 'PUT',
      body: JSON.stringify(programmeData),
    });
  }

  async deleteProgramme(id_programme: number): Promise<ApiResponse> {
    return this.request(`/programme/${id_programme}`, {
      method: 'DELETE',
    });
  }

  // Module endpoints
  async getModulesByEnseignant(id_enseignant: string): Promise<ApiResponse> {
    return this.request(`/module/enseignant/${id_enseignant}`);
  }

  // Offre endpoints
  async getAllOffres(): Promise<ApiResponse> {
    return this.request('/offre');
  }

  async getOffresByEtablissement(id_etab_formation: number): Promise<ApiResponse> {
    return this.request(`/offre/etablissement/${id_etab_formation}`);
  }

  async createOffre(offreData: any): Promise<ApiResponse> {
    return this.request('/offre', {
      method: 'POST',
      body: JSON.stringify(offreData),
    });
  }

  async updateOffre(id_offre: number, offreData: any): Promise<ApiResponse> {
    return this.request(`/offre/${id_offre}`, {
      method: 'PUT',
      body: JSON.stringify(offreData),
    });
  }

  async deleteOffre(id_offre: number): Promise<ApiResponse> {
    return this.request(`/offre/${id_offre}`, {
      method: 'DELETE',
    });
  }

  // Inscription endpoints
  async getInscriptionsByStagiaire(id_stagiaire: string): Promise<ApiResponse> {
    return this.request(`/inscription/stagiaire/${id_stagiaire}`);
  }

  async createInscription(id_stagiaire: string, id_offre: number): Promise<ApiResponse> {
    return this.request('/inscription', {
      method: 'POST',
      body: JSON.stringify({ id_stagiaire, id_offre }),
    });
  }

  async updateInscriptionStatus(id_inscription: number, statut: string): Promise<ApiResponse> {
    return this.request(`/inscription/${id_inscription}/status`, {
      method: 'PUT',
      body: JSON.stringify({ statut }),
    });
  }

  async deleteInscription(id_inscription: number): Promise<ApiResponse> {
    return this.request(`/inscription/${id_inscription}`, {
      method: 'DELETE',
    });
  }

  // Etablissement management endpoints
  async getEtablissementStats(): Promise<ApiResponse> {
    return this.request('/etablissement/stats');
  }

  async getEnseignantsByEtablissement(id_etab_formation: number, search?: string, limit?: number, offset?: number): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const endpoint = `/etablissement/${id_etab_formation}/enseignants${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getStagiairesByEtablissement(id_etab_formation: number, search?: string, limit?: number, offset?: number): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const endpoint = `/etablissement/${id_etab_formation}/stagiaires${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async createEnseignantByEtablissement(enseignantData: any): Promise<ApiResponse> {
    return this.request('/etablissement/enseignants', {
      method: 'POST',
      body: JSON.stringify(enseignantData),
    });
  }

  async createStagiaireByEtablissement(stagiaireData: any): Promise<ApiResponse> {
    return this.request('/etablissement/stagiaires', {
      method: 'POST',
      body: JSON.stringify(stagiaireData),
    });
  }

  // New methods for managing existing users
  async getAllExistingEnseignants(search?: string, limit?: number, offset?: number): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const endpoint = `/etablissement/all-enseignants${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getAllExistingStagiaires(search?: string, limit?: number, offset?: number): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const endpoint = `/etablissement/all-stagiaires${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async createAccountForEnseignant(id_enseignant: number, username: string, password: string): Promise<ApiResponse> {
    return this.request(`/etablissement/enseignants/${id_enseignant}/create-account`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async createAccountForStagiaire(id_stagiaire: number, username: string, password: string): Promise<ApiResponse> {
    return this.request(`/etablissement/stagiaires/${id_stagiaire}/create-account`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async updateEnseignantByEtablissement(id_enseignant: number, enseignantData: any): Promise<ApiResponse> {
    return this.request(`/etablissement/enseignants/${id_enseignant}`, {
      method: 'PUT',
      body: JSON.stringify(enseignantData),
    });
  }

  async updateStagiaireByEtablissement(id_stagiaire: number, stagiaireData: any): Promise<ApiResponse> {
    return this.request(`/etablissement/stagiaires/${id_stagiaire}`, {
      method: 'PUT',
      body: JSON.stringify(stagiaireData),
    });
  }

  // Inscription management for establishments
  async getInscriptionsByEtablissement(status?: string, search?: string, limit?: number, offset?: number): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const endpoint = `/etablissement/inscriptions${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async updateInscriptionStatusByEtablissement(id_inscription: number, statut: string, observation?: string): Promise<ApiResponse> {
    return this.request(`/etablissement/inscriptions/${id_inscription}/status`, {
      method: 'PUT',
      body: JSON.stringify({ statut, observation }),
    });
  }

  async bulkUpdateInscriptionsStatus(inscription_ids: number[], statut: string, observation?: string): Promise<ApiResponse> {
    return this.request('/etablissement/inscriptions/bulk-status', {
      method: 'PUT',
      body: JSON.stringify({ inscription_ids, statut, observation }),
    });
  }

  // Memoire management for establishments
  async getMemoiresByEtablissement(search?: string, limit?: number, offset?: number): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const endpoint = `/etablissement/memoires${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async assignMemoireToEnseignant(id_memoire: number, id_enseignant: number): Promise<ApiResponse> {
    return this.request(`/etablissement/memoires/${id_memoire}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ id_enseignant }),
    });
  }

  async updateMemoireStatusByEtablissement(id_memoire: number, statut: string): Promise<ApiResponse> {
    return this.request(`/etablissement/memoires/${id_memoire}/status`, {
      method: 'PUT',
      body: JSON.stringify({ statut }),
    });
  }

  // Grade management
  async getAllGrades(): Promise<ApiResponse> {
    return this.request('/grades');
  }

  // Specialite management
  async getAllSpecialites(): Promise<ApiResponse> {
    return this.request('/specialites');
  }

  // Diplome management
  async getAllDiplomes(): Promise<ApiResponse> {
    return this.request('/diplomes');
  }

  // Mode Formation management
  async getAllModeFormations(): Promise<ApiResponse> {
    return this.request('/mode-formations');
  }

  // ==============================================
  // DETAILED MEMOIRE MANAGEMENT WORKFLOW METHODS
  // ==============================================

  // 1. ESTABLISHMENT: Assign stagiaire to enseignant
  async assignStagiaireToEnseignant(data: { id_stagiaire: number; id_enseignant: number }) {
    return this.request('/memoire/assign', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // 2. STAGIAIRE: Get their memoire (single)
  async getMemoireByStagiaire(id_stagiaire: number) {
    return this.request(`/memoire/stagiaire-single/${id_stagiaire}`);
  }

  // 3. STAGIAIRE: Update their memoire with file upload
  async updateMemoireByStagiaire(id_stagiaire: number, data: {
    titre_fr?: string;
    titre_ar?: string;
    fichierpdf?: File;
  }) {
    const formData = new FormData();
    if (data.titre_fr) formData.append('titre_fr', data.titre_fr);
    if (data.titre_ar) formData.append('titre_ar', data.titre_ar);
    if (data.fichierpdf) formData.append('fichierpdf', data.fichierpdf);

    return this.request(`/memoire/stagiaire-update/${id_stagiaire}`, {
      method: 'PUT',
      body: formData,
      // Note: Don't set Content-Type for FormData, it will be set automatically
    });
  }

  // 4. ENSEIGNANT: Get memoires to validate
  async getMemoiresToValidateByEnseignant(id_enseignant: number) {
    return this.request(`/memoire/enseignant-validate/${id_enseignant}`);
  }

  // 5. ENSEIGNANT: Validate or reject memoire
  async validateMemoireByEnseignant(id_memoire: number, data: {
    status: 'مقبول' | 'مرفوض';
    observation?: string;
  }) {
    return this.request(`/memoire/validate/${id_memoire}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // 6. STAGIAIRE: Get accepted memoires from colleagues
  async getAcceptedMemoiresByOffers(id_stagiaire: number) {
    return this.request(`/memoire/colleagues/${id_stagiaire}`);
  }
}

export const apiService = new ApiService();
