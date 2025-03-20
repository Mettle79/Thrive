# Get current date and time for backup folder name
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFolder = "escape_room_backup_$timestamp"

# Create backup directory
New-Item -ItemType Directory -Path $backupFolder

# Copy essential files and directories
Copy-Item -Path "src" -Destination $backupFolder -Recurse
Copy-Item -Path "public" -Destination $backupFolder -Recurse
Copy-Item -Path "package.json" -Destination $backupFolder
Copy-Item -Path "package-lock.json" -Destination $backupFolder
Copy-Item -Path "tailwind.config.ts" -Destination $backupFolder
Copy-Item -Path "components.json" -Destination $backupFolder
Copy-Item -Path "tsconfig.json" -Destination $backupFolder
Copy-Item -Path "next.config.ts" -Destination $backupFolder
Copy-Item -Path "next-env.d.ts" -Destination $backupFolder
Copy-Item -Path "postcss.config.mjs" -Destination $backupFolder
Copy-Item -Path "README.md" -Destination $backupFolder
Copy-Item -Path ".gitignore" -Destination $backupFolder

# Create a backup info file
$backupInfo = @"
Backup Information:
------------------
Date: $(Get-Date)
Project: Escape Room App
Backup Location: $backupFolder
Contents:
- src/ (source code)
- public/ (static assets)
- Configuration files
- Dependencies list (package.json)

To restore:
1. Copy all files to a new directory
2. Run 'npm install' to install dependencies
3. Run 'npm run dev' to start the development server
"@

$backupInfo | Out-File -FilePath "$backupFolder/README.txt"

Write-Host "Backup completed successfully in folder: $backupFolder" 