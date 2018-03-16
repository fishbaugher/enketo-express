const puppeteer = require( 'puppeteer' );

async function get( url ) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto( 'https://enke.to/::widgets', { waitUntil: 'networkidle0' } ).catch( errorHandler );
    console.log( 'went to page' );
    await page.waitForSelector( 'form.or', { visible: true } );
    console.log( 'waited for form.or' );
    //await page.waitForNavigation();
    //console.log( 'waited for navigation' ).catch( errorHandler );
    await page.pdf( { path: 'enketo.pdf', format: 'A4', margin: { top: '0.5in', left: '0.5in', right: '0.5in', bottom: '0.5in' } } ).catch( errorHandler );
    console.log( 'waited for pdf ' )

    await browser.close().catch( errorHandler );
    console.log( 'browser closed' );
}

function errorHandler( error ) {
    return error.message;
}

module.exports = { get };
