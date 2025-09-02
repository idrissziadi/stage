@echo off
echo ========================================
echo   Demarrage de l'implementation OffreModule (AMELIORE)
echo ========================================
echo.

echo 1. Verification de l'implementation...
node verify-implementation.js

echo.
echo 2. Verification des contraintes avant peuplement...
echo    Appuyez sur une touche pour continuer...
pause >nul
node verify-constraints.js

echo.
echo 3. Creation de la table OffreModule...
echo    (Executez manuellement: psql -d votre_base -f create-offre-module-table.sql)
echo    Appuyez sur une touche apres avoir cree la table...
pause >nul

echo.
echo 4. Peuplement de la table avec validation des contraintes...
echo    Appuyez sur une touche pour continuer...
pause >nul
node populate-offre-module.js

echo.
echo 5. Test de la fonctionnalite...
echo    Appuyez sur une touche pour continuer...
pause >nul
node test-offre-module.js

echo.
echo ========================================
echo   Implementation terminee avec validation !
echo ========================================
echo.
echo Prochaines etapes:
echo - Tester l'onglet "دروسي" pour un stagiaire
echo - Verifier que seuls les modules des offres sont visibles
echo - Consulter le guide GUIDE_OFFRE_MODULE.md
echo.
echo Fichiers crees:
echo - verify-constraints.js (nouveau)
echo - populate-offre-module.js (ameliore)
echo - test-offre-module.js
echo.
pause
