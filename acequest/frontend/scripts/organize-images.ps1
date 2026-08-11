# Organize image assets from `src/assets/image` into `src/assets/images` with standardized names
$repoRoot = Split-Path -Parent $PSScriptRoot
$assetsPath = Join-Path $repoRoot "src\assets"
$src = Join-Path $assetsPath "image"
$dest = Join-Path $assetsPath "images"

if (-not (Test-Path $src)) {
    Write-Error "Source folder not found: $src"
    exit 1
}

# Create destination root
New-Item -Path $dest -ItemType Directory -Force | Out-Null

# Category keywords (order matters: first match wins)
$categories = @{
    "portraits" = @("portrait","portarit","portait")
    "logos" = @("logo")
    "maps" = @("map","world map","realm","tileset","tileset-academy","fishing zone","evacuation route")
    "icons" = @("icon")
    "tilesets" = @("tileset")
    "npc" = @("npc","mission giver","mission-giver","missiongiver","villager","merchant","mayor","settler","old settler","checkpoint")
    "bosses" = @("boss","lord","titan","colossus")
    "sprites" = @("sprite")
    "effects" = @("attack","effect","wrong","correct","hint","lava","burst","flow","quake","tsunami","siren","attack earthqquake")
    "diagrams" = @("diagram","formula","pyramid","board","gauge","diagram")
    "crystals" = @("crystal")
    "backgrounds" = @("empty","dried","broken","old","ancient","harbour","village","town","city","slum","sea","shore")
    "maps_misc" = @("realm","world")
}

# Helper: normalize base filename (no extension)
function Normalize-BaseName($name) {
    $s = $name.ToLower()
    $s = $s -replace '&', 'and'
    # replace non-alphanumeric sequences with single hyphen
    $s = $s -replace '[^a-z0-9]+', '-'
    $s = $s.Trim('-')
    return $s
}

# Helper: ensure unique destination path
function Get-UniquePath($path) {
    if (-not (Test-Path $path)) { return $path }
    $dir = Split-Path $path -Parent
    $base = [IO.Path]::GetFileNameWithoutExtension($path)
    $ext = [IO.Path]::GetExtension($path)
    $i = 1
    do {
        $candidate = Join-Path $dir ("{0}-{1}{2}" -f $base, $i, $ext)
        $i++
    } while (Test-Path $candidate)
    return $candidate
}

# Process files recursively
Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
    $orig = $_.FullName
    $base = [IO.Path]::GetFileNameWithoutExtension($_.Name)
    $ext = $_.Extension.ToLower()
    $norm = Normalize-BaseName($base)

    # Choose category
    $assigned = $null
    foreach ($cat in $categories.Keys) {
        foreach ($kw in $categories[$cat]) {
            if ($norm -like "*" + ($kw -replace '[^a-z0-9\-]','') + "*") {
                $assigned = $cat
                break
            }
        }
        if ($assigned) { break }
    }
    if (-not $assigned) { $assigned = 'misc' }

    $targetDir = Join-Path $dest $assigned
    New-Item -Path $targetDir -ItemType Directory -Force | Out-Null

    $newName = $norm + $ext
    $targetPath = Join-Path $targetDir $newName
    $targetPath = Get-UniquePath $targetPath

    try {
        Move-Item -Path $orig -Destination $targetPath -Force
        Write-Host "Moved:`t$orig -> $targetPath"
    } catch {
        Write-Warning "Failed to move $orig : $_"
    }
}

Write-Host "Image organization complete. Destination: $dest"