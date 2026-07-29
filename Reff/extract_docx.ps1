param($docxPath, $outPath)

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry("word/document.xml")

if ($entry) {
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xml = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()

    # Simple regex to replace <w:p ...> with newline, and strip all other tags
    $text = $xml -replace '<w:p[^\>]*>', "`n" -replace '<[^>]+>', ""
    
    # Write text to output
    Add-Content -Path $outPath -Value "=== $docxPath ==="
    Add-Content -Path $outPath -Value $text
    Add-Content -Path $outPath -Value "`n"
}

$zip.Dispose()
