/**
 * Ringleader Docker App.
 * Simple app to run a puppeteer script on docker with IExec.
 */

const puppeteer = require("puppeteer");

const fs = require('fs');

// https://docs.iex.ec/for-developers/your-first-app
const IEXEC_OUT = process.env.IEXEC_OUT;
const IEXEC_IN = process.env.IEXEC_INPUT_FILES_FOLDER; //process.env.IEXEC_IN;
// It would be nice to support datasets so confidential information could be included in the job.
const IEXEC_INPUT_FILE = process.env.DATASET_FILENAME ? process.env.DATASET_FILENAME : process.env.IEXEC_INPUT_FILE_NAME_1;

/**
 * Main script to run.
 */
async function run() {

    console.log("running job...");

    // make sure we have our necessary input
    if( !IEXEC_IN ) {
        console.log( "no iexec input folder" );
        return;
    }
    if( !IEXEC_OUT ) {
        console.log( "no iexec output folder" );
        return;
    }
    if( !IEXEC_INPUT_FILE ) {
        console.log( "no iexec input file" );
        return;
    }
    let inputFile = IEXEC_IN + "/" + IEXEC_INPUT_FILE;

    // run the script that's been given to us.
    try {
        console.log("opening browser");

        let browser = await puppeteer.launch({
            headless:true,
            args:[
                "--no-sandbox"]
        });
        let page = await browser.newPage();
        let inputContents = fs.readFileSync(inputFile).toString();

        // note, the callback function will not have access to any of the variables that it is within
        await page.exposeFunction("ringleaderNewPage", function(url, callback) {
            // this needs to be async so that the ringleaderNewPage function can resolve on the page before navigation.
            setTimeout( function() { page.goto(url).then( function() {
                page.evaluate("("+callback+")()");
            }) }, 50 );
        });
        await page.exposeFunction("ringleaderSave", function(value, file) {
            fs.writeFileSync( IEXEC_OUT + "/" + file, value );
        });
        await page.exposeFunction("ringleaderLoad", function(file) {
            return fs.readFileSync( IEXEC_OUT + "/" + file ).toString();
        } );
        await page.exposeFunction("ringleaderFinish", function() {
            browser.close();
        });

        console.log("running script");
        await page.evaluate(inputContents);
    }
    catch(err) {
        console.log(err);
        console.log("could not execute input file");
        process.exit();
    }

    console.log("finished");

}

run();