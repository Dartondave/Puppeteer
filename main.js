const puppeteer = require('puppeteer');

(async () => {
  // --- Configuration & Session Data ---
  // Replace these with your actual values from your Kiwi session:
  const miniAppUrl = 'https://telegram.geagle.online/#' +
    'tgWebAppData=query_id=AAG8XExdAAAAALxcTF1zhgzq&' +
    'tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%8774e1%22%2C%22button_color%22%3A%22%8774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%230f0f0f%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%8774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%23aaaaaa%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23e53935%22%7D&' +
    'tgWebAppVersion=8.0&' +
    'tgWebAppPlatform=ios';

  // Session storage values from your Kiwi session:
  const sessionStorageData = {
    'tapps/launchParams': "tgWebAppPlatform=ios&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%8774e1%22%2C%22button_color%22%3A%22%8774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%230f0f0f%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%8774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%23aaaaaa%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23e53935%22%7D&tgWebAppVersion=8.0&tgWebAppData=query_id%3DAAG8XExdAAAAALxcTF1zhgzq%26user%3D%257B%2522id%2522%253A1565285564%252C%2522first_name%2522%253A%2522%E6%B0%94DARTON%E4%B9%88%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522DartonTV%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D",
    '__telegram__initParams': '{"tgWebAppData":"query_id=AAG8XExdAAAAALxcTF1zhgzq&user=%7B%22id%22%3A1565285564%2C%22first_name%22%3A%22%E6%B0%94DARTON%E4%B9%88%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22DartonTV%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue,"auth_date":1741389374,"signature":"8_obGK64Ts2BWyYkaPTQN9hCIdjAexbPRha6eehBq20jpO8EsSdaKErPaUMVj9KDtn0bQoAoD7wqvrAa6-PjCQ","hash":"ec90ad9785bdb020b6f0a097f080ddebda0df736caf3018ed7e8f2c628084179"}',
    '__telegram__themeParams': '{"bg_color":"#212121","text_color":"#ffffff","hint_color":"#aaaaaa","link_color":"#8774e1","button_color":"#8774e1","button_text_color":"#ffffff","secondary_bg_color":"#0f0f0f","header_bg_color":"#212121","accent_text_color":"#8774e1","section_bg_color":"#212121","section_header_text_color":"#aaaaaa","subtitle_text_color":"#aaaaaa","destructive_text_color":"#e53935"}'
  };

  // Cookies for telegram.geagle.online from your Kiwi session:
  // Replace these with the exact cookie names and values you exported from Kiwi.
  const cookies = [
    { name: 'GS1', value: '1741388302.1.0.1741388303.0.0.0', domain: 'telegram.geagle.online', path: '/' },
    { name: 'GA1', value: '718832270.1741388302', domain: 'telegram.geagle.online', path: '/' }
  ];

  // --- Puppeteer Setup with Mobile Emulation ---
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  const page = await browser.newPage();
  await page.emulate({
    viewport: {
      width: 360,
      height: 640,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    },
    userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36"
  });

  // --- Navigate to the Domain to Set Cookies ---
  await page.goto('https://telegram.geagle.online', { waitUntil: 'networkidle2' });
  for (const cookie of cookies) {
    await page.setCookie(cookie);
  }
  console.log('[+] Cookies injected.');

  // --- Navigate to the Mini-App URL ---
  await page.goto(miniAppUrl, { waitUntil: 'networkidle2' });
  console.log('[+] Mini-app URL loaded.');

  // --- Inject Session Storage Data ---
  for (const [key, value] of Object.entries(sessionStorageData)) {
    await page.evaluate((k, v) => { sessionStorage.setItem(k, v); }, key, value);
  }
  console.log('[+] Session storage values injected.');

  // --- Reload the Page to Let Session Data Take Effect ---
  await page.reload({ waitUntil: 'networkidle2' });
  console.log('[+] Page reloaded with session storage data.');

  // --- Inject External Telegram JS (if not auto-loaded) ---
  await page.addScriptTag({ url: 'https://telegram.geagle.online/assets/index-BC9KxTS7.js' });
  console.log('[+] External JS injected.');
  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds for initialization

  // --- Locate the Coin Element ---
  // Use the actual class provided in your Kiwi session:
  const coinSelector = 'div._tapArea_njdmz_15';
  try {
    await page.waitForSelector(coinSelector, { timeout: 30000 });
    console.log('[+] Coin element found using selector:', coinSelector);
  } catch (err) {
    console.error("[-] Could not find coin element using selector:", coinSelector, err);
    await page.screenshot({ path: 'debug_coin.png' });
    const pageContent = await page.content();
    console.log(pageContent.slice(0, 2000));
    await browser.close();
    process.exit(1);
  }

  // --- Function to Simulate a Genuine Tap ---
  async function simulateTap() {
    await page.click(coinSelector);
  }

  // --- Loop: Batch Tapping (200 taps per batch), then wait 3 minutes ---
  const batchTaps = 200;
  const waitBetweenBatches = 180000; // 3 minutes in milliseconds
  const cycles = 3; // Adjust number of cycles as needed

  for (let cycle = 1; cycle <= cycles; cycle++) {
    console.log(`[+] Starting cycle ${cycle}: Sending ${batchTaps} taps.`);
    for (let i = 0; i < batchTaps; i++) {
      await simulateTap();
      await new Promise(resolve => setTimeout(resolve, 50)); // 50 ms delay between taps
    }
    console.log(`[+] Cycle ${cycle} complete. Sleeping for ${waitBetweenBatches / 60000} minutes...`);
    await new Promise(resolve => setTimeout(resolve, waitBetweenBatches));
  }

  console.log('[+] Finished all cycles.');
  await browser.close();
})();
