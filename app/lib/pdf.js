const puppeteer = require( 'puppeteer' );

async function get( url, options = {} ) {
    if ( !url ) {
        throw new Error( 'No url provided' );
    }
    console.log( 'url to pdf', url );
    console.time( 'pdf generation' );
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    options.format = options.format || 'A4';
    options.margin = options.margin || '0.5in';
    options.landscape = options.landscape || false;
    options.scale = options.scale || 1;

    await page.goto( url, { waitUntil: 'networkidle0' } ).catch( errorHandler );
    console.log( 'went to page' );
    await page.waitForSelector( 'form.or', { visible: true } );
    console.log( 'waited for form.or' );
    //await page.waitForNavigation();
    //console.log( 'waited for navigation' ).catch( errorHandler );
    const pdf = await page.pdf( {
            landscape: options.landscape,
            format: options.format,
            margin: {
                top: options.margin,
                left: options.margin,
                right: options.margin,
                bottom: options.margin
            },
            scale: options.scale
        } )
        .catch( errorHandler );
    console.log( 'waited for pdf ' )

    await browser.close().catch( errorHandler );
    console.log( 'browser closed' );
    console.timeEnd( 'pdf generation' );
    return pdf;
}

function errorHandler( error ) {
    throw error;
}

module.exports = { get };
