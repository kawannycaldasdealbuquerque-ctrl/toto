
const https = require('https');

const API_TOKEN = 'Qea9nvTMlaxN5YAXlfAyTbvlBttTbEzcA5qbFiIo3Mh5Dw28Z5vGPcq4CFwi';
const BASE_URL = 'api.invictuspay.app.br';

const AMOUNTS = [3000, 5000, 10000, 20000, 30000, 50000, 100000, 300000]; // In cents

function request(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: BASE_URL,
            path: `/api${path}${path.includes('?') ? '&' : '?'}api_token=${API_TOKEN}`,
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } catch (e) {
                    console.error('Error parsing response:', body);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function main() {
    console.log('--- Starting Invictus Setup ---');

    // 1. Get or Create Product
    console.log('Checking products...');
    const productsRes = await request('GET', '/public/v1/products');
    let productHash = '';
    
    // Check if 'Doação' product already exists
    const existingProduct = productsRes.data ? productsRes.data.find(p => p.title === 'Doação') : null;

    if (existingProduct) {
        console.log(`Found existing product: ${existingProduct.title} (${existingProduct.hash})`);
        productHash = existingProduct.hash;
    } else {
        console.log('Creating new product...');
        const newProduct = await request('POST', '/public/v1/products', {
            title: "Doação",
            payment_type: 1, // Single payment
            product_type: "digital", 
            delivery_type: 2, // External
            id_category: 1, // Assuming category 1 exists or is default, might need to fetch categories if this fails
            amount: 1000 // Default amount (not used for offers but required)
        });
        
        if (newProduct.hash) {
            productHash = newProduct.hash;
            console.log(`Created product: ${productHash}`);
        } else if (newProduct.data && newProduct.data.hash) { 
             productHash = newProduct.data.hash;
             console.log(`Created product: ${productHash}`);
        } else {
            console.error('Failed to create product:', JSON.stringify(newProduct));
            // Try getting categories to see if 1 is valid if it failed
            const cats = await request('GET', '/public/v1/products/categories');
            console.log('Available categories:', JSON.stringify(cats));
            return;
        }
    }

    // 2. Create Offers for each amount
    const offersMap = {};
    
    for (const amount of AMOUNTS) {
        console.log(`Creating offer for R$ ${amount / 100}...`);
        const offer = await request('POST', `/public/v1/products/${productHash}/offers`, {
            title: `Doação R$ ${amount / 100}`,
            amount: amount
        });

        let offerHash = '';
        if (offer.hash) offerHash = offer.hash;
        else if (offer.data && offer.data.hash) offerHash = offer.data.hash;
        
        if (offerHash) {
            console.log(`  -> Success: ${offerHash}`);
            offersMap[amount / 100] = offerHash;
        } else {
            console.error(`  -> Failed:`, JSON.stringify(offer));
        }
        
        // Small delay to avoid rate limits if any
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n--- SETUP COMPLETE ---');
    console.log('Product Hash:', productHash);
    console.log('Offers Map (JSON):');
    console.log(JSON.stringify({
        product_hash: productHash,
        offers: offersMap
    }, null, 2));
}

main().catch(console.error);
