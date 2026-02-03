
$API_TOKEN = 'Qea9nvTMlaxN5YAXlfAyTbvlBttTbEzcA5qbFiIo3Mh5Dw28Z5vGPcq4CFwi'
$BASE_URL = 'https://api.invictuspay.app.br/api'
$ProductHash = "az2lxhbw24"
$AMOUNTS = @(100000, 300000) # 1000.00 and 3000.00

Write-Host "--- Recreating Offers (1000 & 3000) ---"

$NewHashes = @{}
$Headers = @{ 'Accept'='application/json'; 'Content-Type'='application/json' }

foreach ($Amount in $AMOUNTS) {
    $AmountBRL = $Amount / 100
    Write-Host "Creating offer for R$ $AmountBRL..."
    
    $Uri = "$BASE_URL/public/v1/products/$ProductHash/offers?api_token=$API_TOKEN"
    
    $OfferBody = @{
        title = "Pacote Premium $AmountBRL"
        amount = $Amount
        price = $Amount
        cover = "https://ui-avatars.com/api/?name=Pacote&background=random&size=512"
    }
    $BodyJson = $OfferBody | ConvertTo-Json -Depth 10
    
    try {
        $Offer = Invoke-RestMethod -Uri $Uri -Method 'POST' -Headers $Headers -Body $BodyJson
        
        $OfferHash = ""
        if ($Offer.hash) { $OfferHash = $Offer.hash }
        elseif ($Offer.data.hash) { $OfferHash = $Offer.data.hash }
        
        if ($OfferHash) {
            Write-Host "  -> Success: $OfferHash"
            $NewHashes["$AmountBRL"] = $OfferHash
        } else {
            Write-Error "  -> Failed: $($Offer | ConvertTo-Json -Depth 5)"
        }
    } catch {
         Write-Error "  -> Failed Request: $_"
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n--- NEW HASHES ---"
$NewHashes | ConvertTo-Json
