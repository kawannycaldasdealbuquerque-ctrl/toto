
$API_TOKEN = 'Qea9nvTMlaxN5YAXlfAyTbvlBttTbEzcA5qbFiIo3Mh5Dw28Z5vGPcq4CFwi'
$BASE_URL = 'https://api.invictuspay.app.br/api'
$AMOUNTS = @(3000, 5000, 10000, 20000, 30000, 50000, 100000, 300000)
$ProductHash = "az2lxhbw24" #  Product Hash

Write-Host "--- Starting Invictus Setup (Linear - Retry Offers) ---"
Write-Host "Token: $API_TOKEN"
Write-Host "Product: $ProductHash"

$Headers = @{
    'Accept' = 'application/json'
    'Content-Type' = 'application/json'
}

# 2. Create Offers
$OffersMap = @{}

foreach ($Amount in $AMOUNTS) {
    $AmountBRL = $Amount / 100
    Write-Host "Creating offer for R$ $AmountBRL..."
    
    $Uri = "$BASE_URL/public/v1/products/$ProductHash/offers?api_token=$API_TOKEN"
    
    # Sending BOTH amount and price to be safe, as error said 'price'
    $OfferBody = @{
        title = "Doação R$ $AmountBRL"
        amount = $Amount
        price = $Amount 
        cover = "https://institutosmaosdobem.com/public/images/logo.svg"
    }
    $BodyJson = $OfferBody | ConvertTo-Json -Depth 10
    
    try {
        $Offer = Invoke-RestMethod -Uri $Uri -Method 'POST' -Headers $Headers -Body $BodyJson
        
        $OfferHash = ""
        if ($Offer.hash) { $OfferHash = $Offer.hash }
        elseif ($Offer.data.hash) { $OfferHash = $Offer.data.hash }
        
        if ($OfferHash) {
            Write-Host "  -> Success: $OfferHash"
            $OffersMap["$AmountBRL"] = $OfferHash
        } else {
            Write-Error "  -> Failed: $($Offer | ConvertTo-Json -Depth 5)"
        }
    } catch {
         Write-Error "  -> Failed Request: $_"
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n--- SETUP COMPLETE ---"
$Result = @{
    product_hash = $ProductHash
    offers = $OffersMap
}

$Result | ConvertTo-Json -Depth 5 | Out-File -FilePath "invictus_config.json" -Encoding utf8
Write-Host "Config saved to invictus_config.json"
Get-Content "invictus_config.json"
