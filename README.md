# Ringleader Docker

https://hub.docker.com/r/hallaby/ringleader
Docker image to run puppeteer scripts through iExec.

## Testing

Make a directory called `tmp`. Inside, place a file called `test.js`. Set the environment variables `IEXEC_INPUT_FILES_FOLDER` and `IEXEC_INPUT_FILE_NAME_1` to `tmp` and `test.js` respectively.

### Docker

Testing on docker can be done by running `docker build . --tag ringleader` and `docker run -v /tmp:/iexec_in -v /tmp:/iexec_out -e IEXEC_INPUT_FILES_FOLDER=/iexec_in -e IEXEC_OUT=/iexec_out -e IEXEC_INPUT_FILE_NAME_1=test.js ringleader` if you place your `test.js` script in `/tmp`. The output file will be placed there as well.

## Publishing and Running

### Docker

* `docker login`
* `docker build . --tag ringleader`
* `docker tag ringleader hallaby/ringleader:1.0.0`
* `docker push hallaby/ringleader:1.0.0`

### iExec

See here for more help: https://docs.iex.ec/for-developers/quick-start-for-developers

* `npm i -g iexec` (install iexec cli)
* `cd` to a directory you want to store iExec files in. This will not be the same as the directory you make your project in. It will reference your project through Docker Hub.
* `iexec wallet create` (install a wallet for iExec if you don't have one already)
* Get some test Ethereum here: https://goerli-faucet.slock.it/.
* `iexec wallet show --chain goerli` (check wallet funds using the goerli test net)
* `iexec storage init --chain goerli`
* `iexec account show --chain goerli` (you can publish to `mainnet` if you don't want to use the goerli test chain)
* `iexec app init` (init app)
* Make sure the name, multiaddr, and checksum are correct in the `iexec.json` file (https://docs.iex.ec/for-developers/your-first-app#deploy-your-app-on-iexec).
* `iexec app deploy --chain goerli` (deploy app to the goerli blockchain)
* `iexec app show --chain goerli` (view your app)
* `iexec wallet getRLC --chain goerli` (get RLC tokens to run your app)
* `iexec account deposit 200 --chain goerli` (place RLC tokens from your wallet into your account - this is necessary to run)
* `iexec app run --input-files=<url to javascript> --watch --chain goerli` (run the app from public code)
* `iexec app run --dataset=<dataset address> --watch --chain goerli` (use a confidential dataset to run - note: dataset will take precendence over input files)
    * To learn how to upload a dataset to the blockchain which can then be used by iExec, see here: https://docs.iex.ec/for-developers/confidential-computing/sgx-encrypted-dataset
    * To learn how to encrypt the result, see here: https://docs.iex.ec/for-developers/confidential-computing/end-to-end-encryption

## Known Issues

* The application should be trusted (https://docs.iex.ec/for-developers/confidential-computing/create-your-first-sgx-app), but Scone's images do not yet support fork calls (https://sconedocs.github.io/Nodejs/) which is required for Puppeteer to launch Chromium.