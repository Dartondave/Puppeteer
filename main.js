const puppeteer = require('puppeteer');

(async () => {
  // --- Configuration & Session Data ---
  // Replace these with your actual values from your Kiwi session:
  const miniAppUrl = 'https://telegram.geagle.online/#tgWebAppData=query_id=AAG8XExdAAAAALxcTF2ALyef&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22secondary_bg_color%22%3A%22%23181818%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%238774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%238774e1%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23ff595a%22%7D&tgWebAppVersion=7.10&tgWebAppPlatform=ios';

  // Session storage values from Kiwi
  const sessionStorageData = {
    'tapps/launchParams': "tgWebAppPlatform=ios&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22secondary_bg_color%22%3A%22%23181818%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%238774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%238774e1%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23ff595a%22%7D&tgWebAppVersion=7.10&tgWebAppData=query_id%3DAAG8XExdAAAAALxcTF2ALyef%26user%3D%257B%2522id%2522%253A1565285564%252C%2522first_name%2522%253A%2522%E6%B0%94DARTON%E4%B9%88%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522DartonTV%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D",
    '__telegram__initParams': '{"tgWebAppData":"query_id=AAG8XExdAAAAALxcTF2ALyef&user=%7B%22id%22%3A1565285564%2C%22first_name%22%3A%22%E6%B0%94DARTON%E4%B9%88%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22DartonTV%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D","auth_date":1741132592,"signature":"sGfdIFxIBcKtqrq2y6zzeUQNkypsglVlaN_LT8s1bp9EbnZVaNiSS7KapQx0llxh0IIjsx926e4oxpOyTPn5DA","hash":"970af2cd5d4ce4b680996870cf21e9762f1d387f096cf9eb1b58366724741d42"}',
    '__telegram__themeParams': '{"bg_color":"#212121","button_color":"#8774e1","button_text_color":"#ffffff","hint_color":"#aaaaaa","link_color":"#8774e1","secondary_bg_color":"#181818","text_color":"#ffffff","header_bg_color":"#212121","accent_text_color":"#8774e1","section_bg_color":"#212121","section_header_text_color":"#8774e1","subtitle_text_color":"#aaaaaa","destructive_text_color":"#ff595a"}'
  };

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

  // Emulate a mobile device
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

  // Optionally, set extra headers if your tap requests need the Bearer token
  // For example:
  // await page.setExtraHTTPHeaders({
  //   'Authorization': `Bearer YOUR_BEARER_TOKEN`
  // });

  // --- Navigate to the Mini-App URL ---
  await page.goto(miniAppUrl, { waitUntil: 'networkidle2' });
  console.log('[+] Mini-app URL loaded.');

  // --- Inject Session Storage Data ---
  for (const [key, value] of Object.entries(sessionStorageData)) {
    await page.evaluate(
      (k, v) => sessionStorage.setItem(k, v),
      key,
      value
    );
  }
  console.log('[+] Session storage values injected.');

  // --- Reload the page to let the injected data take effect ---
  await page.reload({ waitUntil: 'networkidle2' });
  console.log('[+] Page reloaded with session storage data.');

  // --- Ensure External JS is Loaded ---
  // (If the page doesn't load the external JS automatically, you can inject it.)
  await page.addScriptTag({ url: 'https://telegram.geagle.online/assets/index-BC9KxTS7.js' });
  console.log('[+] External JS injected.');
  await page.waitForTimeout(5000); // wait 5 seconds for initialization

  // --- Locate the Coin Element ---
  // Based on your Kiwi session, the coin element should be visible.
  // Adjust the selector if needed (here we search for an element whose style includes "gold-eagle-coin.svg")
  const coinSelector = "[style*='gold-eagle-coin.svg']";
  await page.waitForSelector(coinSelector, { timeout: 30000 }).catch(async err => {
    console.error("[-] Could not find coin element:", err);
    await page.screenshot({ path: 'debug_coin.png' });
    const pageContent = await page.content();
    console.log(pageContent.slice(0, 2000));
    await browser.close();
    process.exit(1);
  });
  console.log('[+] Coin element found.');

  // --- Function to Simulate a Genuine Tap ---
  async function simulateTap() {
    // Using page.click will dispatch a genuine click event
    await page.click(coinSelector);
  }

  // --- Loop: Batch of 200 taps then wait 3 minutes, repeat for a number of cycles ---
  const batchTaps = 200;
  const waitBetweenBatches = 180000; // 3 minutes in milliseconds
  const cycles = 3; // Adjust cycles as needed

  for (let cycle = 1; cycle <= cycles; cycle++) {
    console.log(`[+] Starting cycle ${cycle}: Sending ${batchTaps} taps.`);
    for (let i = 0; i < batchTaps; i++) {
      await simulateTap();
      await page.waitForTimeout(50); // small delay between taps
    }
    console.log(`[+] Cycle ${cycle} complete. Sleeping for ${waitBetweenBatches / 60000} minutes...`);
    await page.waitForTimeout(waitBetweenBatches);
  }

  console.log('[+] Finished all cycles.');
  await browser.close();
})();
