
$API_TOKEN = 'Qea9nvTMlaxN5YAXlfAyTbvlBttTbEzcA5qbFiIo3Mh5Dw28Z5vGPcq4CFwi'
$BASE_URL = 'https://api.invictuspay.app.br/api'
$AMOUNTS = @(30, 50, 100, 200, 300, 500, 1000, 3000)

function Invoke-InvictusRequest {
    param (
        [string]$Method,
        [string]$Path,
        [hashtable]$Body = $null
    )

    $Uri = "${BASE_URL}${Path}?api_token=${API_TOKEN}"
    Write-Host "DEBUG: Requesting ($Method): $Uri"

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
        if ($_.Exception.Response) {
            $Reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $ErrorBody = $Reader.ReadToEnd()
            Write-Error "Error Body: $ErrorBody"
        }
        return $null
    }
}

Write-Host "--- Starting PREMIUM Setup ---"

# 1. Get or Create Product
Write-Host "Checking products..."
$ProductsRes = Invoke-InvictusRequest -Method 'GET' -Path '/public/v1/products'

$ProductHash = ""
if ($ProductsRes.data) {
    $ExistingProduct = $ProductsRes.data | Where-Object { $_.title -eq 'PREMIUM' }
}

if ($ExistingProduct) {
    Write-Host "Found existing product: $($ExistingProduct.title) ($($ExistingProduct.hash))"
    $ProductHash = $ExistingProduct.hash
} else {
    Write-Host "Creating new product 'PREMIUM'..."
    $NewProductBody = @{
        title = "PREMIUM"
        payment_type = 1
        product_type = "digital"
        delivery_type = 2
        id_category = 1
        amount = 3000 # R$ 30,00 min
        sale_page = "https://institutosmaosdobem.com"
        cover = "https://institutosmaosdobem.com/images/logo.svg"
    }
    $NewProduct = Invoke-InvictusRequest -Method 'POST' -Path '/public/v1/products' -Body $NewProductBody
    
    if ($NewProduct.hash) {
        $ProductHash = $NewProduct.hash
    } elseif ($NewProduct.data.hash) {
        $ProductHash = $NewProduct.data.hash
    } else {
        Write-Error "Failed to create product."
        exit
    }
    Write-Host "Created product: $ProductHash"
}

# 2. Create Offers
$OffersMap = @{}

foreach ($Value in $AMOUNTS) {
    $Amount = $Value * 100
    Write-Host "Creating offer for R$ $Value..."
    
    $OfferBody = @{
        title = "PREMIUM R$ $Value"
        amount = $Amount
        price = $Amount
        cover = "https://institutosmaosdobem.com/images/logo.svg"
    }
    
    $Offer = Invoke-InvictusRequest -Method 'POST' -Path "/public/v1/products/$ProductHash/offers" -Body $OfferBody
    
    $OfferHash = ""
    if ($Offer.hash) { $OfferHash = $Offer.hash }
    elseif ($Offer.data.hash) { $OfferHash = $Offer.data.hash }
    
    if ($OfferHash) {
        Write-Host "  -> Success: $OfferHash"
        $OffersMap["$Value"] = $OfferHash
    } else {
        Write-Error "  -> Failed offer creation for $Value."
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
