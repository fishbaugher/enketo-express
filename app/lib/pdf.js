const puppeteer = require( 'puppeteer' );
const { URL } = require( 'url' );
const FORMAT = 'A4';
const MARGIN = '0.5in';
const LANDSCAPE = false;
const SCALE = 1;

async function get( url, options = {} ) {
    if ( !url ) {
        throw new Error( 'No url provided' );
    }
    console.time( 'total pdf' );
    const browser = await puppeteer.launch( { headless: true } );
    const page = await browser.newPage();

    options.format = options.format || FORMAT;
    options.margin = options.margin || MARGIN;
    options.landscape = options.landscape || LANDSCAPE;
    options.scale = options.scale || SCALE;

    const urlObj = new URL( url );
    urlObj.searchParams.append( 'format', options.format );
    urlObj.searchParams.append( 'margin', options.margin );
    urlObj.searchParams.append( 'landscape', options.landscape );
    urlObj.searchParams.append( 'scale', options.scale );

    console.log( 'url to pdf', urlObj.href );
    console.time( 'page load' );
    await page.goto( urlObj.href, { waitUntil: 'networkidle0' } );
    await page.waitForFunction( 'window.printReady === true', { polling: 200 } );
    console.timeEnd( 'page load' );
    console.time( 'pdf generation' );
    const pdf = page.pdf( {
        landscape: options.landscape,
        format: options.format,
        margin: {
            top: options.margin,
            left: options.margin,
            right: options.margin,
            bottom: options.margin
        },
        scale: options.scale
    } );
    await pdf;
    console.timeEnd( 'pdf generation' );
    await browser.close();
    console.log( 'browser closed' );
    console.timeEnd( 'total pdf' );
    return pdf;
}

module.exports = { get };
