export interface Module {
  id_module: number;
  code_module: string;
  designation_fr: string;
  designation_ar: string;
  credit?: number;
  volume_horaire?: number;
  semestre?: number;
  annee?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  specialite?: {
    id_specialite: number;
    designation_fr: string;
    designation_ar: string;
    code_specialite: string;
  };
}
