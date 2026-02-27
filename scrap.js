const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://maszt.org';
const visitedLinks = new Set();
const linksToVisit = [baseUrl];
const filesToDownload = new Set();
const allData = [];

const downloadDir = path.join(__dirname, 'pobrane_pliki');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}

// Funkcja do automatycznego scrollowania strony (wymusza ładowanie leniwych elementów)
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100); // Szybkość scrollowania
        });
    });
}

async function downloadFile(fileUrl) {
    try {
        const fileName = path.basename(new URL(fileUrl).pathname);
        const filePath = path.join(downloadDir, fileName);
        
        if (fs.existsSync(filePath)) {
            return filePath; // Już pobrano
        }

        console.log(`⬇️ Pobieram plik: ${fileName}`);
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ Błąd przy pobieraniu pliku ${fileUrl}:`, error.message);
        return null;
    }
}

async function runScraper() {
    console.log('🤖 Odpalam prawdziwą przeglądarkę (Puppeteer)...');
    
    // Uruchamiamy przeglądarkę
    const browser = await puppeteer.launch({ 
        headless: "new", // "new" to nowy standard dla niewidocznego Chrome
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    
    // Ustawiamy udawany User-Agent, żeby strona myślała, że jesteśmy zwykłym użytkownikiem
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    while (linksToVisit.length > 0) {
        const currentUrl = linksToVisit.shift();

        if (visitedLinks.has(currentUrl)) continue;
        visitedLinks.add(currentUrl);

        console.log(`⏳ Odwiedzam: ${currentUrl} (W kolejce: ${linksToVisit.length})`);

        try {
            // Wchodzimy na stronę i CZEKAMY, aż przestanie ładować pliki w tle (networkidle2)
            await page.goto(currentUrl, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Scrollujemy na sam dół
            await autoScroll(page);
            
            // Dajemy stronie jeszcze 2 sekundy na "odetchnięcie" i wyrenderowanie JS
            await new Promise(r => setTimeout(r, 2000));

            // Zbieramy dane wykonując kod bezpośrednio w przeglądarce!
            const pageData = await page.evaluate((baseUrl) => {
                const tytul = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : document.title;
                
                // Próbujemy złapać główną treść, omijając nagłówek i stopkę
                let trescElement = document.querySelector('main, article, .entry-content, .page-content');
                let tresc = trescElement ? trescElement.innerText.trim() : document.body.innerText.trim();
                
                // Zbieramy WSZYSTKIE linki ze strony
                const znalezioneLinki = [];
                const znalezionePliki = [];
                
                document.querySelectorAll('a').forEach(a => {
                    let href = a.getAttribute('href');
                    if (href) {
                        if (href.startsWith('/')) href = baseUrl + href; // Naprawa linków względnych
                        
                        // Czasami linki w menu prowadzą do starego adresu wordpress, zamieniamy go na właściwy
                        href = href.replace('https://naczynskim.wordpress.com', baseUrl);
                        
                        const cleanHref = href.split('#')[0].split('?')[0]; // Usuwamy kotwice i parametry
                        
                        if (cleanHref.startsWith(baseUrl)) {
                            if (cleanHref.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip)$/i)) {
                                znalezionePliki.push(cleanHref);
                            } else if (!cleanHref.match(/\.(jpg|jpeg|png|gif)$/i)) { // Ignorujemy obrazki
                                znalezioneLinki.push(cleanHref);
                            }
                        }
                    }
                });

                return { tytul, tresc, znalezioneLinki, znalezionePliki };
            }, baseUrl);

            // Zapisujemy treść (jeśli jest sensowna)
            if (pageData.tytul && pageData.tresc.length > 50) {
                const podstrona = {
                    url: currentUrl,
                    tytul: pageData.tytul,
                    tresc: pageData.tresc.replace(/\n+/g, '\n').trim(), // Czyścimy puste linie
                    pliki: []
                };
                
                // Pobieramy pliki ze strony
                for (const plikUrl of pageData.znalezionePliki) {
                    if (!filesToDownload.has(plikUrl)) {
                        filesToDownload.add(plikUrl);
                        const filePath = await downloadFile(plikUrl);
                        if (filePath) {
                            podstrona.pliki.push({
                                url: plikUrl,
                                lokalnaSciezka: filePath
                            });
                        }
                    }
                }
                
                allData.push(podstrona);
            }

            // Dodajemy nowe linki do kolejki
            pageData.znalezioneLinki.forEach(link => {
                if (!visitedLinks.has(link) && !linksToVisit.includes(link)) {
                    linksToVisit.push(link);
                }
            });

        } catch (error) {
            console.error(`❌ Błąd przy ${currentUrl}:`, error.message);
        }
    }

    await browser.close();

    await browser.close();

    fs.writeFileSync('dane_z_puppeteera.json', JSON.stringify(allData, null, 2), 'utf-8');
    console.log(`\n🎉 Sukces! Zapisano ${allData.length} podstron do pliku dane_z_puppeteera.json`);
    console.log(`📂 Pobrane pliki (${filesToDownload.size}) znajdziesz w folderze: ${downloadDir}`);
}

runScraper();