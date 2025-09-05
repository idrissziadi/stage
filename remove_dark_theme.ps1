# Script PowerShell pour supprimer toutes les classes dark: des fichiers TypeScript/TSX
$files = Get-ChildItem -Path "frontend/src" -Recurse -Include "*.tsx", "*.ts" | Where-Object { $_.Name -notlike "*node_modules*" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "dark:") {
        Write-Host "Processing: $($file.FullName)"
        
        # Supprimer les classes dark: avec regex
        $newContent = $content -replace '\s*dark:[^\s]+', ''
        
        # Nettoyer les espaces multiples
        $newContent = $newContent -replace '\s+', ' '
        
        # Écrire le contenu modifié
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Dark theme removal completed!"
