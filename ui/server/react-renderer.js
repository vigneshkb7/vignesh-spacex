const React = require('react')
const renderToString = require('react-dom/server').renderToString;
const matchPath = require('react-router').matchPath;
const { StaticRouter } = require('react-router-dom');
const serialize =require('serialize-javascript')
const path = require('path');
const fs = require('fs');



/**
 * Import our main App component
 * Remember it's exported as ES6 module, so to require it, you must call .default
 */
const App = require('../src/App').default;

exports = module.exports;

exports.render = (routes) => {
  return (req, res, next) => {
      
    /**
     * Take routes collection and see if it's a valid app's route
     */
    var match = routes.find(route => matchPath(req.path, {
      path: route,
      exact: true,
    }));

    const is404 = req._possible404;
    
    if (match || is404) {
      /**
       * Point to the html file created by CRA's build tool and open it
       */
      const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

      fs.readFile(filePath, 'utf8', (err, htmlData) => {        
        if (err) {
          console.error('err', err);
          return res.status(404).end(); // WARNING: This 404 will be handled by Express server and won't be your React 404 component.
        }

       
        

        if (is404) {
          /**
           * Set the app's response to 404 OK (https://httpstatuses.com/404)
           */
          res.writeHead(404, { 'Content-Type': 'text/html' })
          console.log(`SSR of unrouted path ${req.path} (404 ahead)`)
        }
        else {
          /**
           * Set the app's response to 200 OK (https://httpstatuses.com/200)
           */
          res.writeHead(200, { 'Content-Type': 'text/html' })
          console.log(`SSR of ${req.path}`);
        }
        const { launch_year, launch_success, land_success } = req.query
        const initialData = {
            yearProp: launch_year || "",
            launchProp: launch_success || "",
            landingProp: land_success || ""
        }

        /**
         * Convert JSX code to a HTML string that can be rendered server-side with
         * `renderToString` a method provided by ReactDOMServer
         *
         * This sets up the app so that calling ReactDOM.hydrate() will preserve the
         * rendered HTML and only attach event handlers. 
         * (https://reactjs.org/docs/react-dom-server.html#rendertostring)
         */
          const jsx = <StaticRouter location={req.url}>
              <App initialState={initialData}/>
          </StaticRouter>
        const reactDom = renderToString(jsx);

        /**
         * inject the rendered app and it state 
         * into our html and send it
         */
        
          const doc=  htmlData.replace(
            '<div id="root"></div>',
            `<div id="root">${reactDom}</div><script>window.__initial_data=${serialize(initialData)}</script>`
          )
     
        return res.end(
         doc
        );
      });
    }
    else {
      req._possible404 = true;
      return next();
    }
  };
};