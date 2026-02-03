
$API_TOKEN = 'Qea9nvTMlaxN5YAXlfAyTbvlBttTbEzcA5qbFiIo3Mh5Dw28Z5vGPcq4CFwi'
$BASE_URL = 'https://api.invictuspay.app.br/api'
$AMOUNTS = @(3000, 5000, 10000, 20000, 30000, 50000, 100000, 300000)

function Invoke-InvictusRequest {
    param (
        [string]$Method,
        [string]$Path,
        [hashtable]$Body = $null
    )

    $Uri = "${BASE_URL}${Path}"
    if ($Uri.IndexOf('?') -ne -1) {
        $Uri = "$Uri&api_token=$API_TOKEN"
    } else {
        $Uri = "$Uri?api_token=$API_TOKEN"
    }

    Write-Host "Requesting ($Method): $Uri"

    $Headers = @{
        'Accept' = 'application/json'
        'Content-Type' = 'application/json'
    }

    $Params = @{
        Uri = $Uri
        Method = $Method
        Headers = $Headers
    }

    if ($Body) {
        $Params.Body = ($Body | ConvertTo-Json -Depth 10)
    }

    try {
        $Response = Invoke-RestMethod @Params
        return $Response
    } catch {
        Write-Error "Request failed: $_"
        return $null
    }
}

Write-Host "--- Starting Invictus Setup (Fixed) ---"

# 1. Get or Create Product
Write-Host "Checking products..."
$ProductsRes = Invoke-InvictusRequest -Method 'GET' -Path '/public/v1/products'

$ProductHash = ""
if ($ProductsRes.data) {
    $ExistingProduct = $ProductsRes.data | Where-Object { $_.title -eq 'Doação' }
}

if ($ExistingProduct) {
    Write-Host "Found existing product: $($ExistingProduct.title) ($($ExistingProduct.hash))"
    $ProductHash = $ExistingProduct.hash
} else {
    Write-Host "Creating new product..."
    $NewProductBody = @{
        title = "Doação"
        payment_type = 1
        product_type = "digital"
        delivery_type = 2
        id_category = 1
        amount = 1000
        sale_page = "https://institutosmaosdobem.com"
        cover = "https://institutosmaosdobem.com/public/images/logo.svg"
    }
    $NewProduct = Invoke-InvictusRequest -Method 'POST' -Path '/public/v1/products' -Body $NewProductBody
    
    if ($NewProduct.hash) {
        $ProductHash = $NewProduct.hash
    } elseif ($NewProduct.data.hash) {
        $ProductHash = $NewProduct.data.hash
    } else {
        Write-Error "Failed to create product. Response: $($NewProduct | ConvertTo-Json -Depth 5)"
        exit
    }
    Write-Host "Created product: $ProductHash"
}

# 2. Create Offers
$OffersMap = @{}

foreach ($Amount in $AMOUNTS) {
    $AmountBRL = $Amount / 100
    Write-Host "Creating offer for R$ $AmountBRL..."
    
    $OfferBody = @{
        title = "Doação R$ $AmountBRL"
        amount = $Amount
        cover = "https://institutosmaosdobem.com/public/images/logo.svg"
    }
    
    $Offer = Invoke-InvictusRequest -Method 'POST' -Path "/public/v1/products/$ProductHash/offers" -Body $OfferBody
    
    $OfferHash = ""
    if ($Offer.hash) { $OfferHash = $Offer.hash }
    elseif ($Offer.data.hash) { $OfferHash = $Offer.data.hash }
    
    if ($OfferHash) {
        Write-Host "  -> Success: $OfferHash"
        $OffersMap["$AmountBRL"] = $OfferHash
    } else {
        Write-Error "  -> Failed: $($Offer | ConvertTo-Json -Depth 5)"
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
