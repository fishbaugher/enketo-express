const puppeteer = require( 'puppeteer' );
const FORMAT = 'A4';
const MARGIN = '0.5in';
const LANDSCAPE = false;
const SCALE = 1;

async function get( url, options = {} ) {
    if ( !url ) {
        throw new Error( 'No url provided' );
    }
    console.log( 'url to pdf', url );
    console.time( 'total pdf' );
    const browser = await puppeteer.launch( { headless: true } );
    const page = await browser.newPage();

    options.format = options.format || FORMAT;
    options.margin = options.margin || MARGIN;
    options.landscape = options.landscape || LANDSCAPE;
    options.scale = options.scale || SCALE;
    console.time( 'page load' );
    await page.goto( url, { waitUntil: 'networkidle0' } ); //.catch( errorHandler );

    await page.waitForSelector( 'form.or', { visible: true } );
    //await page.waitForFunction( 'window.readyForPrinting === true', { polling: 200 } );
    console.timeEnd( 'page load' );
    //console.log( 'waited for form.or' );
    //await page.waitForNavigation();
    //console.log( 'waited for navigation' ).catch( errorHandler );
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
    //.catch( errorHandler );

    await pdf;
    console.timeEnd( 'pdf generation' );
    await browser.close(); //.catch( errorHandler );
    console.log( 'browser closed' );
    console.timeEnd( 'total pdf' );
    return pdf;
}

module.exports = { get };
