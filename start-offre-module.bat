@echo off
echo ========================================
echo   Demarrage de l'implementation OffreModule
echo ========================================
echo.

echo 1. Verification de l'implementation...
node verify-implementation.js

echo.
echo 2. Creation de la table OffreModule...
echo    (Executez manuellement: psql -d votre_base -f create-offre-module-table.sql)

echo.
echo 3. Peuplement de la table...
echo    Appuyez sur une touche pour continuer...
pause >nul
node populate-offre-module.js

echo.
echo 4. Test de la fonctionnalite...
echo    Appuyez sur une touche pour continuer...
pause >nul
node test-offre-module.js

echo.
echo ========================================
echo   Implementation terminee !
echo ========================================
echo.
echo Prochaines etapes:
echo - Tester l'onglet "دروسي" pour un stagiaire
echo - Verifier que seuls les modules des offres sont visibles
echo - Consulter le guide GUIDE_OFFRE_MODULE.md
echo.
pause
