import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserPlus, 
  BookOpen, 
  Users, 
  Settings,
  BarChart3
} from 'lucide-react';
import StagiaireCreation from './StagiaireCreation';
import StagiaireList from './StagiaireList';
import InscriptionManagement from './InscriptionManagement';

const StagiaireManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('creation');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestion Complète des Stagiaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Interface complète pour la gestion des stagiaires, incluant la création, 
            l'inscription aux offres de formation et la gestion des comptes utilisateurs.
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="creation" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Création
          </TabsTrigger>
          <TabsTrigger value="liste" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="inscriptions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Inscriptions
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creation" className="space-y-4">
          <StagiaireCreation />
        </TabsContent>

        <TabsContent value="liste" className="space-y-4">
          <StagiaireList />
        </TabsContent>

        <TabsContent value="inscriptions" className="space-y-4">
          <InscriptionManagement />
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tableau de Bord des Stagiaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border">
                  <div className="text-3xl font-bold text-blue-600">📊</div>
                  <div className="text-sm text-blue-600 mt-2">Vue d'ensemble</div>
                  <div className="text-xs text-blue-500 mt-1">
                    Statistiques complètes
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg border">
                  <div className="text-3xl font-bold text-green-600">✅</div>
                  <div className="text-sm text-green-600 mt-2">Gestion efficace</div>
                  <div className="text-xs text-green-500 mt-1">
                    Interface intuitive
                  </div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg border">
                  <div className="text-3xl font-bold text-purple-600">🔒</div>
                  <div className="text-sm text-purple-600 mt-2">Sécurité</div>
                  <div className="text-xs text-purple-500 mt-1">
                    Authentification
                  </div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg border">
                  <div className="text-3xl font-bold text-orange-600">📈</div>
                  <div className="text-sm text-orange-600 mt-2">Performance</div>
                  <div className="text-xs text-orange-500 mt-1">
                    Optimisé
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Fonctionnalités disponibles :</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Création de stagiaires (simple, avec compte, avec inscription)</li>
                  <li>✅ Gestion des comptes utilisateurs</li>
                  <li>✅ Inscription aux offres de formation</li>
                  <li>✅ Inscription en masse</li>
                  <li>✅ Recherche et filtrage avancés</li>
                  <li>✅ Export des données</li>
                  <li>✅ Statistiques en temps réel</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StagiaireManagement;
