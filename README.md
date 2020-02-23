# Node.js PSD2 API showcase

## ING
### Used resources
This application makes use of the sandbox environment of ING's PSD2 API's.  
For access, the following OAuth 2.0 client ID is provided: ```5ca1ab1e-c0ca-c01a-cafe-154deadbea75```

ING also provided example certificates for signing the requests.  
These can be found in the ```certs``` folder.

### Documentation
Only the specific requests defined for the Sandbox API can be queried. At first I was deceived by the fact that the test profile selection screen shows multiple accounts. This showcase makes sure you always call the correct URLs.

If you want to call Account Information (AIS) API endpoints other than the ones in this demo you can have a look at the AIS documentation [here](https://developer.ing.com/static/AIS.pdf).